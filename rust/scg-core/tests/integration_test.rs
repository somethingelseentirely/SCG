use scg_core::{
    Atom, CxnBuilder, GrammarBuilder, InitCxnBuilder, SearchSpace, Triple, TripleIndex,
};

#[test]
fn test_simple_det_noun_parse() {
    let mut builder = GrammarBuilder::new();

    let word_attr = builder.attr("word");
    let pos_attr = builder.attr("pos");
    let det_attr = builder.attr("det");
    let head_attr = builder.attr("head");

    builder.init_cxn(
        InitCxnBuilder::new()
            .vars(vec![0, 1])
            .merge(vec![Triple::new(Atom::Var(0), word_attr, Atom::Var(1))]),
    );

    builder.cxn(
        CxnBuilder::new()
            .vars(vec![0, 1])
            .r#match(vec![Triple::new(
                Atom::Var(0),
                word_attr,
                Atom::Const(1001),
            )])
            .merge(vec![Triple::new(
                Atom::Var(0),
                pos_attr,
                Atom::Const(10),
            )]),
    );

    builder.cxn(
        CxnBuilder::new()
            .vars(vec![0, 1])
            .r#match(vec![Triple::new(
                Atom::Var(0),
                word_attr,
                Atom::Const(2001),
            )])
            .merge(vec![Triple::new(
                Atom::Var(0),
                pos_attr,
                Atom::Const(20),
            )]),
    );

    builder.cxn(
        CxnBuilder::new()
            .vars(vec![0, 1, 2])
            .r#match(vec![
                Triple::new(Atom::Var(0), pos_attr, Atom::Const(10)),
                Triple::new(Atom::Var(1), pos_attr, Atom::Const(20)),
            ])
            .all_different(vec![0, 1])
            .merge(vec![
                Triple::new(Atom::Var(2), det_attr, Atom::Var(0)),
                Triple::new(Atom::Var(2), head_attr, Atom::Var(1)),
                Triple::new(Atom::Var(2), pos_attr, Atom::Const(30)),
            ]),
    );

    let grammar = builder.build();

    println!("Grammar has {} init_cxns", grammar.init_cxns.len());
    println!("Grammar has {} cxns", grammar.cxns.len());

    let input_triples = vec![
        Triple::new(Atom::Const(100), word_attr, Atom::Const(1001)),
        Triple::new(Atom::Const(200), word_attr, Atom::Const(2001)),
    ];
    let input_index = TripleIndex::from_vec(input_triples);

    let mut search_space = SearchSpace::new(grammar.clone());
    println!("Before add_init_nodes: {} nodes", search_space.nodes.len());
    search_space.add_init_nodes(input_index);
    println!("After add_init_nodes: {} nodes", search_space.nodes.len());

    assert!(
        !search_space.nodes.is_empty(),
        "Should have init nodes created"
    );

    let mut ticks = 0;
    let max_ticks = 100;

    loop {
        if ticks >= max_ticks {
            break;
        }

        let cxn_ids: Vec<_> = grammar.cxns.keys().copied().collect();
        let mut progress = false;

        for cxn_id in cxn_ids {
            if search_space.tick(cxn_id) {
                progress = true;
            }
        }

        if !progress {
            break;
        }

        ticks += 1;
    }

    assert!(
        search_space.nodes.len() >= 2,
        "Should have at least init nodes"
    );

    let results = search_space.generate_parsing_results();
    assert!(!results.is_empty(), "Should have at least one parse result");

    for (node_ids, triples, binding) in &results {
        assert!(binding.valid, "Parse result binding should be valid");
        println!(
            "Parse result: {} nodes, {} triples",
            node_ids.len(),
            triples.len()
        );
    }
}

#[test]
fn test_binding_merge() {
    use scg_core::{merge_bindings, Binding};

    let mut b1 = Binding::new();
    b1.union(0, 1);
    assert!(b1.valid);

    let mut b2 = Binding::new();
    b2.union(1, 2);
    assert!(b2.valid);

    let merged = merge_bindings(&[b1, b2]);
    assert!(merged.valid);
    assert_eq!(merged.find(0), merged.find(1));
    assert_eq!(merged.find(1), merged.find(2));
}

#[test]
fn test_disequality_constraint() {
    use scg_core::Binding;

    let mut binding = Binding::new();
    binding.add_disequality(0, 1);
    assert!(binding.valid);

    binding.union(0, 1);
    assert!(!binding.valid, "Unifying disequal vars should fail");
}
