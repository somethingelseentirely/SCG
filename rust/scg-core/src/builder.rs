use crate::atoms::{AttrId, Triple, TripleIndex, VarId};
use crate::binding::Binding;
use crate::grammar::{merge_match_precompute, Grammar, InitCXN, CXN};
use indexmap::IndexMap;
use std::collections::HashMap;

pub struct GrammarBuilder {
    next_cxn_id: usize,
    next_init_cxn_id: usize,
    next_precomp_id: usize,
    attrs: HashMap<String, AttrId>,
    next_attr_id: AttrId,
    cxns: Vec<CXN>,
    init_cxns: Vec<InitCXN>,
}

impl GrammarBuilder {
    pub fn new() -> Self {
        Self {
            next_cxn_id: 0,
            next_init_cxn_id: 0,
            next_precomp_id: 0,
            attrs: HashMap::new(),
            next_attr_id: 0,
            cxns: Vec::new(),
            init_cxns: Vec::new(),
        }
    }

    pub fn attr(&mut self, name: &str) -> AttrId {
        if let Some(&id) = self.attrs.get(name) {
            id
        } else {
            let id = self.next_attr_id;
            self.next_attr_id += 1;
            self.attrs.insert(name.to_string(), id);
            id
        }
    }

    pub fn get_attr(&self, name: &str) -> Option<AttrId> {
        self.attrs.get(name).copied()
    }

    pub fn init_cxn(&mut self, builder: InitCxnBuilder) -> usize {
        let id = self.next_init_cxn_id;
        self.next_init_cxn_id += 1;

        let init_cxn = InitCXN {
            id,
            variables: builder.variables,
            merging: builder.merging,
            binding: builder.binding,
        };

        self.init_cxns.push(init_cxn);
        id
    }

    pub fn cxn(&mut self, builder: CxnBuilder) -> usize {
        let id = self.next_cxn_id;
        self.next_cxn_id += 1;

        let cxn = CXN {
            id,
            variables: builder.variables,
            matching: builder.matching,
            merging: builder.merging,
            binding: builder.binding,
            all_different: builder.all_different,
        };

        self.cxns.push(cxn);
        id
    }

    pub fn build(mut self) -> Grammar {
        let mut precomps = Vec::new();
        let mut precomps_for_merge = IndexMap::new();

        for merge_cxn in &self.cxns {
            for match_cxn in &self.cxns {
                let precomp_list =
                    merge_match_precompute(merge_cxn, match_cxn, &mut self.next_precomp_id);

                for precomp in precomp_list {
                    precomps_for_merge
                        .entry(precomp.merging_id)
                        .or_insert_with(Vec::new)
                        .push(precomp.id);
                    precomps.push(precomp);
                }
            }
        }

        Grammar {
            cxns: self.cxns.into_iter().map(|c| (c.id, c)).collect(),
            init_cxns: self.init_cxns.into_iter().map(|c| (c.id, c)).collect(),
            precomps: precomps.into_iter().map(|p| (p.id, p)).collect(),
            precomps_for_merge,
        }
    }
}

impl Default for GrammarBuilder {
    fn default() -> Self {
        Self::new()
    }
}

pub struct InitCxnBuilder {
    variables: Vec<VarId>,
    merging: TripleIndex,
    binding: Binding,
}

impl InitCxnBuilder {
    pub fn new() -> Self {
        Self {
            variables: Vec::new(),
            merging: TripleIndex::new(),
            binding: Binding::new(),
        }
    }

    pub fn vars(mut self, vars: Vec<VarId>) -> Self {
        self.variables = vars;
        self
    }

    pub fn merge(mut self, triples: Vec<Triple>) -> Self {
        self.merging = TripleIndex::from_vec(triples);
        self
    }

    pub fn binding(mut self, binding: Binding) -> Self {
        self.binding = binding;
        self
    }
}

impl Default for InitCxnBuilder {
    fn default() -> Self {
        Self::new()
    }
}

pub struct CxnBuilder {
    variables: Vec<VarId>,
    matching: TripleIndex,
    merging: TripleIndex,
    binding: Binding,
    all_different: Vec<VarId>,
}

impl CxnBuilder {
    pub fn new() -> Self {
        Self {
            variables: Vec::new(),
            matching: TripleIndex::new(),
            merging: TripleIndex::new(),
            binding: Binding::new(),
            all_different: Vec::new(),
        }
    }

    pub fn vars(mut self, vars: Vec<VarId>) -> Self {
        self.variables = vars;
        self
    }

    pub fn r#match(mut self, triples: Vec<Triple>) -> Self {
        self.matching = TripleIndex::from_vec(triples);
        self
    }

    pub fn merge(mut self, triples: Vec<Triple>) -> Self {
        self.merging = TripleIndex::from_vec(triples);
        self
    }

    pub fn all_different(mut self, vars: Vec<VarId>) -> Self {
        self.all_different = vars;
        self
    }

    pub fn binding(mut self, binding: Binding) -> Self {
        self.binding = binding;
        self
    }
}

impl Default for CxnBuilder {
    fn default() -> Self {
        Self::new()
    }
}

#[macro_export]
macro_rules! scg {
    (
        attrs { $($attr_name:ident),* $(,)? }
        $(init_cxn {
            vars { $($init_var:expr),* $(,)? }
            merge [ $($init_merge:expr),* $(,)? ]
        })*
        $(cxn {
            vars { $($cxn_var:expr),* $(,)? }
            match [ $($cxn_match:expr),* $(,)? ]
            $(all_different [ $($diseq_var:expr),* $(,)? ])?
            merge [ $($cxn_merge:expr),* $(,)? ]
        })*
    ) => {{
        use $crate::builder::{GrammarBuilder, InitCxnBuilder};
        #[allow(unused_imports)]
        use $crate::builder::CxnBuilder;

        let mut builder = GrammarBuilder::new();

        $(
            builder.attr(stringify!($attr_name));
        )*

        $(
            builder.init_cxn(
                InitCxnBuilder::new()
                    .vars(vec![$($init_var),*])
                    .merge(vec![$($init_merge),*])
            );
        )*

        $(
            {
                let mut cxn_builder = CxnBuilder::new()
                    .vars(vec![$($cxn_var),*])
                    .r#match(vec![$($cxn_match),*])
                    .merge(vec![$($cxn_merge),*]);

                $(
                    cxn_builder = cxn_builder.all_different(vec![$($diseq_var),*]);
                )?

                builder.cxn(cxn_builder);
            }
        )*

        builder.build()
    }};
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::atoms::Atom;

    #[test]
    fn test_grammar_builder() {
        let mut builder = GrammarBuilder::new();
        let attr = builder.attr("test");
        assert_eq!(attr, 0);

        let grammar = builder.build();
        assert!(grammar.cxns.is_empty());
    }

    #[test]
    fn test_macro_basic() {
        let grammar = scg! {
            attrs { word, pos }
            init_cxn {
                vars { 0, 1 }
                merge [
                    Triple::new(Atom::Var(0), 0, Atom::Const(1))
                ]
            }
        };

        assert_eq!(grammar.init_cxns.len(), 1);
    }
}
