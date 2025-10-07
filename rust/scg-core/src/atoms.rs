use std::fmt;

pub type VarId = usize;
pub type AttrId = usize;
pub type EntityId = usize;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Atom {
    Var(VarId),
    Const(EntityId),
}

impl Atom {
    pub fn as_var(&self) -> Option<VarId> {
        match self {
            Atom::Var(v) => Some(*v),
            _ => None,
        }
    }

    pub fn as_const(&self) -> Option<EntityId> {
        match self {
            Atom::Const(c) => Some(*c),
            _ => None,
        }
    }
}

impl fmt::Display for Atom {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Atom::Var(v) => write!(f, "?v{}", v),
            Atom::Const(c) => write!(f, "e{}", c),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Triple {
    pub e: Atom,
    pub a: AttrId,
    pub v: Atom,
}

impl Triple {
    pub fn new(e: Atom, a: AttrId, v: Atom) -> Self {
        Self { e, a, v }
    }
}

impl fmt::Display for Triple {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "({}, a{}, {})", self.e, self.a, self.v)
    }
}

#[derive(Debug, Clone, Default)]
pub struct TripleIndex {
    triples: Vec<Triple>,
}

impl TripleIndex {
    pub fn new() -> Self {
        Self {
            triples: Vec::new(),
        }
    }

    pub fn from_vec(triples: Vec<Triple>) -> Self {
        Self { triples }
    }

    pub fn add(&mut self, triple: Triple) {
        self.triples.push(triple);
    }

    pub fn iter(&self) -> impl Iterator<Item = &Triple> {
        self.triples.iter()
    }

    pub fn len(&self) -> usize {
        self.triples.len()
    }

    pub fn is_empty(&self) -> bool {
        self.triples.is_empty()
    }

    pub fn get(&self, idx: usize) -> Option<&Triple> {
        self.triples.get(idx)
    }
}

impl FromIterator<Triple> for TripleIndex {
    fn from_iter<T: IntoIterator<Item = Triple>>(iter: T) -> Self {
        Self {
            triples: iter.into_iter().collect(),
        }
    }
}
