---
title: Bellman-Ford Algorithm
order: 2
estimatedMinutes: 16
---

# Bellman-Ford Algorithm

Bellman-Ford finds shortest paths from a source vertex, handling negative edge weights and detecting negative cycles.

## How It Works

1. Initialize distances: 0 for source, infinity for others
2. Relax all edges V-1 times
3. Check for negative cycles (one more relaxation)

"Relaxing" an edge means: if we can reach the destination faster through this edge, update its distance.

## Implementation

```python
def bellman_ford(n, edges, start):
    """
    Find shortest distances from start.

    Args:
        n: number of vertices (0 to n-1)
        edges: list of (u, v, weight) tuples
        start: starting vertex

    Returns:
        distances array, or None if negative cycle exists
    """
    distances = [float('inf')] * n
    distances[start] = 0

    # Relax all edges V-1 times
    for _ in range(n - 1):
        updated = False
        for u, v, weight in edges:
            if distances[u] != float('inf'):
                if distances[u] + weight < distances[v]:
                    distances[v] = distances[u] + weight
                    updated = True

        # Early termination if no updates
        if not updated:
            break

    # Check for negative cycles
    for u, v, weight in edges:
        if distances[u] != float('inf'):
            if distances[u] + weight < distances[v]:
                return None  # Negative cycle detected

    return distances

# Example
edges = [
    (0, 1, 4),
    (0, 2, 5),
    (1, 2, -3),
    (2, 3, 4)
]

result = bellman_ford(4, edges, 0)
print(result)  # [0, 4, 1, 5]
```

## With Path Reconstruction

```python
def bellman_ford_with_path(n, edges, start, end):
    """Find shortest path with negative weight handling."""
    distances = [float('inf')] * n
    distances[start] = 0
    previous = [-1] * n

    for _ in range(n - 1):
        for u, v, weight in edges:
            if distances[u] != float('inf'):
                if distances[u] + weight < distances[v]:
                    distances[v] = distances[u] + weight
                    previous[v] = u

    # Check for negative cycle
    for u, v, weight in edges:
        if distances[u] != float('inf'):
            if distances[u] + weight < distances[v]:
                return None, []

    # Reconstruct path
    if distances[end] == float('inf'):
        return float('inf'), []

    path = []
    current = end
    while current != -1:
        path.append(current)
        current = previous[current]

    return distances[end], path[::-1]
```

## Detecting Negative Cycles

```python
def has_negative_cycle(n, edges):
    """Check if graph has a negative cycle."""
    distances = [0] * n  # Start all at 0

    for _ in range(n - 1):
        for u, v, weight in edges:
            if distances[u] + weight < distances[v]:
                distances[v] = distances[u] + weight

    # One more iteration - if any update, there's a cycle
    for u, v, weight in edges:
        if distances[u] + weight < distances[v]:
            return True

    return False
```

## Time and Space Complexity

- **Time**: O(V × E)
- **Space**: O(V)

## Bellman-Ford vs Dijkstra

| Feature | Dijkstra | Bellman-Ford |
|---------|----------|--------------|
| Negative weights | No | Yes |
| Negative cycles | Cannot detect | Can detect |
| Time complexity | O((V+E) log V) | O(V × E) |
| Implementation | More complex | Simpler |

## When to Use

- **Use Bellman-Ford when:**
  - Graph may have negative edge weights
  - Need to detect negative cycles
  - Graph is sparse (few edges)

- **Use Dijkstra when:**
  - All weights are non-negative
  - Need better performance

## Key Takeaways

1. Bellman-Ford handles negative edge weights
2. Relax all edges V-1 times
3. One more iteration detects negative cycles
4. Slower than Dijkstra: O(V × E) vs O((V+E) log V)
5. Simpler to implement than Dijkstra

Next, we'll explore Minimum Spanning Trees.
