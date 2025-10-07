//! Construction Grammar types
//!
//! Defines SourceCXN (input constructions), CXN (internal constructions),
//! and InitCXN (initialization constructions)

use crate::binding::Binding;
use crate::triple::{Id, Triple, TripleIndex};
use crate::variable::Variable;
use std::collections::HashMap;

/// Base construction trait
pub trait Construction {
    fn cxn_id(&self) -> Id;
    fn variables(&self) -> &[Variable];
    fn binding(&self) -> &Binding;
    fn fresh(&self, var_counter: &mut u64) -> Self;
}

/// Source construction - represents input/matching from knowledge base
#[derive(Debug, Clone)]
pub struct SourceCXN {
    pub cxn_id: Id,
    pub variables: Vec<Variable>,
    pub matching: TripleIndex,
    pub binding: Binding,
}

impl SourceCXN {
    pub fn new(cxn_id: Id, variables: Vec<Variable>, matching: TripleIndex) -> Self {
        SourceCXN {
            cxn_id,
            variables,
            matching,
            binding: Binding::new(),
        }
    }

    pub fn with_binding(mut self, binding: Binding) -> Self {
        self.binding = binding;
        self
    }
}

impl Construction for SourceCXN {
    fn cxn_id(&self) -> Id {
        self.cxn_id
    }

    fn variables(&self) -> &[Variable] {
        &self.variables
    }

    fn binding(&self) -> &Binding {
        &self.binding
    }

    fn fresh(&self, var_counter: &mut u64) -> Self {
        let new_vars: Vec<Variable> = self
            .variables
            .iter()
            .map(|_| Variable::new(crate::util::fresh_variable_id(var_counter)))
            .collect();

        let renamings: HashMap<Id, Id> = self
            .variables
            .iter()
            .zip(new_vars.iter())
            .map(|(old, new)| (old.id, new.id))
            .collect();

        SourceCXN {
            cxn_id: self.cxn_id,
            variables: new_vars,
            matching: self.matching.rename(&renamings),
            binding: self.binding.rename(&renamings),
        }
    }
}

/// Internal construction - has both merging and matching parts
#[derive(Debug, Clone)]
pub struct CXN {
    pub cxn_id: Id,
    pub variables: Vec<Variable>,
    pub merging: TripleIndex,
    pub matching: TripleIndex,
    pub binding: Binding,
    /// Independent components of matching triples for localized precomputation
    pub independent_matching_components: Vec<Vec<usize>>,
}

impl CXN {
    pub fn new(
        cxn_id: Id,
        variables: Vec<Variable>,
        merging: TripleIndex,
        matching: TripleIndex,
    ) -> Self {
        // Compute independent components
        let matching_triples: Vec<Triple> = matching.iter().copied().collect();
        let components = crate::util::find_connected_components(&matching_triples);

        CXN {
            cxn_id,
            variables,
            merging,
            matching,
            binding: Binding::new(),
            independent_matching_components: components,
        }
    }

    pub fn with_binding(mut self, binding: Binding) -> Self {
        self.binding = binding;
        self
    }
}

impl Construction for CXN {
    fn cxn_id(&self) -> Id {
        self.cxn_id
    }

    fn variables(&self) -> &[Variable] {
        &self.variables
    }

    fn binding(&self) -> &Binding {
        &self.binding
    }

    fn fresh(&self, var_counter: &mut u64) -> Self {
        let new_vars: Vec<Variable> = self
            .variables
            .iter()
            .map(|_| Variable::new(crate::util::fresh_variable_id(var_counter)))
            .collect();

        let renamings: HashMap<Id, Id> = self
            .variables
            .iter()
            .zip(new_vars.iter())
            .map(|(old, new)| (old.id, new.id))
            .collect();

        CXN {
            cxn_id: self.cxn_id,
            variables: new_vars,
            merging: self.merging.rename(&renamings),
            matching: self.matching.rename(&renamings),
            binding: self.binding.rename(&renamings),
            independent_matching_components: self.independent_matching_components.clone(),
        }
    }
}

/// Initialization construction - represents starting state
#[derive(Debug, Clone)]
pub struct InitCXN {
    pub cxn_id: Id,
    pub variables: Vec<Variable>,
    pub merging: TripleIndex,
    pub binding: Binding,
}

impl InitCXN {
    pub fn new(cxn_id: Id, variables: Vec<Variable>, merging: TripleIndex) -> Self {
        InitCXN {
            cxn_id,
            variables,
            merging,
            binding: Binding::new(),
        }
    }

    pub fn with_binding(mut self, binding: Binding) -> Self {
        self.binding = binding;
        self
    }
}

impl Construction for InitCXN {
    fn cxn_id(&self) -> Id {
        self.cxn_id
    }

    fn variables(&self) -> &[Variable] {
        &self.variables
    }

    fn binding(&self) -> &Binding {
        &self.binding
    }

    fn fresh(&self, var_counter: &mut u64) -> Self {
        let new_vars: Vec<Variable> = self
            .variables
            .iter()
            .map(|_| Variable::new(crate::util::fresh_variable_id(var_counter)))
            .collect();

        let renamings: HashMap<Id, Id> = self
            .variables
            .iter()
            .zip(new_vars.iter())
            .map(|(old, new)| (old.id, new.id))
            .collect();

        InitCXN {
            cxn_id: self.cxn_id,
            variables: new_vars,
            merging: self.merging.rename(&renamings),
            binding: self.binding.rename(&renamings),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_source_cxn_fresh() {
        let v1 = Variable::new(Variable::make_variable_id(1));
        let mut index = TripleIndex::new();
        index.with_triples(vec![Triple::new(v1.id, 100, v1.id)]);

        let cxn = SourceCXN::new(1, vec![v1], index);
        let mut counter = 1000;
        let fresh = cxn.fresh(&mut counter);

        assert_ne!(cxn.variables[0].id, fresh.variables[0].id);
    }

    #[test]
    fn test_cxn_components() {
        let v1 = Variable::new(Variable::make_variable_id(1));
        let v2 = Variable::new(Variable::make_variable_id(2));
        let v3 = Variable::new(Variable::make_variable_id(3));
        let v4 = Variable::new(Variable::make_variable_id(4));

        let merging = TripleIndex::new();
        let mut matching = TripleIndex::new();

        // Two disconnected components
        matching.with_triples(vec![
            Triple::new(v1.id, 100, v2.id),
            Triple::new(v3.id, 101, v4.id),
        ]);

        let cxn = CXN::new(1, vec![v1, v2, v3, v4], merging, matching);

        assert_eq!(cxn.independent_matching_components.len(), 2);
    }
}
