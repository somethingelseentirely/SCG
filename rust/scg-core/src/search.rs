use crate::atoms::{TripleIndex, VarId};
use crate::binding::{merge_bindings, Binding};
use crate::grammar::{CxnId, Grammar};
use fixedbitset::FixedBitSet;
use indexmap::IndexMap;
use std::collections::{HashSet, VecDeque};

pub type NodeId = usize;
pub type PartialId = usize;

#[derive(Debug, Clone)]
pub struct Node {
    pub id: NodeId,
    pub cxn_id: CxnId,
    pub binding: Binding,
    pub merging: TripleIndex,
    pub parent_partials: Vec<PartialId>,
}

#[derive(Debug, Clone)]
pub struct Partial {
    pub id: PartialId,
    pub cxn_id: CxnId,
    pub precomp_id: usize,
    pub parent_node: NodeId,
    pub binding: Binding,
    pub touched_match_triples: FixedBitSet,
}

#[derive(Debug)]
pub struct SearchSpace {
    pub grammar: Grammar,
    pub nodes: IndexMap<NodeId, Node>,
    pub partials: IndexMap<PartialId, Partial>,
    pub partials_by_cxn: IndexMap<CxnId, Vec<PartialId>>,
    next_node_id: NodeId,
    next_partial_id: PartialId,
    next_var_id: VarId,
}

impl SearchSpace {
    pub fn new(grammar: Grammar) -> Self {
        Self {
            grammar,
            nodes: IndexMap::new(),
            partials: IndexMap::new(),
            partials_by_cxn: IndexMap::new(),
            next_node_id: 0,
            next_partial_id: 0,
            next_var_id: 10000,
        }
    }

    pub fn add_init_nodes(&mut self, input_triples: TripleIndex) {
        for triple in input_triples.iter() {
            for init_cxn in self.grammar.init_cxns.values() {
                let fresh = init_cxn.fresh(&mut self.next_var_id);

                let mut binding = fresh.binding.clone();
                let mut matched = false;

                for merge_triple in fresh.merging.iter() {
                    if binding.unify_triple(triple, merge_triple) {
                        matched = true;
                        break;
                    }
                }

                if matched && binding.valid {
                    let node_id = self.next_node_id;
                    self.next_node_id += 1;

                    let node = Node {
                        id: node_id,
                        cxn_id: fresh.id,
                        binding,
                        merging: fresh.merging,
                        parent_partials: Vec::new(),
                    };

                    self.nodes.insert(node_id, node);
                }
            }
        }
    }

    pub fn tick(&mut self, cxn_id: CxnId) -> bool {
        let partials = self
            .partials_by_cxn
            .get(&cxn_id)
            .cloned()
            .unwrap_or_default();

        if partials.is_empty() {
            return false;
        }

        let seed_partial_id = partials[0];
        let seed_partial = self.partials.get(&seed_partial_id).unwrap().clone();

        self.partials_by_cxn.get_mut(&cxn_id).unwrap().remove(0);

        let covering = covering_partials(&self.partials, &seed_partial, cxn_id);

        if covering.is_empty() {
            return false;
        }

        let bindings: Vec<_> = covering
            .iter()
            .filter_map(|pid| self.partials.get(pid))
            .map(|p| p.binding.clone())
            .collect();

        let merged_binding = merge_bindings(&bindings);

        if !merged_binding.valid {
            return false;
        }

        let cxn = self.grammar.cxns.get(&cxn_id).unwrap();
        let fresh_cxn = cxn.fresh(&mut self.next_var_id);

        let final_binding = merge_bindings(&[merged_binding, fresh_cxn.binding]);

        if !final_binding.valid {
            return false;
        }

        let node_id = self.next_node_id;
        self.next_node_id += 1;

        let node = Node {
            id: node_id,
            cxn_id,
            binding: final_binding,
            merging: fresh_cxn.merging,
            parent_partials: covering.clone(),
        };

        self.nodes.insert(node_id, node);

        self.generate_partials_for_node(node_id);

        true
    }

    fn generate_partials_for_node(&mut self, node_id: NodeId) {
        let node = self.nodes.get(&node_id).unwrap();

        for (&merging_cxn_id, precomp_ids) in &self.grammar.precomps_for_merge {
            if merging_cxn_id != node.cxn_id {
                continue;
            }

            for &precomp_id in precomp_ids {
                let precomp = self.grammar.precomps.get(&precomp_id).unwrap();
                let fresh_precomp = precomp.fresh(&mut self.next_var_id);

                let merged = merge_bindings(&[node.binding.clone(), fresh_precomp.binding]);

                if !merged.valid {
                    continue;
                }

                let partial_id = self.next_partial_id;
                self.next_partial_id += 1;

                let partial = Partial {
                    id: partial_id,
                    cxn_id: fresh_precomp.matching_id,
                    precomp_id: fresh_precomp.id,
                    parent_node: node_id,
                    binding: merged,
                    touched_match_triples: fresh_precomp.touched_match_triples,
                };

                self.partials.insert(partial_id, partial);
                self.partials_by_cxn
                    .entry(fresh_precomp.matching_id)
                    .or_default()
                    .push(partial_id);
            }
        }
    }

