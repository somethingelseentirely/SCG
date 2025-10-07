//! Knowledge Base interface
//!
//! Trait-based interface to decouple SCG from concrete storage

use crate::triple::Triple;

/// Query for KB subscription
#[derive(Debug, Clone)]
pub struct Query {
    pub pattern: Vec<Triple>,
}

/// Knowledge base interface (simplified for now, async can be added later)
pub trait KbBox: Send + Sync {
    /// Query matching triples
    fn query(&self, query: &Query) -> Vec<Triple>;

    /// Insert a triple into the KB
    fn insert(&mut self, triple: Triple);

    /// Remove a triple from the KB
    fn remove(&mut self, triple: Triple);
}

/// Simple in-memory KB implementation for testing
pub mod memory {
    use super::*;
    use std::collections::HashSet;
    use std::sync::{Arc, RwLock};

    #[derive(Debug, Clone)]
    pub struct MemoryKb {
        triples: Arc<RwLock<HashSet<Triple>>>,
    }

    impl MemoryKb {
        pub fn new() -> Self {
            MemoryKb {
                triples: Arc::new(RwLock::new(HashSet::new())),
            }
        }

        pub fn with_triples(triples: Vec<Triple>) -> Self {
            let kb = Self::new();
            {
                let mut store = kb.triples.write().unwrap();
                store.extend(triples);
            }
            kb
        }
    }

    impl Default for MemoryKb {
        fn default() -> Self {
            Self::new()
        }
    }

    impl KbBox for MemoryKb {
        fn query(&self, _query: &Query) -> Vec<Triple> {
            // Simple implementation: return all triples
            // In a real implementation, would match against pattern
            self.triples.read().unwrap().iter().copied().collect()
        }

        fn insert(&mut self, triple: Triple) {
            self.triples.write().unwrap().insert(triple);
        }

        fn remove(&mut self, triple: Triple) {
            self.triples.write().unwrap().remove(&triple);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use super::memory::*;

    #[test]
    fn test_memory_kb_creation() {
        let kb = MemoryKb::new();
        assert_eq!(kb.query(&Query { pattern: vec![] }).len(), 0);
    }

    #[test]
    fn test_memory_kb_with_triples() {
        let triples = vec![Triple::new(1, 2, 3)];
        let kb = MemoryKb::with_triples(triples);
        assert_eq!(kb.query(&Query { pattern: vec![] }).len(), 1);
    }
}
