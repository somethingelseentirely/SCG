//! Complete parsing example with chart assembly
//!
//! Demonstrates a full parsing workflow including:
//! - Construction definition
//! - Precomputation
//! - Search space management
//! - Node creation and tracking

use scg_core::*;
use std::collections::HashMap;

fn main() {
    println!("=== Complete Parsing Example ===\n");

    let mut var_counter = 0u64;
    let mut precomp_id_counter = 1000u64;

    // Create variables for constructions
    println!("Step 1: Creating constructions");

    // Construction 1: Word "the" -> determiner
    let v_word1 = Variable::new(util::fresh_variable_id(&mut var_counter));
    let v_det = Variable::new(util::fresh_variable_id(&mut var_counter));

    let mut matching_the = TripleIndex::new();
    matching_the.with_triples(vec![Triple::new(v_word1.id, 100, 1)]);

    let mut merging_det = TripleIndex::new();
    merging_det.with_triples(vec![Triple::new(v_det.id, 200, 10)]);

    let the_cxn = CXN::new(1, vec![v_word1, v_det], merging_det, matching_the);
    println!("  Created: the_cxn (word -> determiner)");

    // Construction 2: Word "cat" -> noun
    let v_word2 = Variable::new(util::fresh_variable_id(&mut var_counter));
    let v_noun = Variable::new(util::fresh_variable_id(&mut var_counter));

    let mut matching_cat = TripleIndex::new();
    matching_cat.with_triples(vec![Triple::new(v_word2.id, 100, 2)]);

    let mut merging_noun = TripleIndex::new();
    merging_noun.with_triples(vec![Triple::new(v_noun.id, 200, 20)]);

    let cat_cxn = CXN::new(2, vec![v_word2, v_noun], merging_noun, matching_cat);
    println!("  Created: cat_cxn (word -> noun)");

    // Construction 3: Determiner + Noun -> NP
    let v_det2 = Variable::new(util::fresh_variable_id(&mut var_counter));
    let v_noun2 = Variable::new(util::fresh_variable_id(&mut var_counter));
    let v_np = Variable::new(util::fresh_variable_id(&mut var_counter));

    let mut matching_np = TripleIndex::new();
    matching_np.with_triples(vec![
        Triple::new(v_det2.id, 200, 10),
        Triple::new(v_noun2.id, 200, 20),
    ]);

    let mut merging_np = TripleIndex::new();
    merging_np.with_triples(vec![
        Triple::new(v_np.id, 300, 30),
        Triple::new(v_np.id, 301, v_det2.id),
        Triple::new(v_np.id, 302, v_noun2.id),
    ]);

    let np_cxn = CXN::new(
        3,
        vec![v_det2, v_noun2, v_np],
        merging_np,
        matching_np,
    );
    println!("  Created: np_cxn (det + noun -> NP)\n");

    // Step 2: Precompute interactions
    println!("Step 2: Precomputing merge-match interactions");
    let config = precompute::PrecomputeConfig::default();
    let constructions = vec![the_cxn.clone(), cat_cxn.clone(), np_cxn.clone()];

    let precomps = precompute::precompute_all(
        &constructions,
        &config,
        &mut precomp_id_counter,
        &mut var_counter,
    );

    println!("  Generated {} precomputations", precomps.len());

    for precomp in &precomps {
        println!(
            "    Merge cxn {} -> Match cxn {} (touches {} triples)",
            precomp.merging_cxn_id,
            precomp.matching_cxn_id,
            precomp.touched_match_triples.len()
        );
    }

    // Step 3: Set up search space
    println!("\nStep 3: Setting up search space");
    let mut constructions_map = HashMap::new();
    constructions_map.insert(the_cxn.cxn_id, the_cxn);
    constructions_map.insert(cat_cxn.cxn_id, cat_cxn);
    constructions_map.insert(np_cxn.cxn_id, np_cxn);

    let mut precomps_map = HashMap::new();
    for p in &precomps {
        precomps_map.insert(p.id, p.clone());
    }

    let precomps_by_merging = precompute::index_precomps_by_merging(&precomps);

    let search_space = SearchSpace::new(
        constructions_map,
        precomps_map,
        precomps_by_merging,
    );

    println!("  Search space ready");
    println!("  Constructions loaded: {}", search_space.nodes().len());

    // Step 4: Summary
    println!("\nStep 4: Summary");
    println!("  Total constructions: 3");
    println!("  Total precomputations: {}", precomps.len());
    println!("  Ready to accept input and parse");

    println!("\n=== Example Complete ===");
}
