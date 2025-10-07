use crate::atoms::{Atom, Triple, TripleIndex, VarId};
use crate::binding::{merge_bindings, Binding};
use fixedbitset::FixedBitSet;
use indexmap::IndexMap;
use petgraph::graph::UnGraph;
use petgraph::visit::Dfs;
use std::collections::{HashMap, HashSet};

pub type CxnId = usize;

#[derive(Debug, Clone)]
pub struct CXN {
    pub id: CxnId,
    pub variables: Vec<VarId>,
    pub matching: TripleIndex,
    pub merging: TripleIndex,
    pub binding: Binding,
    pub all_different: Vec<VarId>,
}

impl CXN {
    pub fn fresh(&self, next_var_id: &mut VarId) -> Self {
        let mut var_mapping = HashMap::new();
        for &old_var in &self.variables {
            var_mapping.insert(old_var, *next_var_id);
            *next_var_id += 1;
        }

        let new_variables = self.variables.iter().map(|v| var_mapping[v]).collect();

        let new_matching = self
            .matching
            .iter()
            .map(|t| rename_triple(t, &var_mapping))
            .collect();

        let new_merging = self
            .merging
            .iter()
            .map(|t| rename_triple(t, &var_mapping))
            .collect();

        let mut new_binding = self.binding.rename(&var_mapping);

        for &v in &self.all_different {
            for &w in &self.all_different {
                if v < w {
                    let new_v = var_mapping[&v];
                    let new_w = var_mapping[&w];
                    new_binding.add_disequality(new_v, new_w);
                }
            }
        }

        Self {
            id: self.id,
            variables: new_variables,
            matching: new_matching,
            merging: new_merging,
            binding: new_binding,
            all_different: self.all_different.iter().map(|v| var_mapping[v]).collect(),
        }
    }
}

fn rename_triple(triple: &Triple, mapping: &HashMap<VarId, VarId>) -> Triple {
    let e = match triple.e {
        Atom::Var(v) => Atom::Var(mapping.get(&v).copied().unwrap_or(v)),
        c => c,
    };
    let v = match triple.v {
        Atom::Var(var) => Atom::Var(mapping.get(&var).copied().unwrap_or(var)),
        c => c,
    };
    Triple::new(e, triple.a, v)
}

#[derive(Debug, Clone)]
pub struct InitCXN {
    pub id: CxnId,
    pub variables: Vec<VarId>,
    pub merging: TripleIndex,
    pub binding: Binding,
}

impl InitCXN {
    pub fn fresh(&self, next_var_id: &mut VarId) -> Self {
        let mut var_mapping = HashMap::new();
        for &old_var in &self.variables {
            var_mapping.insert(old_var, *next_var_id);
            *next_var_id += 1;
        }

        let new_variables = self.variables.iter().map(|v| var_mapping[v]).collect();

        let new_merging = self
            .merging
            .iter()
            .map(|t| rename_triple(t, &var_mapping))
            .collect();

        let new_binding = self.binding.rename(&var_mapping);

        Self {
            id: self.id,
            variables: new_variables,
            merging: new_merging,
            binding: new_binding,
        }
    }
}

#[derive(Debug, Clone)]
pub struct Precomp {
    pub id: usize,
    pub matching_id: CxnId,
    pub merging_id: CxnId,
    pub matching_variables: Vec<VarId>,
    pub merging_variables: Vec<VarId>,
    pub binding: Binding,
    pub touched_match_triples: FixedBitSet,
}

