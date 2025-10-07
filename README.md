# SCG - Streaming Construction Grammar (Rust Implementation)

A modern Rust implementation of Streaming Construction Grammar with improved constraint handling and precomputation.

## Overview

This implementation provides:

- **First-class disequality constraints**: Support for `x != y` constraints integrated into the unification engine
- **Variable-sharing componentization**: Automatic decomposition of matching patterns for localized precomputation
- **Efficient precomputation**: Precomputes merge-match interactions with Pareto-optimal subset selection
- **Greedy covering solver**: Runtime set-cover algorithm for partial matching
- **Chart-style parsing**: Global assembly of parsing results with maximal consistency
- **KB trait interface**: Decoupled knowledge base interface for flexible storage backends

## Architecture

### Core Components

#### 1. Triple and TripleIndex
- **Triple**: Entity-Attribute-Value tuples `(e, a, v)`
- **TripleIndex**: Efficient lookup by attribute

#### 2. Variable and Binding
- **Variable**: Variables with high-bit flag convention
- **Binding**: Union-find with disequalities, bounds, and attribute constraints
  - Unification with immediate conflict detection
  - Disequality constraints enforced during union
  - `all_different([vars])` helper for mutual exclusion

#### 3. Construction Types
- **SourceCXN**: Input constructions (matching only)
- **CXN**: Internal constructions (merging + matching)
- **InitCXN**: Initialization constructions

#### 4. Precomputation
- Computes all valid triple-unification combinations between merge/match pairs
- Uses variable-sharing connected components for decomposition
- Keeps Pareto-optimal subset per touched-triple set (configurable K, default 4)
- Indexed by merging construction for fast runtime lookup

#### 5. Search
- **Node**: Construction application with binding and ancestors
- **Partial**: Derived from Node via Precomp, covers subset of match triples
- **SearchSpace**: Manages parsing state with delta queues
- **covering_partials**: Greedy set-cover solver with compatibility checking

#### 6. KB Interface
- **KbBox trait**: Decoupled knowledge base for queries and updates
- **MemoryKb**: Simple in-memory implementation for testing

## Features

### Default Features
None (minimal build)

### Optional Features
- `ilp-solver`: Enable exact ILP solver for covering problems (requires `good_lp`)
- `self-pairing`: Allow constructions to match themselves in precomputation

## Usage

### Basic Example

```rust
use scg_core::*;

// Create variables
let v1 = Variable::new(Variable::make_variable_id(1));
let v2 = Variable::new(Variable::make_variable_id(2));

// Create binding with unification
let mut binding = Binding::new();
binding.unify(v1.id, v2.id).unwrap();

// Add disequality constraint
let v3 = Variable::new(Variable::make_variable_id(3));
binding.add_disequality(v1.id, v3.id).unwrap();

// This will fail due to disequality
assert!(binding.unify(v1.id, v3.id).is_err());
```

### CLI

The `scg` CLI provides basic commands:

```bash
# Check version
scg version

# Run examples
scg example --name basic
```

## Examples

See the `examples/` directory for more:

- `simple_parsing.rs`: Basic parsing setup
- `disequality.rs`: Disequality constraints demonstration

Run examples with:

```bash
cargo run --example simple_parsing
cargo run --example disequality
```

## Design Updates from Legacy JS Version

### 1. Constraints Semantics Simplification
- Removed schema-level uniqueness invariants
- Rely on variable-sharing componentization for decomposition
- Explicit first-class disequalities instead of implicit uniqueness
- Optional guards/soft costs for functional behavior

### 2. Independent Components
- Automatic connected component analysis based on variable sharing
- Localizes precomputation to reduce search space

### 3. First-class Disequalities
- Disequality constraints integrated into union-find
- Immediate failure on violation during unification
- `all_different([vars])` helper for mutual exclusion
- Used in precomputation to prune invalid subsets early

### 4. Precomputation Pipeline
- Enumerate consistent triple-pair subsets per component
- Maintain incremental binding while exploring
- Keep Pareto set (K precomps per touched set, K=4 default)
- Index by merging construction for fast lookup

### 5. Runtime Search
- Node represents construction application with ancestors
- Partial derived from Node + Precomp
- Delta queues ensure fresh partial in each covering
- Greedy covering solver with compatibility checks
- Optional ILP backend for exact solutions (feature flag)

### 6. KB Interface
- Trait-based for storage flexibility
- Simplified synchronous interface (async can be added)
- MemoryKb for testing and simple cases

## Testing

Run all tests:

```bash
cargo test
```

Run tests with output:

```bash
cargo test -- --nocapture
```

## Building

Build the workspace:

```bash
cargo build --release
```

Build with optional features:

```bash
cargo build --release --features ilp-solver,self-pairing
```

## Documentation

Generate and open documentation:

```bash
cargo doc --open --no-deps
```

## License

MIT OR Apache-2.0

## Legacy JavaScript Code

The original JavaScript implementation is preserved in `js-legacy-scg/` and `js-legacy-cooking-grammar/` directories for reference. These directories contain the Observable notebooks that served as the basis for this Rust port.

