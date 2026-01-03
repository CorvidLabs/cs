---
title: Minimum Spanning Trees
order: 3
estimatedMinutes: 18
---

# Minimum Spanning Trees

A Minimum Spanning Tree (MST) connects all vertices with the minimum total edge weight. It has exactly V-1 edges (V = number of vertices).

## Kruskal's Algorithm

Sort edges by weight, add each edge if it doesn't create a cycle.

```python
def kruskal(n, edges):
    """
    Find MST using Kruskal's algorithm.

    Args:
        n: number of vertices
        edges: list of (weight, u, v) tuples

    Returns:
        (total_weight, list of edges in MST)
    """
    # Sort edges by weight
    edges.sort()

    # Union-Find for cycle detection
    parent = list(range(n))
    rank = [0] * n

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return False  # Already connected
        if rank[px] < rank[py]:
            px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]:
            rank[px] += 1
        return True

    mst_weight = 0
    mst_edges = []

    for weight, u, v in edges:
        if union(u, v):
            mst_weight += weight
            mst_edges.append((u, v, weight))
            if len(mst_edges) == n - 1:
                break

    return mst_weight, mst_edges

# Example
edges = [
    (4, 0, 1), (8, 0, 7), (11, 1, 7), (8, 1, 2),
    (7, 2, 8), (2, 2, 5), (4, 2, 3), (9, 3, 4),
    (14, 3, 5), (10, 4, 5), (1, 6, 7), (2, 6, 8),
    (6, 5, 6), (7, 7, 8)
]

weight, mst = kruskal(9, edges)
print(f"MST weight: {weight}")  # 37
```

## Prim's Algorithm

Start from any vertex, always add the minimum edge to an unvisited vertex.

```python
import heapq

def prim(graph, n):
    """
    Find MST using Prim's algorithm.

    Args:
        graph: adjacency list {vertex: [(neighbor, weight), ...]}
        n: number of vertices

    Returns:
        (total_weight, list of edges in MST)
    """
    visited = [False] * n
    pq = [(0, 0, -1)]  # (weight, vertex, from_vertex)
    mst_weight = 0
    mst_edges = []

    while pq and len(mst_edges) < n:
        weight, vertex, from_vertex = heapq.heappop(pq)

        if visited[vertex]:
            continue

        visited[vertex] = True
        mst_weight += weight

        if from_vertex != -1:
            mst_edges.append((from_vertex, vertex, weight))

        for neighbor, edge_weight in graph[vertex]:
            if not visited[neighbor]:
                heapq.heappush(pq, (edge_weight, neighbor, vertex))

    return mst_weight, mst_edges

# Example with adjacency list
graph = {
    0: [(1, 4), (7, 8)],
    1: [(0, 4), (7, 11), (2, 8)],
    2: [(1, 8), (8, 7), (5, 2), (3, 4)],
    3: [(2, 4), (4, 9), (5, 14)],
    4: [(3, 9), (5, 10)],
    5: [(2, 2), (3, 14), (4, 10), (6, 6)],
    6: [(7, 1), (8, 2), (5, 6)],
    7: [(0, 8), (1, 11), (6, 1), (8, 7)],
    8: [(2, 7), (7, 7), (6, 2)]
}

weight, mst = prim(graph, 9)
print(f"MST weight: {weight}")  # 37
```

## Kruskal vs Prim

| Feature | Kruskal | Prim |
|---------|---------|------|
| Approach | Edge-based | Vertex-based |
| Best for | Sparse graphs | Dense graphs |
| Data structure | Union-Find | Priority Queue |
| Time (with heap) | O(E log E) | O(E log V) |

## Time Complexity

- **Kruskal**: O(E log E) for sorting edges
- **Prim**: O(E log V) with binary heap

## Applications

1. **Network Design**: Minimum cable/wire to connect all nodes
2. **Clustering**: Remove longest edges to create clusters
3. **Approximation**: Some NP-hard problems use MST

## Key Takeaways

1. MST connects all vertices with minimum total weight
2. An MST has exactly V-1 edges
3. Kruskal: sort edges, add if no cycle (use Union-Find)
4. Prim: grow tree from a vertex using min-heap
5. Both produce the same total weight (MST is not unique, but weight is)

Next, we'll learn the Union-Find data structure in depth.
