//! Precomputation of merge-match interactions
//!
//! Precomputes all valid combinations of triple unifications between
//! merging and matching triples, maintaining binding consistency.

use crate::binding::Binding;
use crate::construction::{Construction, CXN};
use crate::triple::{Id, Triple};
use crate::variable::Variable;
use std::collections::{BTreeSet, HashMap, HashSet};

/// Precomputed merge-match interaction
#[derive(Debug, Clone)]
pub struct Precomp {
    pub id: Id,
    pub matching_cxn_id: Id,
    pub merging_cxn_id: Id,
    pub matching_variables: Vec<Variable>,
    pub merging_variables: Vec<Variable>,
    pub binding: Binding,
    /// Bitset of touched match triple indices
    pub touched_match_triples: HashSet<usize>,
}

impl Precomp {
    pub fn fresh(&self, var_counter: &mut u64) -> Self {
        let new_matching_vars: Vec<Variable> = self
            .matching_variables
            .iter()
            .map(|_| Variable::new(crate::util::fresh_variable_id(var_counter)))
            .collect();

        let new_merging_vars: Vec<Variable> = self
            .merging_variables
            .iter()
            .map(|_| Variable::new(crate::util::fresh_variable_id(var_counter)))
            .collect();

        let mut renamings = HashMap::new();
        for (old, new) in self.matching_variables.iter().zip(new_matching_vars.iter()) {
            renamings.insert(old.id, new.id);
        }
        for (old, new) in self.merging_variables.iter().zip(new_merging_vars.iter()) {
            renamings.insert(old.id, new.id);
        }

        Precomp {
            id: self.id,
            matching_cxn_id: self.matching_cxn_id,
            merging_cxn_id: self.merging_cxn_id,
            matching_variables: new_matching_vars,
            merging_variables: new_merging_vars,
            binding: self.binding.rename(&renamings),
            touched_match_triples: self.touched_match_triples.clone(),
        }
    }
}

/// Configuration for precomputation
#[derive(Debug, Clone)]
pub struct PrecomputeConfig {
    /// Maximum number of precomps to keep per touched set (Pareto frontier)
    pub max_precomps_per_touched_set: usize,
    /// Whether to allow self-pairing (merge_cxn == match_cxn)
    pub allow_self_pairing: bool,
}

impl Default for PrecomputeConfig {
    fn default() -> Self {
        PrecomputeConfig {
            max_precomps_per_touched_set: 4,
            #[cfg(feature = "self-pairing")]
            allow_self_pairing: true,
            #[cfg(not(feature = "self-pairing"))]
            allow_self_pairing: false,
        }
    }
}

