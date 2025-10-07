//! Triple data structure - entity-attribute-value tuples
//!
//! Represents semantic triples (also known as EAV tuples).

use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};
use std::fmt;

/// A unique identifier (entity, attribute, or value)
pub type Id = u64;

/// Semantic triple representing [entity, attribute, value]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct Triple {
    /// The entity - always an ID
    pub e: Id,
    /// The attribute - always an ID
    pub a: Id,
    /// The value - can be an ID or encoded atomic value
    pub v: Id,
}

impl Triple {
    pub fn new(e: Id, a: Id, v: Id) -> Self {
        Triple { e, a, v }
    }
}

impl fmt::Display for Triple {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{} {} {}", self.e, self.a, self.v)
    }
}

/// Index for efficient triple lookup by attribute
#[derive(Debug, Clone, Default)]
pub struct TripleIndex {
    /// Map from attribute to set of triples with that attribute
    triples_by_attr: HashMap<Id, HashSet<Triple>>,
}

impl TripleIndex {
    pub fn new() -> Self {
        Self::default()
    }

    /// Add triples to the index
    pub fn with_triples<I>(&mut self, triples: I)
    where
        I: IntoIterator<Item = Triple>,
    {
        for triple in triples {
            self.triples_by_attr
                .entry(triple.a)
                .or_insert_with(HashSet::new)
                .insert(triple);
        }
    }

    /// Remove a triple from the index
    pub fn remove(&mut self, triple: &Triple) {
        if let Some(triples) = self.triples_by_attr.get_mut(&triple.a) {
            triples.remove(triple);
        }
    }

    /// Check if index is empty
    pub fn is_empty(&self) -> bool {
        self.triples_by_attr.values().all(|ts| ts.is_empty())
    }

    /// Get all triples as a set
    pub fn to_set(&self) -> HashSet<Triple> {
        self.triples_by_attr
            .values()
            .flat_map(|ts| ts.iter().copied())
            .collect()
    }

    /// Get triples by attribute
    pub fn by_attribute(&self, attr: Id) -> impl Iterator<Item = &Triple> {
        self.triples_by_attr
            .get(&attr)
            .into_iter()
            .flat_map(|ts| ts.iter())
    }

    /// Get all triples
    pub fn iter(&self) -> impl Iterator<Item = &Triple> {
        self.triples_by_attr
            .values()
            .flat_map(|ts| ts.iter())
    }

    /// Rename variables in triples
    pub fn rename(&self, renamings: &HashMap<Id, Id>) -> TripleIndex {
        let mut new_index = TripleIndex::new();
        for triple in self.iter() {
            let new_triple = Triple {
                e: *renamings.get(&triple.e).unwrap_or(&triple.e),
                a: triple.a, // Attributes are not renamed
                v: *renamings.get(&triple.v).unwrap_or(&triple.v),
            };
            new_index.with_triples(std::iter::once(new_triple));
        }
        new_index
    }

    /// Get number of triples
    pub fn len(&self) -> usize {
        self.triples_by_attr.values().map(|ts| ts.len()).sum()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_triple_index() {
        let mut index = TripleIndex::new();
        let t1 = Triple::new(1, 100, 200);
        let t2 = Triple::new(2, 100, 201);
        let t3 = Triple::new(3, 101, 202);

        index.with_triples(vec![t1, t2, t3]);

        assert_eq!(index.len(), 3);
        assert_eq!(index.by_attribute(100).count(), 2);
        assert_eq!(index.by_attribute(101).count(), 1);
    }

    #[test]
    fn test_triple_rename() {
        let mut index = TripleIndex::new();
        index.with_triples(vec![Triple::new(1, 100, 2)]);

        let mut renamings = HashMap::new();
        renamings.insert(1, 10);
        renamings.insert(2, 20);

        let renamed = index.rename(&renamings);
        let triples: Vec<_> = renamed.iter().copied().collect();

        assert_eq!(triples.len(), 1);
        assert_eq!(triples[0], Triple::new(10, 100, 20));
    }
}
