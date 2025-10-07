# SCG - Streaming Construction Grammar

This repository contains implementations of Streaming Construction Grammar (SCG), a grammatical framework for incremental semantic parsing.

## Repository Structure

- **rust/** - Modern Rust implementation with synchronous TUI
  - **scg-core** - Core library implementing the SCG engine
  - **scg-tui** - Terminal UI application for interactive parsing
- **js-legacy-scg/** - Legacy JavaScript implementation
- **js-legacy-cooking-grammar/** - Legacy JavaScript cooking domain grammar

## Rust Implementation (New)

The Rust implementation is a from-scratch synchronous TUI-based parser. See [rust/README.md](rust/README.md) for details.

### Quick Start

```bash
cd rust

# Run the interactive TUI
cargo run -p scg-tui

# Type "the cat" and press Enter to parse
# Press Ctrl+Q to quit

# Run tests
cargo test

# Run all CI checks
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
cargo build
cargo test
```

### Key Features

- **Strictly synchronous**: No async/tokio, simple tick-based execution
- **TUI-based**: Interactive terminal interface using ratatui
- **Variable-sharing components**: Precomputation uses connected components instead of unique/inverse-unique
- **Explicit disequalities**: First-class `all_different` constraints in grammar DSL
- **Dual-licensed**: MIT OR Apache-2.0

### Example Grammar

```rust
use scg_core::{Atom, Triple, GrammarBuilder, CxnBuilder, InitCxnBuilder};

let mut builder = GrammarBuilder::new();
let word_attr = builder.attr("word");
let pos_attr = builder.attr("pos");

// Word recognition
builder.init_cxn(
    InitCxnBuilder::new()
        .vars(vec![0, 1])
        .merge(vec![Triple::new(Atom::Var(0), word_attr, Atom::Var(1))])
);

// Determiner construction
builder.cxn(
    CxnBuilder::new()
        .vars(vec![0, 1])
        .r#match(vec![Triple::new(Atom::Var(0), word_attr, Atom::Const(1001))])
        .merge(vec![Triple::new(Atom::Var(0), pos_attr, Atom::Const(10))])
);

let grammar = builder.build();
```

## Legacy JavaScript Implementation

The legacy implementations are preserved in `js-legacy-scg/` and `js-legacy-cooking-grammar/`. These use Observable notebooks and the tribles library.

## License

Dual-licensed under MIT OR Apache-2.0. See [LICENSE-MIT](LICENSE-MIT) and [LICENSE-APACHE](LICENSE-APACHE) for details.

## Development

The project uses GitHub Actions for CI:
- Code formatting (rustfmt)
- Linting (clippy with warnings as errors)
- Build verification
- Test execution

All checks must pass before merging.

