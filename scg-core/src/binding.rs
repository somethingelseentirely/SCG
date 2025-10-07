//! Binding - Union-find with disequality constraints
//!
//! Implements unification with:
//! - Union-find for variable equivalence classes
//! - Disequality constraints (x != y)
//! - Bounds constraints (lower <= x <= upper)
//! - Attribute constraints

use crate::triple::{Id, Triple};
use crate::variable::Variable;
use std::collections::{HashMap, HashSet};
use thiserror::Error;

#[derive(Debug, Error, Clone, PartialEq)]
pub enum BindingError {
    #[error("Unification conflict: trying to unify {0} with {1}")]
    UnificationConflict(Id, Id),
    #[error("Disequality violation: {0} and {1} cannot be equal")]
    DisequalityViolation(Id, Id),
    #[error("Bounds violation: value out of bounds")]
    BoundsViolation,
    #[error("Attribute constraint violation")]
    AttributeConstraintViolation,
}

/// Binding maintains unification state with constraints
#[derive(Debug, Clone)]
pub struct Binding {
    /// Union-find parent mapping
    mapping: HashMap<Id, Id>,
    /// Disequality constraints: for each ID, the set of IDs it must not equal
    disequalities: HashMap<Id, HashSet<Id>>,
    /// Bounds constraints: (lower, upper) pairs
    bounds_by_lower: HashMap<Id, HashSet<Id>>,
    bounds_by_upper: HashMap<Id, HashSet<Id>>,
    /// Attribute constraints: if entity has attribute, then value
    attribute_constraints: HashMap<Id, HashMap<Id, Id>>,
    /// Validity flag
    valid: bool,
    /// Error if invalid
    error: Option<BindingError>,
}

impl Default for Binding {
    fn default() -> Self {
        Self::new()
    }
}

impl Binding {
    pub fn new() -> Self {
        Binding {
            mapping: HashMap::new(),
            disequalities: HashMap::new(),
            bounds_by_lower: HashMap::new(),
            bounds_by_upper: HashMap::new(),
            attribute_constraints: HashMap::new(),
            valid: true,
            error: None,
        }
    }

    /// Check if binding is valid
    pub fn is_valid(&self) -> bool {
        self.valid
    }

    /// Get error if invalid
    pub fn error(&self) -> Option<&BindingError> {
        self.error.as_ref()
    }

    /// Walk the union-find structure to find representative
    pub fn walk(&self, id: Id) -> Id {
        if let Some(&parent) = self.mapping.get(&id) {
            if parent != id {
                return self.walk(parent);
            }
        }
        id
    }

    /// Unify two IDs
    pub fn unify(&mut self, u: Id, v: Id) -> Result<(), BindingError> {
        if !self.valid {
            return Ok(());
        }

        let ru = self.walk(u);
        let rv = self.walk(v);

        if ru == rv {
            return Ok(());
        }

        // Check if both are non-variables (concrete values)
        if !Variable::is_variable(ru) && !Variable::is_variable(rv) {
            if ru != rv {
                self.valid = false;
                self.error = Some(BindingError::UnificationConflict(ru, rv));
                return Err(BindingError::UnificationConflict(ru, rv));
            }
            return Ok(());
        }

        // Check disequality constraints
        if let Some(diseq) = self.disequalities.get(&ru) {
            if diseq.contains(&rv) {
                self.valid = false;
                self.error = Some(BindingError::DisequalityViolation(ru, rv));
                return Err(BindingError::DisequalityViolation(ru, rv));
            }
        }
        if let Some(diseq) = self.disequalities.get(&rv) {
            if diseq.contains(&ru) {
                self.valid = false;
                self.error = Some(BindingError::DisequalityViolation(ru, rv));
                return Err(BindingError::DisequalityViolation(ru, rv));
            }
        }

        // Perform union: prefer non-variable as representative
        let (parent, child) = if Variable::is_variable(ru) && !Variable::is_variable(rv) {
            (rv, ru)
        } else {
            (ru, rv)
        };

        self.mapping.insert(child, parent);

        // Merge disequality constraints
        if let Some(child_diseq) = self.disequalities.remove(&child) {
            // Collect diseq IDs to check first
            let diseq_ids: Vec<Id> = child_diseq.into_iter().collect();
            
            for diseq_id in diseq_ids {
                // Check immediate violation
                let diseq_repr = self.walk(diseq_id);
                if diseq_repr == parent {
                    self.valid = false;
                    self.error = Some(BindingError::DisequalityViolation(parent, diseq_repr));
                    return Err(BindingError::DisequalityViolation(parent, diseq_repr));
                }
                
                self.disequalities
                    .entry(parent)
                    .or_insert_with(HashSet::new)
                    .insert(diseq_id);
            }
        }

        Ok(())
    }

