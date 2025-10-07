//! Disequality constraints example
//!
//! Demonstrates the use of first-class disequality constraints

use scg_core::*;

fn main() {
    println!("=== Disequality Constraints Example ===\n");

    // Create variables
    let v1 = Variable::new(Variable::make_variable_id(1));
    let v2 = Variable::new(Variable::make_variable_id(2));
    let v3 = Variable::new(Variable::make_variable_id(3));
    let v4 = Variable::new(Variable::make_variable_id(4));

    println!("Variables: {} {} {} {}\n", v1, v2, v3, v4);

    // Example 1: Pairwise disequalities
    println!("Example 1: Pairwise disequalities");
    let mut binding = Binding::new();
    binding.add_disequality(v1.id, v2.id).unwrap();
    binding.add_disequality(v2.id, v3.id).unwrap();

    println!("  Added: {} != {}", v1, v2);
    println!("  Added: {} != {}", v2, v3);

    // Try to unify v1 and v2 (should fail)
    match binding.unify(v1.id, v2.id) {
        Ok(_) => println!("  Unexpected success unifying {} and {}", v1, v2),
        Err(e) => println!("  Expected failure: {}", e),
    }

    // Example 2: All-different constraint
    println!("\nExample 2: All-different constraint");
    let mut binding2 = Binding::new();
    binding2.all_different(vec![v1.id, v2.id, v3.id]).unwrap();

    println!("  All-different: {} {} {}", v1, v2, v3);

    // Try to unify any pair (should fail)
    match binding2.unify(v1.id, v3.id) {
        Ok(_) => println!("  Unexpected success unifying {} and {}", v1, v3),
        Err(e) => println!("  Expected failure: {}", e),
    }

    // Example 3: Disequalities in precomputation
    println!("\nExample 3: Disequalities prevent invalid precomputations");

    let mut matching = TripleIndex::new();
    matching.with_triples(vec![
        Triple::new(v1.id, 100, v2.id),
        Triple::new(v3.id, 100, v4.id),
    ]);

    let mut merging = TripleIndex::new();
    merging.with_triples(vec![Triple::new(v1.id, 100, v2.id)]);

    // Create construction with all-different on matching
    let mut cxn_binding = Binding::new();
    cxn_binding.all_different(vec![v1.id, v2.id, v3.id, v4.id]).unwrap();

    let merge_cxn = CXN::new(1, vec![v1, v2], merging, TripleIndex::new())
        .with_binding(cxn_binding.clone());
    let match_cxn = CXN::new(2, vec![v1, v2, v3, v4], TripleIndex::new(), matching)
        .with_binding(cxn_binding);

    println!("  Created constructions with all-different constraint");

    let config = precompute::PrecomputeConfig::default();
    let mut precomp_id = 1000;
    let mut var_id = 1000;

    let precomps = precompute::precompute_merge_match(
        &merge_cxn,
        &match_cxn,
        &[0, 1],
        &config,
        &mut precomp_id,
        &mut var_id,
    );

    println!("  Generated {} valid precomputations", precomps.len());
    println!("  (Invalid combinations filtered by disequalities)");

    println!("\n=== Example Complete ===");
}
