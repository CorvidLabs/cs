---
title: Depth-First Search
order: 3
estimatedMinutes: 18
---

# Depth-First Search (DFS)

DFS explores as far as possible along each branch before backtracking. It's useful for exploring all paths, detecting cycles, and topological sorting.

## How DFS Works

1. Start at a vertex
2. Go to an unvisited neighbor
3. Repeat until no unvisited neighbors
4. Backtrack and try other neighbors
5. Continue until all reachable vertices visited

DFS uses a **stack** (or recursion) for backtracking.

## Recursive DFS

```python
def dfs_recursive(graph, start, visited=None):
    """
    Perform DFS traversal recursively.
    Returns list of vertices in DFS order.
    """
    if visited is None:
        visited = set()

    visited.add(start)
    result = [start]

    for neighbor in graph[start]:
        if neighbor not in visited:
            result.extend(dfs_recursive(graph, neighbor, visited))

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

print(dfs_recursive(graph, 0))  # [0, 1, 3, 4, 5, 2]
```

## Iterative DFS

Using an explicit stack:

```python
def dfs_iterative(graph, start):
    """Perform DFS using a stack."""
    visited = set()
    stack = [start]
    result = []

    while stack:
        vertex = stack.pop()

        if vertex not in visited:
            visited.add(vertex)
            result.append(vertex)

            # Add neighbors in reverse for same order as recursive
            for neighbor in reversed(graph[vertex]):
                if neighbor not in visited:
                    stack.append(neighbor)

    return result
```

## DFS for Path Finding

Find if a path exists between two vertices:

```python
def has_path(graph, start, end, visited=None):
    """Check if path exists from start to end."""
    if start == end:
        return True

    if visited is None:
        visited = set()

    visited.add(start)

    for neighbor in graph[start]:
        if neighbor not in visited:
            if has_path(graph, neighbor, end, visited):
                return True

    return False
```

## Finding All Paths

```python
def find_all_paths(graph, start, end, path=None):
    """Find all paths from start to end."""
    if path is None:
        path = []

    path = path + [start]

    if start == end:
        return [path]

    paths = []
    for neighbor in graph[start]:
        if neighbor not in path:  # Avoid cycles
            new_paths = find_all_paths(graph, neighbor, end, path)
            paths.extend(new_paths)

    return paths

graph = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['D'],
    'D': []
}

print(find_all_paths(graph, 'A', 'D'))
# [['A', 'B', 'D'], ['A', 'C', 'D']]
```

## Cycle Detection

### In Undirected Graph

```python
def has_cycle_undirected(graph, n):
    """Detect cycle in undirected graph."""
    visited = set()

    def dfs(node, parent):
        visited.add(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                if dfs(neighbor, node):
                    return True
            elif neighbor != parent:
                # Found a visited node that's not parent = cycle
                return True

        return False

    # Check all components
    for i in range(n):
        if i not in visited:
            if dfs(i, -1):
                return True

    return False
```

### In Directed Graph

Use colors: white (unvisited), gray (in stack), black (done)

```python
def has_cycle_directed(graph, n):
    """Detect cycle in directed graph."""
    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * n

    def dfs(node):
        color[node] = GRAY

        for neighbor in graph[node]:
            if color[neighbor] == GRAY:
                # Back edge = cycle
                return True
            if color[neighbor] == WHITE:
                if dfs(neighbor):
                    return True

        color[node] = BLACK
        return False

    for i in range(n):
        if color[i] == WHITE:
            if dfs(i):
                return True

    return False
```

## Connected Components

Count separate groups of connected vertices:

```python
def count_components(graph, n):
    """Count connected components."""
    visited = set()
    count = 0

    def dfs(node):
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)

    for i in range(n):
        if i not in visited:
            dfs(i)
            count += 1

    return count
```

## DFS on a Grid

```python
def dfs_grid(grid, row, col, visited):
    """DFS on a 2D grid."""
    rows, cols = len(grid), len(grid[0])

    # Check bounds
    if row < 0 or row >= rows or col < 0 or col >= cols:
        return

    # Check if visited or blocked
    if (row, col) in visited or grid[row][col] == '#':
        return

    visited.add((row, col))

    # Explore 4 directions
    dfs_grid(grid, row + 1, col, visited)
    dfs_grid(grid, row - 1, col, visited)
    dfs_grid(grid, row, col + 1, visited)
    dfs_grid(grid, row, col - 1, visited)
```

## Time and Space Complexity

- **Time**: O(V + E) - visit each vertex and edge once
- **Space**: O(V) - recursion stack or explicit stack

## BFS vs DFS

| Feature | BFS | DFS |
|---------|-----|-----|
| Structure | Queue | Stack/Recursion |
| Order | Level by level | Deep first |
| Shortest path | Yes (unweighted) | No |
| Memory | O(width) | O(depth) |
| Use cases | Shortest path, levels | Cycles, all paths, topological sort |

## Key Takeaways

1. DFS goes deep before backtracking
2. Can be implemented recursively or with explicit stack
3. Time complexity: O(V + E)
4. Useful for cycle detection, connectivity, and path finding
5. Unlike BFS, does NOT find shortest paths

Next, we'll explore applications of graph traversals.
