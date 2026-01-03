---
title: Breadth-First Search
order: 2
estimatedMinutes: 18
---

# Breadth-First Search (BFS)

BFS explores a graph level by level, visiting all neighbors before moving to the next depth. It's ideal for finding shortest paths in unweighted graphs.

## How BFS Works

1. Start at a source vertex
2. Visit all neighbors (distance 1)
3. Then all their unvisited neighbors (distance 2)
4. Continue until all reachable vertices are visited

BFS uses a **queue** (FIFO) to track vertices to visit.

## Basic BFS Implementation

```python
from collections import deque

def bfs(graph, start):
    """
    Perform BFS traversal from start vertex.
    Returns list of vertices in BFS order.
    """
    visited = set()
    queue = deque([start])
    visited.add(start)
    result = []

    while queue:
        vertex = queue.popleft()
        result.append(vertex)

        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return result

# Example
graph = {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5],
    3: [1],
    4: [1, 5],
    5: [2, 4]
}

print(bfs(graph, 0))  # [0, 1, 2, 3, 4, 5]
```

## BFS with Distance Tracking

Find shortest path distance to all vertices:

```python
from collections import deque

def bfs_distances(graph, start):
    """Return dictionary of distances from start to each vertex."""
    distances = {start: 0}
    queue = deque([start])

    while queue:
        vertex = queue.popleft()

        for neighbor in graph[vertex]:
            if neighbor not in distances:
                distances[neighbor] = distances[vertex] + 1
                queue.append(neighbor)

    return distances

graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C', 'E'],
    'E': ['D']
}

print(bfs_distances(graph, 'A'))
# {'A': 0, 'B': 1, 'C': 1, 'D': 2, 'E': 3}
```

## Finding Shortest Path

Track parent vertices to reconstruct the path:

```python
from collections import deque

def shortest_path(graph, start, end):
    """Find shortest path from start to end."""
    if start == end:
        return [start]

    visited = {start}
    queue = deque([(start, [start])])

    while queue:
        vertex, path = queue.popleft()

        for neighbor in graph[vertex]:
            if neighbor == end:
                return path + [neighbor]

            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))

    return []  # No path exists

# Alternative: track parents
def shortest_path_with_parent(graph, start, end):
    """Find shortest path using parent tracking."""
    parent = {start: None}
    queue = deque([start])

    while queue:
        vertex = queue.popleft()

        if vertex == end:
            # Reconstruct path
            path = []
            current = end
            while current is not None:
                path.append(current)
                current = parent[current]
            return path[::-1]

        for neighbor in graph[vertex]:
            if neighbor not in parent:
                parent[neighbor] = vertex
                queue.append(neighbor)

    return []
```

## BFS on a Grid

Grids are common graph problems where cells are vertices:

```python
from collections import deque

def bfs_grid(grid, start_row, start_col):
    """BFS on a 2D grid. Return distances from start."""
    rows, cols = len(grid), len(grid[0])
    distances = [[-1] * cols for _ in range(rows)]
    distances[start_row][start_col] = 0

    queue = deque([(start_row, start_col)])
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]

    while queue:
        row, col = queue.popleft()

        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            # Check bounds
            if 0 <= new_row < rows and 0 <= new_col < cols:
                # Check if unvisited and not blocked
                if distances[new_row][new_col] == -1 and grid[new_row][new_col] != '#':
                    distances[new_row][new_col] = distances[row][col] + 1
                    queue.append((new_row, new_col))

    return distances

# Example: find shortest path in maze
maze = [
    ['.', '.', '#', '.'],
    ['.', '#', '.', '.'],
    ['.', '.', '.', '#'],
    ['#', '.', '.', '.']
]

distances = bfs_grid(maze, 0, 0)
print(distances[3][3])  # Distance to bottom-right
```

## Multi-Source BFS

Start from multiple sources simultaneously:

```python
from collections import deque

def multi_source_bfs(grid, sources):
    """BFS from multiple starting points."""
    rows, cols = len(grid), len(grid[0])
    distances = [[-1] * cols for _ in range(rows)]
    queue = deque()

    # Add all sources with distance 0
    for row, col in sources:
        distances[row][col] = 0
        queue.append((row, col))

    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]

    while queue:
        row, col = queue.popleft()

        for dr, dc in directions:
            nr, nc = row + dr, col + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                if distances[nr][nc] == -1:
                    distances[nr][nc] = distances[row][col] + 1
                    queue.append((nr, nc))

    return distances
```

## Time and Space Complexity

- **Time**: O(V + E) - visit each vertex and edge once
- **Space**: O(V) - queue and visited set

## When to Use BFS

1. **Shortest path in unweighted graph**
2. **Level-order traversal**
3. **Finding connected components**
4. **Checking if path exists**
5. **Minimum steps/moves problems**

## Key Takeaways

1. BFS explores level by level using a queue
2. Guarantees shortest path in unweighted graphs
3. Time complexity: O(V + E)
4. Use `visited` set to avoid revisiting vertices
5. Grid problems treat cells as vertices with 4 neighbors

Next, we'll explore depth-first search (DFS).
