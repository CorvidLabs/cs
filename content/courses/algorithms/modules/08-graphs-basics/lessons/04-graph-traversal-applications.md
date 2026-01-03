---
title: Graph Traversal Applications
order: 4
estimatedMinutes: 16
---

# Graph Traversal Applications

BFS and DFS are building blocks for many graph algorithms. Let's explore common applications.

## Topological Sort

Order vertices so all edges point forward. Only works on DAGs (Directed Acyclic Graphs).

```python
def topological_sort(graph, n):
    """
    Return vertices in topological order.
    Uses DFS with post-order collection.
    """
    visited = set()
    result = []

    def dfs(node):
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)
        result.append(node)  # Add after visiting all descendants

    for i in range(n):
        if i not in visited:
            dfs(i)

    return result[::-1]  # Reverse for correct order

# Example: course prerequisites
# 0 -> 1 -> 3
# 0 -> 2 -> 3
graph = {0: [1, 2], 1: [3], 2: [3], 3: []}
print(topological_sort(graph, 4))  # [0, 2, 1, 3] or [0, 1, 2, 3]
```

### Kahn's Algorithm (BFS-based)

```python
from collections import deque

def topological_sort_kahn(graph, n):
    """Topological sort using BFS (Kahn's algorithm)."""
    # Calculate in-degrees
    in_degree = [0] * n
    for node in range(n):
        for neighbor in graph[node]:
            in_degree[neighbor] += 1

    # Start with nodes having in-degree 0
    queue = deque([i for i in range(n) if in_degree[i] == 0])
    result = []

    while queue:
        node = queue.popleft()
        result.append(node)

        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If not all nodes processed, cycle exists
    return result if len(result) == n else []
```

## Bipartite Check

Determine if a graph can be 2-colored (no adjacent vertices have same color).

```python
from collections import deque

def is_bipartite(graph, n):
    """Check if graph is bipartite using BFS."""
    color = [-1] * n

    for start in range(n):
        if color[start] != -1:
            continue

        queue = deque([start])
        color[start] = 0

        while queue:
            node = queue.popleft()

            for neighbor in graph[node]:
                if color[neighbor] == -1:
                    color[neighbor] = 1 - color[node]
                    queue.append(neighbor)
                elif color[neighbor] == color[node]:
                    return False

    return True
```

## Flood Fill

Fill connected regions (like paint bucket tool):

```python
def flood_fill(grid, row, col, new_color):
    """Fill connected region with new color."""
    rows, cols = len(grid), len(grid[0])
    original_color = grid[row][col]

    if original_color == new_color:
        return grid

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if grid[r][c] != original_color:
            return

        grid[r][c] = new_color
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    dfs(row, col)
    return grid
```

## Number of Islands

Count connected components in a grid:

```python
def count_islands(grid):
    """Count number of islands (groups of 1s)."""
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if grid[r][c] != '1':
            return

        grid[r][c] = '0'  # Mark as visited
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                count += 1

    return count
```

## Word Ladder (Shortest Transformation)

Find shortest path between words changing one letter at a time:

```python
from collections import deque

def word_ladder(begin_word, end_word, word_list):
    """Find shortest transformation sequence."""
    word_set = set(word_list)
    if end_word not in word_set:
        return 0

    queue = deque([(begin_word, 1)])
    visited = {begin_word}

    while queue:
        word, steps = queue.popleft()

        if word == end_word:
            return steps

        # Try changing each position
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                new_word = word[:i] + c + word[i+1:]

                if new_word in word_set and new_word not in visited:
                    visited.add(new_word)
                    queue.append((new_word, steps + 1))

    return 0

print(word_ladder("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]))
# Returns 5: hit -> hot -> dot -> dog -> cog
```

## Clone Graph

Create a deep copy of a graph:

```python
def clone_graph(node):
    """Deep copy a graph given a reference to a node."""
    if not node:
        return None

    cloned = {}

    def dfs(original):
        if original in cloned:
            return cloned[original]

        copy = Node(original.val)
        cloned[original] = copy

        for neighbor in original.neighbors:
            copy.neighbors.append(dfs(neighbor))

        return copy

    return dfs(node)
```

## Course Schedule (Cycle Detection)

Determine if all courses can be completed:

```python
def can_finish(num_courses, prerequisites):
    """Check if all courses can be completed (no cycle in prereqs)."""
    graph = [[] for _ in range(num_courses)]
    for course, prereq in prerequisites:
        graph[prereq].append(course)

    # 0: unvisited, 1: visiting, 2: visited
    state = [0] * num_courses

    def has_cycle(node):
        if state[node] == 1:  # Currently visiting = cycle
            return True
        if state[node] == 2:  # Already fully explored
            return False

        state[node] = 1  # Mark as visiting

        for neighbor in graph[node]:
            if has_cycle(neighbor):
                return True

        state[node] = 2  # Mark as visited
        return False

    for course in range(num_courses):
        if has_cycle(course):
            return False

    return True
```

## Key Takeaways

1. **Topological Sort**: Order tasks with dependencies (DAG only)
2. **Bipartite Check**: 2-coloring problem, useful for matching
3. **Flood Fill**: Fill connected regions
4. **Islands**: Count connected components
5. **Word Ladder**: BFS for shortest transformation
6. **Clone Graph**: Deep copy using DFS
7. **Course Schedule**: Cycle detection in prerequisites

These patterns appear frequently in interviews and real-world applications.