/// Precompute merge-match interactions between two constructions
pub fn precompute_merge_match(
    merge_cxn: &CXN,
    match_cxn: &CXN,
    component_indices: &[usize],
    config: &PrecomputeConfig,
    precomp_id_counter: &mut u64,
    var_counter: &mut u64,
) -> Vec<Precomp> {
    // Freshen both constructions
    let fresh_merge = merge_cxn.fresh(var_counter);
    let fresh_match = match_cxn.fresh(var_counter);

    // Merge their initial bindings
    let base_binding = Binding::merge(vec![
        fresh_merge.binding.clone(),
        fresh_match.binding.clone(),
    ]);

    if !base_binding.is_valid() {
        return vec![];
    }

    // Get component triples
    let match_triples: Vec<Triple> = fresh_match.matching.iter().copied().collect();
    let component_triples: Vec<(usize, Triple)> = component_indices
        .iter()
        .map(|&idx| (idx, match_triples[idx]))
        .collect();

    // Get merge triples
    let merge_triples: Vec<Triple> = fresh_merge.merging.iter().copied().collect();

    // Generate all possible triple pairs (merge_triple, match_triple) with same attribute
    let mut pairs: Vec<(usize, Triple, Triple)> = Vec::new();

    for (match_idx, match_triple) in &component_triples {
        for merge_triple in &merge_triples {
            if merge_triple.a == match_triple.a {
                // Can potentially unify
                let mut test_binding = base_binding.clone();
                if test_binding.unify_triple(*merge_triple, *match_triple).is_ok() {
                    pairs.push((*match_idx, *merge_triple, *match_triple));
                }
            }
        }
    }

    if pairs.is_empty() {
        return vec![];
    }

    // Enumerate consistent subsets using BFS over boolean lattice
    let mut results: Vec<Precomp> = Vec::new();
    let mut work: Vec<(HashSet<usize>, i32, bool)> = vec![(
        (0..pairs.len()).collect(),
        -1,
        false,
    )];

    // Group results by touched set
    let mut by_touched: HashMap<BTreeSet<usize>, Vec<Precomp>> = HashMap::new();

    while let Some((constraints, k, leftmost)) = work.pop() {
        let mut binding = base_binding.clone();
        let mut touched = HashSet::new();

        // Apply all constraints in the current subset
        let mut valid = true;
        for &idx in &constraints {
            let (match_idx, merge_triple, match_triple) = pairs[idx];
            if binding.unify_triple(merge_triple, match_triple).is_err() {
                valid = false;
                break;
            }
            touched.insert(match_idx);
        }

        if valid && binding.is_valid() {
            if !constraints.is_empty() {
                // Check if not subsumed by existing results
                let subsumed = results.iter().any(|r| {
                    r.touched_match_triples.is_subset(&touched) && r.touched_match_triples != touched
                });

                if !subsumed {
                    let touched_sorted: BTreeSet<usize> = touched.iter().copied().collect();
                    let precomp = Precomp {
                        id: {
                            let id = *precomp_id_counter;
                            *precomp_id_counter += 1;
                            id
                        },
                        matching_cxn_id: fresh_match.cxn_id,
                        merging_cxn_id: fresh_merge.cxn_id,
                        matching_variables: fresh_match.variables.clone(),
                        merging_variables: fresh_merge.variables.clone(),
                        binding,
                        touched_match_triples: touched.clone(),
                    };

                    by_touched.entry(touched_sorted).or_insert_with(Vec::new).push(precomp);
                }
            }
        } else {
            // Invalid binding - explore subsets
            if leftmost || {
                let mut test_binding = base_binding.clone();
                let mut test_valid = true;
                for &idx in &constraints {
                    if idx as i32 >= k {
                        continue;
                    }
                    let (_match_idx, merge_triple, match_triple) = pairs[idx];
                    if test_binding.unify_triple(merge_triple, match_triple).is_err() {
                        test_valid = false;
                        break;
                    }
                }
                test_valid && test_binding.is_valid()
            } {
                let mut new_leftmost = true;
                for &i in &constraints {
                    if (i as i32) > k {
                        let mut new_constraints = constraints.clone();
                        new_constraints.remove(&i);
                        work.push((new_constraints, i as i32, new_leftmost));
                        new_leftmost = false;
                    }
                }
            }
        }
    }

    // Keep only top K per touched set
    for precomps in by_touched.values() {
        for precomp in precomps.iter().take(config.max_precomps_per_touched_set) {
            results.push(precomp.clone());
        }
    }

    results
}

/// Precompute all merge-match pairs for a set of constructions
pub fn precompute_all(
    constructions: &[CXN],
    config: &PrecomputeConfig,
    precomp_id_counter: &mut u64,
    var_counter: &mut u64,
) -> Vec<Precomp> {
    let mut all_precomps = Vec::new();

    for merge_cxn in constructions {
        for match_cxn in constructions {
            // Skip self-pairing unless enabled
            if merge_cxn.cxn_id == match_cxn.cxn_id && !config.allow_self_pairing {
                continue;
            }

            // Precompute for each independent component
            for component in &match_cxn.independent_matching_components {
                let precomps = precompute_merge_match(
                    merge_cxn,
                    match_cxn,
                    component,
                    config,
                    precomp_id_counter,
                    var_counter,
                );
                all_precomps.extend(precomps);
            }
        }
    }

    all_precomps
}

/// Index precomps by merging construction for fast runtime lookup
pub fn index_precomps_by_merging(precomps: &[Precomp]) -> HashMap<Id, Vec<Precomp>> {
    let mut index: HashMap<Id, Vec<Precomp>> = HashMap::new();

    for precomp in precomps {
        index
            .entry(precomp.merging_cxn_id)
            .or_insert_with(Vec::new)
            .push(precomp.clone());
    }

    index
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::triple::TripleIndex;

    #[test]
    fn test_precompute_basic() {
        let v1 = Variable::new(Variable::make_variable_id(1));
        let v2 = Variable::new(Variable::make_variable_id(2));

        let mut merging = TripleIndex::new();
        merging.with_triples(vec![Triple::new(v1.id, 100, v2.id)]);

        let mut matching = TripleIndex::new();
        matching.with_triples(vec![Triple::new(v1.id, 100, v2.id)]);

        let merge_cxn = CXN::new(1, vec![v1, v2], merging.clone(), TripleIndex::new());
        let match_cxn = CXN::new(2, vec![v1, v2], TripleIndex::new(), matching);

        let config = PrecomputeConfig::default();
        let mut precomp_id = 1000;
        let mut var_id = 2000;

        let precomps = precompute_merge_match(
            &merge_cxn,
            &match_cxn,
            &[0],
            &config,
            &mut precomp_id,
            &mut var_id,
        );

        assert!(!precomps.is_empty());
    }
}