    pub fn generate_parsing_results(&self) -> Vec<(Vec<NodeId>, TripleIndex, Binding)> {
        let mut results = Vec::new();

        let root_nodes: Vec<_> = self.nodes.keys().copied().collect();

        let node_sets = maximal_consistent_subsets(&root_nodes, &self.nodes);

        for node_set in node_sets {
            let (triples, binding) = self.extract_triples(&node_set);
            results.push((node_set, triples, binding));
        }

        results
    }

    fn extract_triples(&self, node_ids: &[NodeId]) -> (TripleIndex, Binding) {
        let mut all_triples = Vec::new();
        let mut bindings = Vec::new();
        let mut visited = HashSet::new();
        let mut queue = VecDeque::new();

        for &node_id in node_ids {
            queue.push_back(node_id);
        }

        while let Some(node_id) = queue.pop_front() {
            if visited.contains(&node_id) {
                continue;
            }
            visited.insert(node_id);

            if let Some(node) = self.nodes.get(&node_id) {
                bindings.push(node.binding.clone());
                all_triples.extend(node.merging.iter().cloned());

                for &partial_id in &node.parent_partials {
                    if let Some(partial) = self.partials.get(&partial_id) {
                        queue.push_back(partial.parent_node);
                    }
                }
            }
        }

        let binding = merge_bindings(&bindings);

        let walked_triples: TripleIndex =
            all_triples.iter().map(|t| binding.walk_triple(t)).collect();

        (walked_triples, binding)
    }
}

pub fn covering_partials(
    all_partials: &IndexMap<PartialId, Partial>,
    seed: &Partial,
    cxn_id: CxnId,
) -> Vec<PartialId> {
    let mut covering = vec![seed.id];
    let mut covered = seed.touched_match_triples.clone();

    let candidates: Vec<_> = all_partials
        .values()
        .filter(|p| p.cxn_id == cxn_id && p.id != seed.id)
        .collect();

    loop {
        let mut best_partial = None;
        let mut best_new_coverage = 0;

        for partial in &candidates {
            if covering.contains(&partial.id) {
                continue;
            }

            let new_bits = partial.touched_match_triples.difference(&covered).count();

            if new_bits > best_new_coverage {
                let test_binding = merge_bindings(&[seed.binding.clone(), partial.binding.clone()]);

                if test_binding.valid {
                    best_new_coverage = new_bits;
                    best_partial = Some(partial.id);
                }
            }
        }

        if let Some(pid) = best_partial {
            covering.push(pid);
            if let Some(p) = all_partials.get(&pid) {
                covered.union_with(&p.touched_match_triples);
            }
        } else {
            break;
        }
    }

    covering
}

fn maximal_consistent_subsets(
    node_ids: &[NodeId],
    nodes: &IndexMap<NodeId, Node>,
) -> Vec<Vec<NodeId>> {
    if node_ids.is_empty() {
        return vec![vec![]];
    }

    let mut results = Vec::new();
    let n = node_ids.len();
    let max_mask = 1 << n;

    for mask in 1..max_mask {
        let mut subset = Vec::new();
        for (i, &node_id) in node_ids.iter().enumerate() {
            if (mask & (1 << i)) != 0 {
                subset.push(node_id);
            }
        }

        let bindings: Vec<_> = subset
            .iter()
            .filter_map(|id| nodes.get(id))
            .map(|n| n.binding.clone())
            .collect();

        let merged = merge_bindings(&bindings);
        if merged.valid {
            results.push(subset);
        }
    }

    results.sort_by_key(|s| std::cmp::Reverse(s.len()));

    let mut maximal = Vec::new();
    for candidate in results {
        let is_maximal = !maximal
            .iter()
            .any(|existing: &Vec<NodeId>| candidate.iter().all(|id| existing.contains(id)));

        if is_maximal {
            maximal.push(candidate);
        }
    }

    maximal
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::grammar::Grammar;

    #[test]
    fn test_search_space_init() {
        let grammar = Grammar::new();
        let space = SearchSpace::new(grammar);
        assert_eq!(space.nodes.len(), 0);
    }

    #[test]
    fn test_covering_minimal() {
        let partials = IndexMap::new();
        let seed = Partial {
            id: 0,
            cxn_id: 0,
            precomp_id: 0,
            parent_node: 0,
            binding: Binding::new(),
            touched_match_triples: FixedBitSet::with_capacity(2),
        };

        let covering = covering_partials(&partials, &seed, 0);
        assert_eq!(covering, vec![0]);
    }
}
