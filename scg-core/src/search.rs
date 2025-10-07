//! Runtime search structures and algorithms
//!
//! Implements the runtime parser with:
//! - Node: construction application
//! - Partial: derived from Node via Precomp
//! - SearchSpace: manages parsing state
//! - covering_partials: solves the set cover problem

use crate::binding::Binding;
use crate::construction::CXN;
use crate::precompute::Precomp;
use crate::triple::Id;
use crate::variable::Variable;
use std::collections::{HashMap, HashSet, VecDeque};

/// Node represents a construction application
#[derive(Debug, Clone)]
pub struct Node {
    pub id: Id,
    pub cxn_id: Id,
    /// Parent partial IDs that contributed to this node
    pub parent_partials: Vec<Id>,
    pub exploration_depth: usize,
    pub timestamp: u64,
    /// Union of variables from all parent partials
    pub union_variables: Vec<Variable>,
    pub binding: Binding,
    /// Ancestor node IDs
    pub ancestor_nodes: HashSet<Id>,
}

impl Node {
    pub fn new(
        id: Id,
        cxn_id: Id,
        parent_partials: Vec<Id>,
        depth: usize,
        timestamp: u64,
        variables: Vec<Variable>,
        binding: Binding,
        ancestor_nodes: HashSet<Id>,
    ) -> Self {
        Node {
            id,
            cxn_id,
            parent_partials,
            exploration_depth: depth,
            timestamp,
            union_variables: variables,
            binding,
            ancestor_nodes,
        }
    }
}

/// Partial derived from a Node using a Precomp
#[derive(Debug, Clone)]
pub struct Partial {
    pub id: Id,
    pub node_id: Id,
    pub precomp_id: Id,
    pub matching_cxn_id: Id,
    pub matching_variables: Vec<Variable>,
    pub merging_variables: Vec<Variable>,
    pub binding: Binding,
    /// Bitset of touched match triple indices
    pub touched_match_triples: HashSet<usize>,
}

impl Partial {
    /// Check if two partials are compatible (bindings can be merged)
    pub fn compatible_with(&self, other: &Partial) -> bool {
        if self.matching_cxn_id != other.matching_cxn_id {
            return false;
        }

        let merged = Binding::merge(vec![self.binding.clone(), other.binding.clone()]);
        merged.is_valid()
    }

    /// Check if two partials conflict
    pub fn conflicts_with(&self, other: &Partial) -> bool {
        !self.compatible_with(other)
    }
}

/// Configuration for covering solver
#[derive(Debug, Clone)]
pub struct CoveringConfig {
    /// Cost model for partials (default: uniform cost = 1)
    pub cost_fn: fn(&Partial) -> f64,
}

impl Default for CoveringConfig {
    fn default() -> Self {
        CoveringConfig {
            cost_fn: |_| 1.0,
        }
    }
}

/// Solve the covering problem greedily
///
/// Find a minimal set of compatible partials that cover the universe U,
/// with at least one seed partial included.
pub fn covering_partials_greedy(
    universe: &HashSet<usize>,
    candidates: &[Partial],
    seed_partial: &Partial,
    config: &CoveringConfig,
) -> Option<Vec<Partial>> {
    if !candidates.iter().any(|p| p.id == seed_partial.id) {
        return None;
    }

    let mut covered = seed_partial.touched_match_triples.clone();
    let mut selected = vec![seed_partial.clone()];
    let mut remaining_candidates: Vec<_> = candidates
        .iter()
        .filter(|p| p.id != seed_partial.id)
        .collect();

    // Greedy: pick partial with best gain/cost ratio
    while &covered != universe {
        let mut best: Option<(usize, f64)> = None;

        for (idx, partial) in remaining_candidates.iter().enumerate() {
            // Check compatibility with all selected
            if selected.iter().any(|s| partial.conflicts_with(s)) {
                continue;
            }

            let new_coverage: HashSet<_> = partial
                .touched_match_triples
                .difference(&covered)
                .copied()
                .collect();

            if new_coverage.is_empty() {
                continue;
            }

            let gain = new_coverage.len() as f64;
            let cost = (config.cost_fn)(partial);
            let ratio = gain / cost.max(0.001);

            if best.is_none() || ratio > best.unwrap().1 {
                best = Some((idx, ratio));
            }
        }

        if let Some((best_idx, _)) = best {
            let partial = remaining_candidates.remove(best_idx).clone();
            covered.extend(&partial.touched_match_triples);
            selected.push(partial);
        } else {
            // Can't cover
            return None;
        }
    }

    Some(selected)
}