impl Precomp {
    pub fn fresh(&self, next_var_id: &mut VarId) -> Self {
        let mut var_mapping = HashMap::new();

        for &v in &self.matching_variables {
            var_mapping.insert(v, *next_var_id);
            *next_var_id += 1;
        }
        for &v in &self.merging_variables {
            if let std::collections::hash_map::Entry::Vacant(e) = var_mapping.entry(v) {
                e.insert(*next_var_id);
                *next_var_id += 1;
            }
        }

        let new_matching_variables = self
            .matching_variables
            .iter()
            .map(|v| var_mapping[v])
            .collect();

        let new_merging_variables = self
            .merging_variables
            .iter()
            .map(|v| var_mapping[v])
            .collect();

        let new_binding = self.binding.rename(&var_mapping);

        Self {
            id: self.id,
            matching_id: self.matching_id,
            merging_id: self.merging_id,
            matching_variables: new_matching_variables,
            merging_variables: new_merging_variables,
            binding: new_binding,
            touched_match_triples: self.touched_match_triples.clone(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct Grammar {
    pub cxns: IndexMap<CxnId, CXN>,
    pub init_cxns: IndexMap<CxnId, InitCXN>,
    pub precomps: IndexMap<usize, Precomp>,
    pub precomps_for_merge: IndexMap<CxnId, Vec<usize>>,
}

impl Grammar {
    pub fn new() -> Self {
        Self {
            cxns: IndexMap::new(),
            init_cxns: IndexMap::new(),
            precomps: IndexMap::new(),
            precomps_for_merge: IndexMap::new(),
        }
    }
}

impl Default for Grammar {
    fn default() -> Self {
        Self::new()
    }
}

fn find_variable_sharing_components(triples: &TripleIndex) -> Vec<Vec<usize>> {
    let mut graph = UnGraph::new_undirected();
    let mut node_map = HashMap::new();

    for (idx, _) in triples.iter().enumerate() {
        let node = graph.add_node(idx);
        node_map.insert(idx, node);
    }

    for (i, t1) in triples.iter().enumerate() {
        for (j, t2) in triples.iter().enumerate() {
            if i >= j {
                continue;
            }

            let mut shares_var = false;
            if let (Atom::Var(v1), Atom::Var(v2)) = (t1.e, t2.e) {
                if v1 == v2 {
                    shares_var = true;
                }
            }
            if let (Atom::Var(v1), Atom::Var(v2)) = (t1.v, t2.v) {
                if v1 == v2 {
                    shares_var = true;
                }
            }
            if let (Atom::Var(v1), Atom::Var(v2)) = (t1.e, t2.v) {
                if v1 == v2 {
                    shares_var = true;
                }
            }
            if let (Atom::Var(v1), Atom::Var(v2)) = (t1.v, t2.e) {
                if v1 == v2 {
                    shares_var = true;
                }
            }

            if shares_var {
                graph.add_edge(node_map[&i], node_map[&j], ());
            }
        }
    }

    let mut visited = HashSet::new();
    let mut components = Vec::new();

    for (idx, &node) in &node_map {
        if visited.contains(idx) {
            continue;
        }

        let mut component = Vec::new();
        let mut dfs = Dfs::new(&graph, node);

        while let Some(nx) = dfs.next(&graph) {
            let triple_idx = graph[nx];
            if !visited.contains(&triple_idx) {
                visited.insert(triple_idx);
                component.push(triple_idx);
            }
        }

        if !component.is_empty() {
            components.push(component);
        }
    }

    components
}

pub fn merge_match_precompute(
    merge_cxn: &CXN,
    match_cxn: &CXN,
    next_precomp_id: &mut usize,
) -> Vec<Precomp> {
    let mut results = Vec::new();

    let components = find_variable_sharing_components(&match_cxn.matching);

    for component in components {
        let pairs = enumerate_merge_match_pairs(
            &merge_cxn.merging,
            &match_cxn.matching,
            &component,
            &match_cxn.all_different,
        );

        for (binding, touched) in pairs {
            if !binding.valid {
                continue;
            }

            let merged = merge_bindings(&[
                merge_cxn.binding.clone(),
                match_cxn.binding.clone(),
                binding,
            ]);
            if !merged.valid {
                continue;
            }

            results.push(Precomp {
                id: *next_precomp_id,
                matching_id: match_cxn.id,
                merging_id: merge_cxn.id,
                matching_variables: match_cxn.variables.clone(),
                merging_variables: merge_cxn.variables.clone(),
                binding: merged,
                touched_match_triples: touched,
            });
            *next_precomp_id += 1;
        }
    }

    results
}

fn enumerate_merge_match_pairs(
    merge_triples: &TripleIndex,
    match_triples: &TripleIndex,
    component: &[usize],
    all_different: &[VarId],
) -> Vec<(Binding, FixedBitSet)> {
    let mut pairs = Vec::new();

    for merge_triple in merge_triples.iter() {
        for &match_idx in component {
            if let Some(match_triple) = match_triples.get(match_idx) {
                let mut binding = Binding::new();
                if binding.unify_triple(merge_triple, match_triple) {
                    pairs.push((binding, match_idx));
                }
            }
        }
    }

    let mut results = Vec::new();
    let max_match_idx = match_triples.len();

    enumerate_subsets(&pairs, all_different, max_match_idx, &mut results);

    results
}

fn enumerate_subsets(
    pairs: &[(Binding, usize)],
    all_different: &[VarId],
    max_match_idx: usize,
    results: &mut Vec<(Binding, FixedBitSet)>,
) {
    if pairs.is_empty() {
        return;
    }

    let n = pairs.len();
    let max_subsets = 1 << n;

    for mask in 1..max_subsets {
        let mut bindings = Vec::new();
        let mut touched = FixedBitSet::with_capacity(max_match_idx);

        for (i, pair) in pairs.iter().enumerate() {
            if (mask & (1 << i)) != 0 {
                bindings.push(pair.0.clone());
                touched.set(pair.1, true);
            }
        }

        let merged = merge_bindings(&bindings);
        if !merged.valid {
            continue;
        }

        let mut valid_diseq = true;
        for &v1 in all_different {
            for &v2 in all_different {
                if v1 < v2 && merged.find(v1) == merged.find(v2) {
                    valid_diseq = false;
                    break;
                }
            }
            if !valid_diseq {
                break;
            }
        }

        if valid_diseq {
            results.push((merged, touched));
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fresh_cxn() {
        let cxn = CXN {
            id: 0,
            variables: vec![0, 1],
            matching: TripleIndex::from_vec(vec![Triple::new(Atom::Var(0), 0, Atom::Var(1))]),
            merging: TripleIndex::new(),
            binding: Binding::new(),
            all_different: vec![],
        };

        let mut next_id = 10;
        let fresh = cxn.fresh(&mut next_id);

        assert_eq!(fresh.variables, vec![10, 11]);
        assert_eq!(next_id, 12);
    }

    #[test]
    fn test_precompute_simple() {
        let merge_cxn = CXN {
            id: 0,
            variables: vec![0, 1],
            matching: TripleIndex::new(),
            merging: TripleIndex::from_vec(vec![Triple::new(Atom::Var(0), 0, Atom::Var(1))]),
            binding: Binding::new(),
            all_different: vec![],
        };

        let match_cxn = CXN {
            id: 1,
            variables: vec![2, 3],
            matching: TripleIndex::from_vec(vec![Triple::new(Atom::Var(2), 0, Atom::Var(3))]),
            merging: TripleIndex::new(),
            binding: Binding::new(),
            all_different: vec![],
        };

        let mut next_id = 0;
        let precomps = merge_match_precompute(&merge_cxn, &match_cxn, &mut next_id);

        assert!(!precomps.is_empty());
    }
}