    /// Unify all pairs in a list
    pub fn unify_all<I>(&mut self, pairs: I) -> Result<(), BindingError>
    where
        I: IntoIterator<Item = (Id, Id)>,
    {
        for (u, v) in pairs {
            self.unify(u, v)?;
        }
        Ok(())
    }

    /// Unify entity and value from two triples (same attribute)
    pub fn unify_triple(&mut self, t1: Triple, t2: Triple) -> Result<(), BindingError> {
        if t1.a != t2.a {
            return Ok(());
        }
        self.unify(t1.e, t2.e)?;
        self.unify(t1.v, t2.v)?;
        Ok(())
    }

    /// Add disequality constraint: u != v
    pub fn add_disequality(&mut self, u: Id, v: Id) -> Result<(), BindingError> {
        if !self.valid {
            return Ok(());
        }

        let ru = self.walk(u);
        let rv = self.walk(v);

        if ru == rv {
            self.valid = false;
            self.error = Some(BindingError::DisequalityViolation(ru, rv));
            return Err(BindingError::DisequalityViolation(ru, rv));
        }

        self.disequalities
            .entry(ru)
            .or_insert_with(HashSet::new)
            .insert(rv);
        self.disequalities
            .entry(rv)
            .or_insert_with(HashSet::new)
            .insert(ru);

        Ok(())
    }

    /// Add all-different constraint on a set of variables
    pub fn all_different<I>(&mut self, vars: I) -> Result<(), BindingError>
    where
        I: IntoIterator<Item = Id>,
    {
        let vars: Vec<Id> = vars.into_iter().collect();
        for i in 0..vars.len() {
            for j in (i + 1)..vars.len() {
                self.add_disequality(vars[i], vars[j])?;
            }
        }
        Ok(())
    }

    /// Add bounds constraint: lower <= upper
    pub fn constrain_bounds(&mut self, lower: Id, upper: Id) -> Result<(), BindingError> {
        if !self.valid {
            return Ok(());
        }

        let rl = self.walk(lower);
        let ru = self.walk(upper);

        self.bounds_by_lower
            .entry(rl)
            .or_insert_with(HashSet::new)
            .insert(ru);
        self.bounds_by_upper
            .entry(ru)
            .or_insert_with(HashSet::new)
            .insert(rl);

        Ok(())
    }

    /// Add attribute constraint: if entity has attribute, then value
    pub fn attribute_constrained(
        &mut self,
        attribute: Id,
        if_entity: Id,
        then_value: Id,
    ) -> Result<(), BindingError> {
        if !self.valid {
            return Ok(());
        }

        let re = self.walk(if_entity);
        let rv = self.walk(then_value);

        self.attribute_constraints
            .entry(re)
            .or_insert_with(HashMap::new)
            .insert(attribute, rv);

        Ok(())
    }

