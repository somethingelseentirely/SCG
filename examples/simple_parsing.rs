//! Simple parsing example
//!
//! Demonstrates basic SCG parsing with constructions and search

use scg_core::*;
use std::collections::HashMap;

fn main() {
    println!("=== SCG Parsing Example ===\n");

    // Create constructions
    let mut var_counter = 0u64;

    // Simple word construction: matches "cat" token, produces cat entity
    let v_word = Variable::new(util::fresh_variable_id(&mut var_counter));
    let v_cat = Variable::new(util::fresh_variable_id(&mut var_counter));

    let mut matching_cat = TripleIndex::new();
    matching_cat.with_triples(vec![Triple::new(v_word.id, 1000, 42)]);

    let mut merging_cat = TripleIndex::new();
    merging_cat.with_triples(vec![Triple::new(v_cat.id, 2000, 100)]);

    let cat_cxn = CXN::new(10, vec![v_word, v_cat], merging_cat, matching_cat);

    println!("Created construction: cat_cxn (id={})", cat_cxn.cxn_id);
    println!(
        "  Independent components: {}",
        cat_cxn.independent_matching_components.len()
    );

    // Create precomputations
    let mut precomp_id_counter = 1000u64;
    let mut constructions_map = HashMap::new();
    constructions_map.insert(cat_cxn.cxn_id, cat_cxn.clone());

    let config = precompute::PrecomputeConfig::default();
    let precomps = precompute::precompute_all(
        &[cat_cxn.clone()],
        &config,
        &mut precomp_id_counter,
        &mut var_counter,
    );

    println!("\nGenerated {} precomputations", precomps.len());

    // Index precomps
    let precomps_by_merging = precompute::index_precomps_by_merging(&precomps);

    // Create precomps map
    let mut precomps_map = HashMap::new();
    for p in &precomps {
        precomps_map.insert(p.id, p.clone());
    }

    // Create search space
    let mut search_space = SearchSpace::new(
        constructions_map,
        precomps_map,
        precomps_by_merging,
    );

    println!("\nSearch space initialized");
    println!("Constructions: {}", search_space.nodes().len());

    println!("\n=== Example Complete ===");
}
