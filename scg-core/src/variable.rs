//! Variable representation for unification

use crate::triple::Id;
use serde::{Deserialize, Serialize};
use std::fmt;

/// Variable used in constructions and bindings
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct Variable {
    pub id: Id,
}

impl Variable {
    pub fn new(id: Id) -> Self {
        Variable { id }
    }

    /// Check if an ID represents a variable (convention: high bit set)
    pub fn is_variable(id: Id) -> bool {
        id & (1u64 << 63) != 0
    }

    /// Create a variable ID from a base ID
    pub fn make_variable_id(base: Id) -> Id {
        base | (1u64 << 63)
    }
}

impl fmt::Display for Variable {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "?{}", self.id & !(1u64 << 63))
    }
}

impl From<Id> for Variable {
    fn from(id: Id) -> Self {
        Variable { id }
    }
}

impl From<Variable> for Id {
    fn from(var: Variable) -> Self {
        var.id
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_variable_creation() {
        let var = Variable::new(Variable::make_variable_id(42));
        assert!(Variable::is_variable(var.id));
    }

    #[test]
    fn test_is_variable() {
        assert!(Variable::is_variable(Variable::make_variable_id(1)));
        assert!(!Variable::is_variable(1));
    }
}
