use crate::atoms::{Atom, Triple, VarId};
use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct Binding {
    pub valid: bool,
    parent: HashMap<VarId, VarId>,
    disequalities: Vec<(VarId, VarId)>,
    attribute_constraints: HashMap<VarId, HashMap<crate::atoms::AttrId, Atom>>,
}

impl Binding {
    pub fn new() -> Self {
        Self {
            valid: true,
            parent: HashMap::new(),
            disequalities: Vec::new(),
            attribute_constraints: HashMap::new(),
        }
    }

    pub fn find(&self, mut x: VarId) -> VarId {
        while let Some(&p) = self.parent.get(&x) {
            if p == x {
                break;
            }
            x = p;
        }
        x
    }

    pub fn union(&mut self, x: VarId, y: VarId) -> bool {
        let rx = self.find(x);
        let ry = self.find(y);

        if rx == ry {
            return true;
        }

        self.parent.insert(ry, rx);

        let constraints_y = self.attribute_constraints.remove(&ry);
        if let Some(constraints_y) = constraints_y {
            for (attr, val_y) in constraints_y {
                if let Some(val_x) = self
                    .attribute_constraints
                    .get(&rx)
                    .and_then(|m| m.get(&attr))
                {
                    if !self.unify_atoms(*val_x, val_y) {
                        self.valid = false;
                        return false;
                    }
                } else {
                    self.attribute_constraints
                        .entry(rx)
                        .or_default()
                        .insert(attr, val_y);
                }
            }
        }

        self.check_disequalities();

        true
    }

    pub fn unify_atoms(&mut self, a: Atom, b: Atom) -> bool {
        match (a, b) {
            (Atom::Var(x), Atom::Var(y)) => self.union(x, y),
            (Atom::Const(c1), Atom::Const(c2)) => {
                if c1 != c2 {
                    self.valid = false;
                    false
                } else {
                    true
                }
            }
            (Atom::Var(_x), Atom::Const(_c)) => true,
            (Atom::Const(_c), Atom::Var(_x)) => true,
        }
    }

    pub fn unify_triple(&mut self, t1: &Triple, t2: &Triple) -> bool {
        if t1.a != t2.a {
            self.valid = false;
            return false;
        }

        if !self.unify_atoms(t1.e, t2.e) {
            return false;
        }

        if !self.unify_atoms(t1.v, t2.v) {
            return false;
        }

        true
    }

    pub fn add_disequality(&mut self, x: VarId, y: VarId) {
        self.disequalities.push((x, y));
        self.check_disequalities();
    }

    fn check_disequalities(&mut self) {
        for &(x, y) in &self.disequalities {
            if self.find(x) == self.find(y) {
                self.valid = false;
                return;
            }
        }
    }

    pub fn walk_atom(&self, atom: Atom) -> Atom {
        match atom {
            Atom::Var(v) => Atom::Var(self.find(v)),
            c => c,
        }
    }

    pub fn walk_triple(&self, triple: &Triple) -> Triple {
        Triple {
            e: self.walk_atom(triple.e),
            a: triple.a,
            v: self.walk_atom(triple.v),
        }
    }

    pub fn add_attribute_constraint(
        &mut self,
        var: VarId,
        attr: crate::atoms::AttrId,
        value: Atom,
    ) {
        let root = self.find(var);

        if let Some(existing) = self
            .attribute_constraints
            .get(&root)
            .and_then(|m| m.get(&attr))
        {
            if !self.unify_atoms(*existing, value) {
                self.valid = false;
            }
        } else {
            self.attribute_constraints
                .entry(root)
                .or_default()
                .insert(attr, value);
        }
    }

    pub fn rename(&self, mapping: &HashMap<VarId, VarId>) -> Self {
        let mut new_binding = Self::new();

        for (&old_var, &new_var) in mapping {
            let old_root = self.find(old_var);
            let new_root_mapped = mapping.get(&old_root).copied().unwrap_or(old_root);

            if new_var != new_root_mapped {
                new_binding.parent.insert(new_var, new_root_mapped);
            }
        }

        for &(x, y) in &self.disequalities {
            let new_x = mapping.get(&x).copied().unwrap_or(x);
            let new_y = mapping.get(&y).copied().unwrap_or(y);
            new_binding.disequalities.push((new_x, new_y));
        }

        for (&var, constraints) in &self.attribute_constraints {
            let new_var = mapping.get(&var).copied().unwrap_or(var);
            for (&attr, &value) in constraints {
                let new_value = match value {
                    Atom::Var(v) => Atom::Var(mapping.get(&v).copied().unwrap_or(v)),
                    c => c,
                };
                new_binding
                    .attribute_constraints
                    .entry(new_var)
                    .or_default()
                    .insert(attr, new_value);
            }
        }

        new_binding.check_disequalities();
        new_binding
    }
}

impl Default for Binding {
    fn default() -> Self {
        Self::new()
    }
}

pub fn merge_bindings(bindings: &[Binding]) -> Binding {
    if bindings.is_empty() {
        return Binding::new();
    }

    if bindings.len() == 1 {
        return bindings[0].clone();
    }

    let mut result = Binding::new();

    let mut all_vars = std::collections::HashSet::new();
    for binding in bindings {
        for &v in binding.parent.keys() {
            all_vars.insert(v);
        }
        for binding_disq in &binding.disequalities {
            all_vars.insert(binding_disq.0);
            all_vars.insert(binding_disq.1);
        }
    }

    let mut unions_to_do = Vec::new();
    for binding in bindings {
        for &v in &all_vars {
            let root = binding.find(v);
            if root != v {
                unions_to_do.push((v, root));
            }
        }
    }

    for (x, y) in unions_to_do {
        if !result.union(x, y) {
            return result;
        }
    }

    for binding in bindings {
        for &(x, y) in &binding.disequalities {
            result.add_disequality(x, y);
            if !result.valid {
                return result;
            }
        }
    }

    for binding in bindings {
        for (&var, constraints) in &binding.attribute_constraints {
            for (&attr, &value) in constraints {
                result.add_attribute_constraint(var, attr, value);
                if !result.valid {
                    return result;
                }
            }
        }
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_unify_vars() {
        let mut binding = Binding::new();
        assert!(binding.union(0, 1));
        assert_eq!(binding.find(0), binding.find(1));
        assert!(binding.valid);
    }

    #[test]
    fn test_disequality() {
        let mut binding = Binding::new();
        binding.add_disequality(0, 1);
        assert!(binding.valid);

        binding.union(0, 1);
        assert!(!binding.valid);
    }

    #[test]
    fn test_rename() {
        let mut binding = Binding::new();
        binding.union(0, 1);
        binding.add_disequality(2, 3);

        let mut mapping = HashMap::new();
        mapping.insert(0, 10);
        mapping.insert(1, 11);
        mapping.insert(2, 12);
        mapping.insert(3, 13);

        let renamed = binding.rename(&mapping);
        assert!(renamed.valid);
        assert_eq!(renamed.find(10), renamed.find(11));
    }
}