/// Search space for parsing
pub struct SearchSpace {
    /// Construction ID -> construction
    constructions: HashMap<Id, CXN>,
    /// Precomp ID -> precomp (kept for reference)
    _precomps: HashMap<Id, Precomp>,
    /// Merging construction ID -> precomps
    precomps_by_merging: HashMap<Id, Vec<Precomp>>,
    /// All nodes
    nodes: HashMap<Id, Node>,
    /// All partials
    partials: HashMap<Id, Partial>,
    /// Delta partials by matching construction (newly added)
    delta_partials: HashMap<Id, VecDeque<Partial>>,
    /// Counters
    next_node_id: u64,
    next_partial_id: u64,
    timestamp: u64,
    /// Covering config
    covering_config: CoveringConfig,
}

impl SearchSpace {
    pub fn new(
        constructions: HashMap<Id, CXN>,
        precomps: HashMap<Id, Precomp>,
        precomps_by_merging: HashMap<Id, Vec<Precomp>>,
    ) -> Self {
        SearchSpace {
            constructions,
            _precomps: precomps,
            precomps_by_merging,
            nodes: HashMap::new(),
            partials: HashMap::new(),
            delta_partials: HashMap::new(),
            next_node_id: 1,
            next_partial_id: 1,
            timestamp: 0,
            covering_config: CoveringConfig::default(),
        }
    }

    /// Add a node and generate partials for it
    pub fn add_node(&mut self, node: Node) {
        let node_id = node.id;
        self.nodes.insert(node_id, node.clone());

        // Generate partials for this node
        let partials = self.partials_for_node(&node);

        for partial in partials {
            let matching_cxn_id = partial.matching_cxn_id;
            self.partials.insert(partial.id, partial.clone());

            // Add to delta queue
            self.delta_partials
                .entry(matching_cxn_id)
                .or_insert_with(VecDeque::new)
                .push_back(partial);
        }
    }

    /// Generate all partials for a node
    fn partials_for_node(&mut self, node: &Node) -> Vec<Partial> {
        let mut result = Vec::new();

        // Get precomps for this node's construction
        if let Some(precomps) = self.precomps_by_merging.get(&node.cxn_id) {
            for precomp in precomps {
                // Align merging variables with node's union variables
                let mut binding = node.binding.clone();

                // Unify precomp merging vars with node union vars
                for (precomp_var, node_var) in precomp
                    .merging_variables
                    .iter()
                    .zip(node.union_variables.iter())
                {
                    if binding.unify(precomp_var.id, node_var.id).is_err() {
                        continue;
                    }
                }

                if binding.is_valid() {
                    let partial = Partial {
                        id: {
                            let id = self.next_partial_id;
                            self.next_partial_id += 1;
                            id
                        },
                        node_id: node.id,
                        precomp_id: precomp.id,
                        matching_cxn_id: precomp.matching_cxn_id,
                        matching_variables: precomp.matching_variables.clone(),
                        merging_variables: precomp.merging_variables.clone(),
                        binding,
                        touched_match_triples: precomp.touched_match_triples.clone(),
                    };
                    result.push(partial);
                }
            }
        }

        result
    }

