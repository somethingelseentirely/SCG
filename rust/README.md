# SCG Rust Implementation

This is a synchronous, TUI-based implementation of Streaming Construction Grammar (SCG) in Rust.

## Architecture

The implementation is organized as a Rust workspace with two crates:

- **scg-core**: Core library implementing the SCG engine
- **scg-tui**: Terminal UI application for interactive parsing

### Key Differences from JavaScript Implementation

This Rust implementation differs semantically from the legacy JavaScript implementation:

1. **No uniqueness/inverse-uniqueness**: The Rust version does not use unique or inverse-unique attribute constraints. Instead, it uses explicit disequality constraints (`all_different`).

2. **Variable-sharing connected components**: The precomputation phase uses connected components based on variable sharing between triples, rather than unique/inverse-unique attribute relationships.

3. **Explicit disequalities**: Construction constraints that previously relied on uniqueness are now expressed explicitly via the `all_different` declaration in construction definitions.

4. **Synchronous execution**: No async/tokio - the implementation is strictly synchronous using a tick-based search loop.

5. **No KB/query**: Knowledge base and query functionality is omitted from this initial version.

## Building and Running

### Prerequisites

- Rust stable toolchain (2021 edition)

### Build

```bash
cd rust
cargo build
```

### Run Tests

```bash
cd rust
cargo test
```

### Run the TUI

```bash
cd rust
cargo run -p scg-tui
```

Or with release optimizations:

```bash
cd rust
cargo run --release -p scg-tui
```

## Using the TUI

The TUI provides a simple interface for testing the SCG parser:

1. **Input pane** (top): Type a sentence using space-separated words
2. **Nodes pane** (left): Shows construction application nodes
3. **Partials pane** (right): Shows partial construction matches
4. **Extracted triples pane** (bottom): Shows parsing results and extracted semantic triples

### Controls

- Type characters to build your input
- `Backspace`: Delete last character
- `Enter`: Parse the current input
- `Ctrl+Q`: Quit

### Example Input

Try typing:
```
the cat
```

This will parse using the toy grammar and show:
- Initial nodes for word recognition
- Partial matches for the determiner-noun construction
- Final nodes combining the determiner and noun
- Extracted semantic triples representing the noun phrase

## Grammar DSL

Grammars are defined using a simple Rust macro DSL:

```rust
use scg_core::{Atom, Triple, GrammarBuilder, InitCxnBuilder, CxnBuilder};

let mut builder = GrammarBuilder::new();

// Define attributes
let word_attr = builder.attr("word");
let pos_attr = builder.attr("pos");

// Define an initialization construction
builder.init_cxn(
    InitCxnBuilder::new()
        .vars(vec![0, 1])
        .merge(vec![
            Triple::new(Atom::Var(0), word_attr, Atom::Var(1))
        ])
);

// Define a regular construction
builder.cxn(
    CxnBuilder::new()
        .vars(vec![0, 1])
        .r#match(vec![
            Triple::new(Atom::Var(0), word_attr, Atom::Const(1001))
        ])
        .merge(vec![
            Triple::new(Atom::Var(0), pos_attr, Atom::Const(10))
        ])
);

let grammar = builder.build();
```

### Construction Elements

- **vars**: List of variable IDs used in the construction
- **match**: Triples to match against existing nodes
- **all_different**: Variables that must not unify (disequality constraint)
- **merge**: Triples to add when the construction applies

## Core Library API

The `scg-core` crate provides:

### Types

- `Atom`: Variable or constant entity
- `Triple`: (entity, attribute, value) semantic triple
- `TripleIndex`: Collection of triples
- `Binding`: Union-find structure with disequalities and attribute constraints
- `CXN`: Construction definition
- `Grammar`: Collection of constructions with precomputed match patterns
- `SearchSpace`: Parser state with nodes and partials
- `Node`: Application of a construction
- `Partial`: Partial match of a construction

### Key Functions

- `SearchSpace::new(grammar)`: Create a new search space
- `SearchSpace::add_init_nodes(input_triples)`: Initialize with input
- `SearchSpace::tick(cxn_id)`: Apply one step of a construction
- `SearchSpace::generate_parsing_results()`: Extract maximal consistent parses
- `merge_bindings(&[binding1, binding2])`: Merge multiple bindings

## License

Dual licensed under MIT OR Apache-2.0.
