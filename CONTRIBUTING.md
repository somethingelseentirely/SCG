# Contributing to SCG

Thank you for your interest in contributing to the Streaming Construction Grammar Rust implementation!

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/somethingelseentirely/SCG.git
cd SCG
```

2. Build the project:
```bash
cargo build
```

3. Run tests:
```bash
cargo test
```

4. Run examples:
```bash
cargo run --example simple_parsing
cargo run --example disequality
cargo run --example complete_parsing
```

## Project Structure

```
SCG/
├── scg-core/          # Core library
│   ├── src/
│   │   ├── lib.rs     # Main library file
│   │   ├── triple.rs  # Triple and TripleIndex
│   │   ├── variable.rs # Variable representation
│   │   ├── binding.rs  # Union-find with disequalities
│   │   ├── construction.rs # Construction types
│   │   ├── precompute.rs   # Precomputation logic
│   │   ├── search.rs       # Search space and partials
│   │   ├── kb.rs           # Knowledge base interface
│   │   └── util.rs         # Utility functions
│   └── Cargo.toml
├── scg-cli/           # Command-line interface
│   ├── src/main.rs
│   └── Cargo.toml
├── examples/          # Example programs
│   ├── simple_parsing.rs
│   ├── disequality.rs
│   └── complete_parsing.rs
└── js-legacy-scg/     # Legacy JavaScript reference (DO NOT MODIFY)
```

## Code Style

We follow standard Rust conventions:

1. **Formatting**: Use `cargo fmt` before committing
2. **Linting**: Run `cargo clippy` and fix all warnings
3. **Testing**: Write tests for new functionality
4. **Documentation**: Add doc comments for public APIs

## Making Changes

### Before You Start

1. Check existing issues and PRs to avoid duplicate work
2. For large changes, open an issue first to discuss the approach

### Development Workflow

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes following these guidelines:
   - Keep changes focused and minimal
   - Write clear commit messages
   - Add tests for new functionality
   - Update documentation as needed

3. Test your changes:
```bash
# Run all tests
cargo test

# Run specific test
cargo test test_name

# Run with output
cargo test -- --nocapture
```

4. Format and lint:
```bash
cargo fmt
cargo clippy --all-targets --all-features
```

5. Commit and push:
```bash
git add .
git commit -m "Clear description of changes"
git push origin feature/your-feature-name
```

6. Open a pull request with:
   - Clear description of changes
   - Reference to related issues
   - Test results

## Testing Guidelines

### Unit Tests

Place unit tests in the same file as the code they test:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_something() {
        // Test implementation
    }
}
```

### Integration Tests

Create integration tests in `scg-core/tests/`:

```rust
use scg_core::*;

#[test]
fn test_integration() {
    // Test implementation
}
```

### Test Coverage

Aim for:
- Unit tests for all public functions
- Integration tests for key workflows
- Edge cases and error conditions

## Documentation

### Code Documentation

Use doc comments for public APIs:

```rust
/// Brief description
///
/// Longer description with details.
///
/// # Examples
///
/// ```
/// use scg_core::Variable;
/// let var = Variable::new(1);
/// ```
///
/// # Errors
///
/// Returns error if...
pub fn my_function() -> Result<(), Error> {
    // Implementation
}
```

### Examples

Create runnable examples in `examples/`:

```rust
//! Example title
//!
//! Description of what this example demonstrates

use scg_core::*;

fn main() {
    // Example code
}
```

## Performance Considerations

When contributing performance-sensitive code:

1. Profile before optimizing
2. Add benchmarks for critical paths
3. Document performance characteristics
4. Consider algorithmic complexity

## Feature Flags

When adding optional features:

1. Add to `Cargo.toml`:
```toml
[features]
my-feature = ["dependency"]
```

2. Use conditional compilation:
```rust
#[cfg(feature = "my-feature")]
pub fn optional_function() {
    // Implementation
}
```

## Pull Request Checklist

Before submitting a PR, ensure:

- [ ] All tests pass (`cargo test`)
- [ ] Code is formatted (`cargo fmt`)
- [ ] No clippy warnings (`cargo clippy`)
- [ ] Documentation is updated
- [ ] Examples run successfully
- [ ] Commit messages are clear
- [ ] PR description explains the changes

## Questions or Issues?

- Open an issue for bugs or feature requests
- Check existing documentation in README.md
- Review the legacy JavaScript code for reference (but don't modify it)

## License

By contributing, you agree that your contributions will be licensed under MIT OR Apache-2.0.

Thank you for contributing to SCG!