    /// Rename variables using a mapping
    pub fn rename(&self, renamings: &HashMap<Id, Id>) -> Binding {
        let mut new_binding = Binding::new();
        new_binding.valid = self.valid;
        new_binding.error = self.error.clone();

        // Rename mapping
        for (k, v) in &self.mapping {
            let new_k = *renamings.get(k).unwrap_or(k);
            let new_v = *renamings.get(v).unwrap_or(v);
            new_binding.mapping.insert(new_k, new_v);
        }

        // Rename disequalities
        for (k, vs) in &self.disequalities {
            let new_k = *renamings.get(k).unwrap_or(k);
            let new_vs: HashSet<Id> = vs
                .iter()
                .map(|v| *renamings.get(v).unwrap_or(v))
                .collect();
            new_binding.disequalities.insert(new_k, new_vs);
        }

        // Rename bounds
        for (k, vs) in &self.bounds_by_lower {
            let new_k = *renamings.get(k).unwrap_or(k);
            let new_vs: HashSet<Id> = vs
                .iter()
                .map(|v| *renamings.get(v).unwrap_or(v))
                .collect();
            new_binding.bounds_by_lower.insert(new_k, new_vs);
        }

        for (k, vs) in &self.bounds_by_upper {
            let new_k = *renamings.get(k).unwrap_or(k);
            let new_vs: HashSet<Id> = vs
                .iter()
                .map(|v| *renamings.get(v).unwrap_or(v))
                .collect();
            new_binding.bounds_by_upper.insert(new_k, new_vs);
        }

        // Rename attribute constraints
        for (entity, attrs) in &self.attribute_constraints {
            let new_entity = *renamings.get(entity).unwrap_or(entity);
            let new_attrs: HashMap<Id, Id> = attrs
                .iter()
                .map(|(a, v)| (*a, *renamings.get(v).unwrap_or(v)))
                .collect();
            new_binding.attribute_constraints.insert(new_entity, new_attrs);
        }

        new_binding
    }

    /// Merge multiple bindings
    pub fn merge<I>(bindings: I) -> Binding
    where
        I: IntoIterator<Item = Binding>,
    {
        let mut result = Binding::new();

        for binding in bindings {
            if !binding.valid {
                result.valid = false;
                result.error = binding.error;
                return result;
            }

            // Merge mappings
            for (k, v) in binding.mapping {
                if result.unify(k, v).is_err() {
                    return result;
                }
            }

            // Merge disequalities
            for (u, vs) in binding.disequalities {
                for v in vs {
                    if result.add_disequality(u, v).is_err() {
                        return result;
                    }
                }
            }

            // Merge bounds
            for (lower, uppers) in binding.bounds_by_lower {
                for upper in uppers {
                    if result.constrain_bounds(lower, upper).is_err() {
                        return result;
                    }
                }
            }

            // Merge attribute constraints
            for (entity, attrs) in binding.attribute_constraints {
                for (attr, value) in attrs {
                    if result.attribute_constrained(attr, entity, value).is_err() {
                        return result;
                    }
                }
            }
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_unification() {
        let mut binding = Binding::new();
        let v1 = Variable::make_variable_id(1);
        let v2 = Variable::make_variable_id(2);

        assert!(binding.unify(v1, v2).is_ok());
        assert_eq!(binding.walk(v1), binding.walk(v2));
    }

    #[test]
    fn test_disequality() {
        let mut binding = Binding::new();
        let v1 = Variable::make_variable_id(1);
        let v2 = Variable::make_variable_id(2);

        assert!(binding.add_disequality(v1, v2).is_ok());
        assert!(binding.unify(v1, v2).is_err());
        assert!(!binding.is_valid());
    }

    #[test]
    fn test_all_different() {
        let mut binding = Binding::new();
        let v1 = Variable::make_variable_id(1);
        let v2 = Variable::make_variable_id(2);
        let v3 = Variable::make_variable_id(3);

        assert!(binding.all_different(vec![v1, v2, v3]).is_ok());
        assert!(binding.unify(v1, v2).is_err());
        assert!(!binding.is_valid());
    }

    #[test]
    fn test_unify_concrete_values() {
        let mut binding = Binding::new();
        let c1 = 100; // concrete value
        let c2 = 200; // different concrete value

        assert!(binding.unify(c1, c2).is_err());
        assert!(!binding.is_valid());
    }

    #[test]
    fn test_merge_bindings() {
        let mut b1 = Binding::new();
        let v1 = Variable::make_variable_id(1);
        let v2 = Variable::make_variable_id(2);
        b1.unify(v1, v2).unwrap();

        let mut b2 = Binding::new();
        let v3 = Variable::make_variable_id(3);
        let v4 = Variable::make_variable_id(4);
        b2.unify(v3, v4).unwrap();

        let merged = Binding::merge(vec![b1, b2]);
        assert!(merged.is_valid());
        assert_eq!(merged.walk(v1), merged.walk(v2));
        assert_eq!(merged.walk(v3), merged.walk(v4));
    }
}
