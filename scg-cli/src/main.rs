//! SCG Command Line Interface

use clap::{Parser, Subcommand};
use scg_core::*;
use std::process;

#[derive(Parser)]
#[command(name = "scg")]
#[command(about = "Streaming Construction Grammar", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Check the installation
    Version,
    /// Run a simple example
    Example {
        #[arg(short, long, default_value = "basic")]
        name: String,
    },
}

fn main() {
    let cli = Cli::parse();

    match cli.command {
        Commands::Version => {
            println!("SCG v{}", env!("CARGO_PKG_VERSION"));
            println!("Streaming Construction Grammar - Rust implementation");
        }
        Commands::Example { name } => {
            run_example(&name);
        }
    }
}

fn run_example(name: &str) {
    match name {
        "basic" => run_basic_example(),
        _ => {
            eprintln!("Unknown example: {}", name);
            eprintln!("Available examples: basic");
            process::exit(1);
        }
    }
}

fn run_basic_example() {
    println!("=== SCG Basic Example ===\n");

    // Create variables
    let v1 = Variable::new(Variable::make_variable_id(1));
    let v2 = Variable::new(Variable::make_variable_id(2));

    println!("Variables: {} {}", v1, v2);

    // Create triples
    let triple = Triple::new(v1.id, 100, v2.id);
    println!("Triple: {}", triple);

    // Create binding and test unification
    let mut binding = Binding::new();
    println!("\nUnifying {} with {}", v1, v2);
    
    if binding.unify(v1.id, v2.id).is_ok() {
        println!("Success! {} == {} => {}", v1, v2, binding.walk(v1.id));
    }

    // Test disequality
    let v3 = Variable::new(Variable::make_variable_id(3));
    let mut binding2 = Binding::new();
    println!("\nAdding disequality: {} != {}", v1, v3);
    binding2.add_disequality(v1.id, v3.id).unwrap();
    
    println!("Attempting to unify {} with {}", v1, v3);
    match binding2.unify(v1.id, v3.id) {
        Ok(_) => println!("Unexpected success"),
        Err(e) => println!("Expected failure: {}", e),
    }

    // Test triple index
    println!("\n=== Triple Index ===");
    let mut index = TripleIndex::new();
    index.with_triples(vec![
        Triple::new(1, 100, 2),
        Triple::new(3, 100, 4),
        Triple::new(5, 101, 6),
    ]);

    println!("Total triples: {}", index.len());
    println!("Triples with attribute 100: {}", index.by_attribute(100).count());
    println!("Triples with attribute 101: {}", index.by_attribute(101).count());

    println!("\n=== Example Complete ===");
}
