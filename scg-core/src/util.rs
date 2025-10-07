//! Utility functions for SCG

use crate::triple::{Id, Triple};
use std::collections::{HashMap, HashSet};

/// Find connected components in a set of triples based on variable sharing
///
/// Creates a graph where nodes are triples and edges connect triples that
/// share any variable (entity or value). Returns groups of triple indices.
pub fn find_connected_components(triples: &[Triple]) -> Vec<Vec<usize>> {
    if triples.is_empty() {
        return vec![];
    }

    // Build variable -> triple indices mapping
    let mut var_to_triples: HashMap<Id, Vec<usize>> = HashMap::new();

    for (idx, triple) in triples.iter().enumerate() {
        var_to_triples
            .entry(triple.e)
            .or_insert_with(Vec::new)
            .push(idx);
        var_to_triples
            .entry(triple.v)
            .or_insert_with(Vec::new)
            .push(idx);
    }

    // Build adjacency list for triple indices
    let mut adjacency: HashMap<usize, HashSet<usize>> = HashMap::new();

    for triple_indices in var_to_triples.values() {
        // Connect all triples that share this variable
        for &i in triple_indices {
            for &j in triple_indices {
                if i != j {
                    adjacency.entry(i).or_insert_with(HashSet::new).insert(j);
                }
            }
        }
    }

    // Find connected components using DFS
    let mut visited = vec![false; triples.len()];
    let mut components = Vec::new();

    for start_idx in 0..triples.len() {
        if visited[start_idx] {
            continue;
        }

        let mut component = Vec::new();
        let mut stack = vec![start_idx];

        while let Some(idx) = stack.pop() {
            if visited[idx] {
                continue;
            }

            visited[idx] = true;
            component.push(idx);

            if let Some(neighbors) = adjacency.get(&idx) {
                for &neighbor in neighbors {
                    if !visited[neighbor] {
                        stack.push(neighbor);
                    }
                }
            }
        }

        components.push(component);
    }

    components
}

/// Generate a fresh variable ID
pub fn fresh_variable_id(counter: &mut u64) -> Id {
    let id = *counter;
    *counter += 1;
    crate::variable::Variable::make_variable_id(id)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::triple::Triple;
    use crate::variable::Variable;

    #[test]
    fn test_connected_components_single() {
        let v1 = Variable::make_variable_id(1);
        let v2 = Variable::make_variable_id(2);

        let triples = vec![
            Triple::new(v1, 100, v2),
        ];

        let components = find_connected_components(&triples);
        assert_eq!(components.len(), 1);
        assert_eq!(components[0].len(), 1);
    }

    #[test]
    fn test_connected_components_connected() {
        let v1 = Variable::make_variable_id(1);
        let v2 = Variable::make_variable_id(2);
        let v3 = Variable::make_variable_id(3);

        let triples = vec![
            Triple::new(v1, 100, v2),
            Triple::new(v2, 101, v3),
        ];

        let components = find_connected_components(&triples);
        assert_eq!(components.len(), 1);
        assert_eq!(components[0].len(), 2);
    }

    #[test]
    fn test_connected_components_disconnected() {
        let v1 = Variable::make_variable_id(1);
        let v2 = Variable::make_variable_id(2);
        let v3 = Variable::make_variable_id(3);
        let v4 = Variable::make_variable_id(4);

        let triples = vec![
            Triple::new(v1, 100, v2),
            Triple::new(v3, 101, v4),
        ];

        let components = find_connected_components(&triples);
        assert_eq!(components.len(), 2);
    }
}
