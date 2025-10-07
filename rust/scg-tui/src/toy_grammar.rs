use scg_core::{Atom, CxnBuilder, Grammar, GrammarBuilder, InitCxnBuilder, Triple};

pub fn create_toy_grammar() -> Grammar {
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
            .vars(vec![0, 1, 2, 3])
            .r#match(vec![Triple::new(
                Atom::Var(0),
                word_attr,
                Atom::Const(1001),
            )])
            .merge(vec![Triple::new(Atom::Var(0), pos_attr, Atom::Const(10))]),
    );

    builder.cxn(
        CxnBuilder::new()
            .vars(vec![0, 1])
            .r#match(vec![Triple::new(
                Atom::Var(0),
                word_attr,
                Atom::Const(1002),
            )])
            .merge(vec![Triple::new(Atom::Var(0), pos_attr, Atom::Const(10))]),
    );

    builder.cxn(
        CxnBuilder::new()
            .vars(vec![0, 1])
            .r#match(vec![Triple::new(
                Atom::Var(0),
                word_attr,
                Atom::Const(2001),
            )])
            .merge(vec![Triple::new(Atom::Var(0), pos_attr, Atom::Const(20))]),
    );

    builder.cxn(
        CxnBuilder::new()
            .vars(vec![0, 1])
            .r#match(vec![Triple::new(
                Atom::Var(0),
                word_attr,
                Atom::Const(2002),
            )])
            .merge(vec![Triple::new(Atom::Var(0), pos_attr, Atom::Const(20))]),
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

    builder.build()
}
