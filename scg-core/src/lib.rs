//! Streaming Construction Grammar (SCG) - Core Library
//!
//! A Rust implementation of Streaming Construction Grammar with modernized assumptions:
//! - Variable-sharing componentization for precompute decomposition
//! - First-class disequality constraints
//! - Independent components for localized precomputation
//! - Greedy set cover heuristic for covering partials
//! - Chart-style global assembly for parsing results
//!
//! # Quick Start
//!
//! ```
//! use scg_core::*;
//!
//! // Create variables
//! let v1 = Variable::new(Variable::make_variable_id(1));
//! let v2 = Variable::new(Variable::make_variable_id(2));
//!
//! // Create binding with unification
//! let mut binding = Binding::new();
//! binding.unify(v1.id, v2.id).unwrap();
//!
//! // Add disequality constraint
//! let v3 = Variable::new(Variable::make_variable_id(3));
//! binding.add_disequality(v1.id, v3.id).unwrap();
//!
//! // This will fail due to disequality
//! assert!(binding.unify(v1.id, v3.id).is_err());
//! ```
//!
//! # Architecture Overview
//!
//! ## Core Data Structures
//!
//! - **Triple**: Entity-Attribute-Value tuples representing semantic facts
//! - **TripleIndex**: Efficient attribute-based indexing of triples
//! - **Variable**: Variables for unification with high-bit flag convention
//! - **Binding**: Union-find with disequalities, bounds, and attribute constraints
//!
//! ## Construction Grammar
//!
//! - **SourceCXN**: Input constructions (matching only)
//! - **CXN**: Internal constructions with merging and matching parts
//! - **InitCXN**: Initialization constructions
//!
//! ## Precomputation
//!
//! The precomputation phase analyzes all pairs of constructions to determine valid
//! triple-unification combinations:
//!
//! 1. Freshen variable IDs for both constructions
//! 2. Compute variable-sharing components of matching triples
//! 3. For each component, enumerate consistent subsets of triple pairs
//! 4. Maintain incremental binding during exploration
//! 5. Keep Pareto-optimal precomps per touched set (K=4 by default)
//!
//! ## Runtime Search
//!
//! The search phase uses precomputed information to efficiently parse:
//!
//! - **Node**: Represents a construction application
//! - **Partial**: Derived from Node via Precomp, covers subset of match triples
//! - **SearchSpace**: Manages parsing state with delta queues
//! - **covering_partials**: Greedy solver for the set cover problem
//!
//! ## Knowledge Base
//!
//! - **KbBox trait**: Interface for storage backends
//! - **MemoryKb**: Simple in-memory implementation
//!
//! # Features
//!
//! - `ilp-solver`: Enable exact ILP solver for covering problems
//! - `self-pairing`: Allow constructions to match themselves
//!
//! # Examples
//!
//! See the `examples/` directory for complete examples:
//!
//! - `simple_parsing`: Basic parsing setup
//! - `disequality`: Disequality constraints
//! - `complete_parsing`: Full parsing workflow

pub mod triple;
pub mod variable;
pub mod binding;
pub mod construction;
pub mod precompute;
pub mod search;
pub mod kb;
pub mod util;

pub use triple::{Triple, TripleIndex};
pub use variable::Variable;
pub use binding::Binding;
pub use construction::{Construction, SourceCXN, CXN, InitCXN};
pub use precompute::{Precomp, precompute_merge_match};
pub use search::{Node, Partial, SearchSpace};
pub use kb::KbBox;