    /// Try to apply a construction
    pub fn tick(&mut self, cxn_id: Id) -> bool {
        if let Some(cxn) = self.constructions.get(&cxn_id).cloned() {
            // Get delta partials for this construction
            let deltas = self
                .delta_partials
                .get_mut(&cxn_id)
                .map(|dq| std::mem::take(dq))
                .unwrap_or_default();

            if deltas.is_empty() {
                return false;
            }

            // Get all partials for this construction
            let all_partials: Vec<_> = self
                .partials
                .values()
                .filter(|p| p.matching_cxn_id == cxn_id)
                .cloned()
                .collect();

            // Universe is all match triple indices
            let match_triples: Vec<_> = cxn.matching.iter().collect();
            let universe: HashSet<usize> = (0..match_triples.len()).collect();

            // Try to find covering for each delta partial
            for seed_partial in deltas {
                if let Some(covering) = covering_partials_greedy(
                    &universe,
                    &all_partials,
                    &seed_partial,
                    &self.covering_config,
                ) {
                    // Create a new node from this covering
                    let node_id = self.next_node_id;
                    self.next_node_id += 1;

                    // Merge bindings
                    let bindings: Vec<_> = covering.iter().map(|p| p.binding.clone()).collect();
                    let merged_binding = Binding::merge(bindings);

                    if !merged_binding.is_valid() {
                        continue;
                    }

                    // Collect union variables
                    let mut union_vars: Vec<Variable> = Vec::new();
                    for partial in &covering {
                        for var in &partial.matching_variables {
                            if !union_vars.contains(var) {
                                union_vars.push(*var);
                            }
                        }
                    }

                    // Collect ancestor nodes
                    let mut ancestor_nodes = HashSet::new();
                    for partial in &covering {
                        if let Some(node) = self.nodes.get(&partial.node_id) {
                            ancestor_nodes.insert(node.id);
                            ancestor_nodes.extend(&node.ancestor_nodes);
                        }
                    }

                    let max_depth = covering
                        .iter()
                        .filter_map(|p| self.nodes.get(&p.node_id))
                        .map(|n| n.exploration_depth)
                        .max()
                        .unwrap_or(0);

                    let node = Node::new(
                        node_id,
                        cxn_id,
                        covering.iter().map(|p| p.id).collect(),
                        max_depth + 1,
                        self.timestamp,
                        union_vars,
                        merged_binding,
                        ancestor_nodes,
                    );

                    self.timestamp += 1;
                    self.add_node(node);
                    return true;
                }
            }
        }

        false
    }

    /// Get all nodes
    pub fn nodes(&self) -> &HashMap<Id, Node> {
        &self.nodes
    }

    /// Get root nodes (no ancestors or only self)
    pub fn root_nodes(&self) -> Vec<&Node> {
        self.nodes
            .values()
            .filter(|n| n.ancestor_nodes.is_empty())
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_partial_compatibility() {
        let v1 = Variable::new(Variable::make_variable_id(1));
        let _v2 = Variable::new(Variable::make_variable_id(2));

        let mut b1 = Binding::new();
        b1.unify(v1.id, 100).unwrap();

        let mut b2 = Binding::new();
        b2.unify(v1.id, 200).unwrap();

        let p1 = Partial {
            id: 1,
            node_id: 1,
            precomp_id: 1,
            matching_cxn_id: 1,
            matching_variables: vec![v1],
            merging_variables: vec![],
            binding: b1,
            touched_match_triples: HashSet::new(),
        };

        let p2 = Partial {
            id: 2,
            node_id: 2,
            precomp_id: 2,
            matching_cxn_id: 1,
            matching_variables: vec![v1],
            merging_variables: vec![],
            binding: b2,
            touched_match_triples: HashSet::new(),
        };

        assert!(p1.conflicts_with(&p2));
    }

    #[test]
    fn test_covering_simple() {
        let v1 = Variable::new(Variable::make_variable_id(1));

        let mut touched1 = HashSet::new();
        touched1.insert(0);
        touched1.insert(1);

        let p1 = Partial {
            id: 1,
            node_id: 1,
            precomp_id: 1,
            matching_cxn_id: 1,
            matching_variables: vec![v1],
            merging_variables: vec![],
            binding: Binding::new(),
            touched_match_triples: touched1,
        };

        let universe: HashSet<usize> = vec![0, 1].into_iter().collect();

        let result = covering_partials_greedy(
            &universe,
            &[p1.clone()],
            &p1,
            &CoveringConfig::default(),
        );

        assert!(result.is_some());
        assert_eq!(result.unwrap().len(), 1);
    }
}
