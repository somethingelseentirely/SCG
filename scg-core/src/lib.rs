//! Streaming Construction Grammar (SCG) - Core Library
//!
//! A Rust implementation of Streaming Construction Grammar with modernized assumptions:
//! - Variable-sharing componentization for precompute decomposition
//! - First-class disequality constraints
//! - Independent components for localized precomputation
//! - Greedy set cover heuristic for covering partials
//! - Chart-style global assembly for parsing results

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
