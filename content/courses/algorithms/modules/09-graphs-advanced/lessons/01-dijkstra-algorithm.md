---
title: Dijkstra's Algorithm
order: 1
estimatedMinutes: 20
---

# Dijkstra's Algorithm

Dijkstra's algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights.

## How It Works

1. Start with distance 0 to source, infinity to all others
2. Always process the unvisited vertex with minimum distance
3. Update distances to its neighbors if a shorter path is found
4. Repeat until all vertices are processed

## Implementation with Priority Queue

```python
import heapq

def dijkstra(graph, start):
    """
    Find shortest distances from start to all vertices.

    Args:
        graph: dict of {vertex: [(neighbor, weight), ...]}
        start: starting vertex

    Returns:
        dict of {vertex: shortest_distance}
    """
    distances = {start: 0}
    pq = [(0, start)]  # (distance, vertex)
    visited = set()

    while pq:
        dist, vertex = heapq.heappop(pq)

        if vertex in visited:
            continue
        visited.add(vertex)

        for neighbor, weight in graph[vertex]:
            if neighbor not in visited:
                new_dist = dist + weight
                if neighbor not in distances or new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    heapq.heappush(pq, (new_dist, neighbor))

    return distances

# Example
graph = {
    'A': [('B', 4), ('C', 2)],
    'B': [('A', 4), ('C', 1), ('D', 5)],
    'C': [('A', 2), ('B', 1), ('D', 8)],
    'D': [('B', 5), ('C', 8)]
}

print(dijkstra(graph, 'A'))
# {'A': 0, 'C': 2, 'B': 3, 'D': 8}
```

## With Path Reconstruction

```python
import heapq

def dijkstra_with_path(graph, start, end):
    """Find shortest path and distance."""
    distances = {start: 0}
    previous = {start: None}
    pq = [(0, start)]
    visited = set()

    while pq:
        dist, vertex = heapq.heappop(pq)

        if vertex == end:
            # Reconstruct path
            path = []
            current = end
            while current is not None:
                path.append(current)
                current = previous[current]
            return dist, path[::-1]

        if vertex in visited:
            continue
        visited.add(vertex)

        for neighbor, weight in graph[vertex]:
            new_dist = dist + weight
            if neighbor not in distances or new_dist < distances[neighbor]:
                distances[neighbor] = new_dist
                previous[neighbor] = vertex
                heapq.heappush(pq, (new_dist, neighbor))

    return float('inf'), []  # No path exists

dist, path = dijkstra_with_path(graph, 'A', 'D')
print(f"Distance: {dist}, Path: {path}")
# Distance: 8, Path: ['A', 'C', 'B', 'D']
```

## Integer Vertices (0 to n-1)

```python
import heapq

def dijkstra_array(graph, start, n):
    """Dijkstra for graphs with integer vertices."""
    distances = [float('inf')] * n
    distances[start] = 0
    pq = [(0, start)]

    while pq:
        dist, vertex = heapq.heappop(pq)

        if dist > distances[vertex]:
            continue

        for neighbor, weight in graph[vertex]:
            new_dist = dist + weight
            if new_dist < distances[neighbor]:
                distances[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))

    return distances
```

## Time and Space Complexity

- **Time**: O((V + E) log V) with binary heap
- **Space**: O(V) for distances and priority queue

## Limitations

- **Only works with non-negative weights**
- For negative weights, use Bellman-Ford

## Common Applications

1. **GPS Navigation**: Shortest route between locations
2. **Network Routing**: Optimal packet paths
3. **Game AI**: Pathfinding for characters
4. **Social Networks**: Degrees of separation

## Key Takeaways

1. Dijkstra finds shortest paths from one source to all vertices
2. Use a min-heap (priority queue) for efficiency
3. Always process the vertex with minimum known distance
4. Cannot handle negative edge weights
5. Time: O((V + E) log V)

Next, we'll learn Bellman-Ford for graphs with negative weights.
