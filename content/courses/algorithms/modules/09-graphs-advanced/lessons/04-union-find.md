---
title: Union-Find Data Structure
order: 4
estimatedMinutes: 16
---

# Union-Find (Disjoint Set Union)

Union-Find efficiently tracks elements partitioned into disjoint sets. It supports two operations: find (which set an element belongs to) and union (merge two sets).

## Basic Implementation

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        """Find the root of x's set."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]

    def union(self, x, y):
        """Merge sets containing x and y. Return True if merged."""
        px, py = self.find(x), self.find(y)

        if px == py:
            return False  # Already in same set

        # Union by rank
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px

        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1

        return True

    def connected(self, x, y):
        """Check if x and y are in the same set."""
        return self.find(x) == self.find(y)
```

## Optimizations

### Path Compression

Flatten the tree during `find` - make each node point directly to root:

```python
def find(self, x):
    if self.parent[x] != x:
        self.parent[x] = self.find(self.parent[x])  # Path compression
    return self.parent[x]
```

### Union by Rank

Always attach smaller tree under larger tree:

```python
def union(self, x, y):
    px, py = self.find(x), self.find(y)
    if px == py:
        return False

    # Attach smaller rank tree under larger rank root
    if self.rank[px] < self.rank[py]:
        px, py = py, px
    self.parent[py] = px

    if self.rank[px] == self.rank[py]:
        self.rank[px] += 1

    return True
```

With both optimizations, operations are nearly O(1) - specifically O(α(n)) where α is the inverse Ackermann function.

## With Size Tracking

Track the size of each set:

```python
class UnionFindWithSize:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False

        # Union by size
        if self.size[px] < self.size[py]:
            px, py = py, px
        self.parent[py] = px
        self.size[px] += self.size[py]

        return True

    def get_size(self, x):
        """Get size of set containing x."""
        return self.size[self.find(x)]
```

## Common Applications

### 1. Connected Components

```python
def count_components(n, edges):
    """Count connected components."""
    uf = UnionFind(n)

    for u, v in edges:
        uf.union(u, v)

    # Count unique roots
    return len(set(uf.find(i) for i in range(n)))
```

### 2. Cycle Detection

```python
def has_cycle(n, edges):
    """Detect cycle in undirected graph."""
    uf = UnionFind(n)

    for u, v in edges:
        if uf.find(u) == uf.find(v):
            return True  # Already connected = cycle
        uf.union(u, v)

    return False
```

### 3. Kruskal's MST

```python
def kruskal_mst(n, edges):
    """Find MST using Kruskal's algorithm."""
    uf = UnionFind(n)
    edges.sort()  # Sort by weight

    mst_weight = 0
    mst_edges = []

    for weight, u, v in edges:
        if uf.union(u, v):
            mst_weight += weight
            mst_edges.append((u, v, weight))

    return mst_weight, mst_edges
```

### 4. Redundant Connection

```python
def find_redundant_edge(edges):
    """Find edge that creates a cycle."""
    n = len(edges)
    uf = UnionFind(n + 1)

    for u, v in edges:
        if not uf.union(u, v):
            return [u, v]  # This edge creates a cycle

    return []
```

## Time and Space Complexity

- **Time**: O(α(n)) per operation ≈ O(1)
- **Space**: O(n)

α(n) is the inverse Ackermann function, which grows extremely slowly. For all practical purposes, it's ≤ 4.

## Key Takeaways

1. Union-Find tracks disjoint sets efficiently
2. Path compression flattens trees during find
3. Union by rank keeps trees balanced
4. With both optimizations: nearly O(1) operations
5. Essential for Kruskal's MST and connectivity queries

This completes the advanced graph algorithms module.
