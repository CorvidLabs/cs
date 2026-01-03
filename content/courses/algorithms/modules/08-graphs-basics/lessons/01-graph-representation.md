---
title: Graph Representation
order: 1
estimatedMinutes: 18
---

# Graph Representation

A graph is a data structure consisting of vertices (nodes) and edges connecting them. Graphs model relationships: social networks, maps, dependencies, and more.

## Graph Terminology

- **Vertex (Node)**: A point in the graph
- **Edge**: A connection between two vertices
- **Directed Graph**: Edges have direction (A→B is different from B→A)
- **Undirected Graph**: Edges have no direction (A-B means both ways)
- **Weighted Graph**: Edges have associated values (costs, distances)
- **Degree**: Number of edges connected to a vertex

## Adjacency List

The most common representation. Each vertex stores a list of its neighbors.

```python
# Undirected graph using dictionary
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

# Get neighbors of B
print(graph['B'])  # ['A', 'D', 'E']
```

### With Edge Weights

```python
# Weighted graph: neighbor -> weight
graph = {
    'A': {'B': 5, 'C': 3},
    'B': {'A': 5, 'D': 2},
    'C': {'A': 3, 'D': 7},
    'D': {'B': 2, 'C': 7}
}

# Get weight of edge A->B
print(graph['A']['B'])  # 5
```

### Using Lists for Integer Vertices

```python
# Graph with n vertices (0 to n-1)
n = 5
graph = [[] for _ in range(n)]

# Add edges
graph[0].append(1)  # Edge 0->1
graph[0].append(2)  # Edge 0->2
graph[1].append(3)  # Edge 1->3
```

## Adjacency Matrix

A 2D array where `matrix[i][j]` indicates if edge exists from i to j.

```python
# 4 vertices (0, 1, 2, 3)
#     0  1  2  3
# 0 [[0, 1, 1, 0],   # 0 connects to 1, 2
# 1  [1, 0, 0, 1],   # 1 connects to 0, 3
# 2  [1, 0, 0, 1],   # 2 connects to 0, 3
# 3  [0, 1, 1, 0]]   # 3 connects to 1, 2

matrix = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0]
]

# Check if edge exists from 0 to 1
print(matrix[0][1])  # 1 (True)

# Check if edge exists from 0 to 3
print(matrix[0][3])  # 0 (False)
```

### With Weights

```python
# Weighted adjacency matrix (0 or infinity for no edge)
INF = float('inf')
matrix = [
    [0,   5,   3,   INF],
    [5,   0,   INF, 2],
    [3,   INF, 0,   7],
    [INF, 2,   7,   0]
]

# Weight from 0 to 1
print(matrix[0][1])  # 5
```

## Comparison

| Operation | Adjacency List | Adjacency Matrix |
|-----------|---------------|-----------------|
| Space | O(V + E) | O(V²) |
| Check edge exists | O(degree) | O(1) |
| Get all neighbors | O(1) | O(V) |
| Add edge | O(1) | O(1) |

**Use Adjacency List when:**
- Graph is sparse (few edges)
- Need to iterate over neighbors often
- Memory is a concern

**Use Adjacency Matrix when:**
- Graph is dense (many edges)
- Need fast edge lookup
- V is small

## Edge List

Simply a list of all edges:

```python
# Each tuple is (from, to) or (from, to, weight)
edges = [
    ('A', 'B', 5),
    ('A', 'C', 3),
    ('B', 'D', 2),
    ('C', 'D', 7)
]

# Easy to iterate all edges
for u, v, weight in edges:
    print(f"{u} -> {v}: {weight}")
```

Useful for algorithms that process edges directly (like Kruskal's MST).

## Building Graphs from Input

### From Edge List

```python
def build_graph(n, edges):
    """Build adjacency list from edge list."""
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)  # Omit for directed graph
    return graph

edges = [(0, 1), (0, 2), (1, 3), (2, 3)]
graph = build_graph(4, edges)
print(graph)  # [[1, 2], [0, 3], [0, 3], [1, 2]]
```

### Directed Graph

```python
def build_directed_graph(n, edges):
    """Build directed adjacency list."""
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)  # Only one direction
    return graph
```

## Key Takeaways

1. Graphs consist of vertices and edges
2. Adjacency list is best for sparse graphs, uses O(V + E) space
3. Adjacency matrix is best for dense graphs, uses O(V²) space
4. Choose representation based on graph density and operations needed
5. Edge lists are useful for edge-centric algorithms

Next, we'll learn breadth-first search (BFS) traversal.
