// lib/pathfinder.ts
// BFS pathfinding on a 2D grid

import { GRID_COLS, GRID_ROWS, ENTRY, EXIT } from "./gamedata";

export interface Point {
  col: number;
  row: number;
}

export type Grid = boolean[][];
export type Path = Point[];

/**
 * Create a fresh empty grid (all cells unblocked)
 */
export function newGrid(): Grid {
  const g: Grid = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    g[r] = [];
    for (let c = 0; c < GRID_COLS; c++) {
      g[r][c] = false; // false = unblocked
    }
  }
  return g;
}

/**
 * Deep-copy a grid
 */
export function copyGrid(src: Grid): Grid {
  const g: Grid = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    g[r] = [];
    for (let c = 0; c < GRID_COLS; c++) {
      g[r][c] = src[r][c];
    }
  }
  return g;
}

/**
 * BFS from ENTRY to EXIT; returns ordered path or null if blocked
 */
export function findPath(grid: Grid): Path | null {
  const start: Point = { col: ENTRY.col - 1, row: ENTRY.row - 1 }; // Convert to 0-indexed
  const goal: Point = { col: EXIT.col - 1, row: EXIT.row - 1 };

  if (grid[start.row][start.col] || grid[goal.row][goal.col]) {
    return null;
  }

  const queue: Array<{ point: Point; path: Path }> = [
    { point: start, path: [start] },
  ];
  const visited: Set<string> = new Set();
  visited.add(`${start.col},${start.row}`);

  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  let head = 0;
  while (head < queue.length) {
    const node = queue[head];
    head++;

    const p = node.point;
    if (p.col === goal.col && p.row === goal.row) {
      return node.path;
    }

    for (const [dx, dy] of dirs) {
      const nc = p.col + dx;
      const nr = p.row + dy;
      const key = `${nc},${nr}`;

      if (
        nc >= 0 &&
        nc < GRID_COLS &&
        nr >= 0 &&
        nr < GRID_ROWS &&
        !grid[nr][nc] &&
        !visited.has(key)
      ) {
        visited.add(key);
        const newPath: Path = [...node.path, { col: nc, row: nr }];
        queue.push({ point: { col: nc, row: nr }, path: newPath });
      }
    }
  }

  return null;
}

/**
 * Returns true if placing a tower at (col, row) would still leave a valid path
 */
export function canPlace(
  grid: Grid,
  col: number,
  row: number
): [boolean, Path | null] {
  // Never block entry/exit (convert to 0-indexed)
  if (
    (col === ENTRY.col - 1 && row === ENTRY.row - 1) ||
    (col === EXIT.col - 1 && row === EXIT.row - 1)
  ) {
    return [false, null];
  }

  if (grid[row][col]) {
    return [false, null]; // already occupied
  }

  const tmp = copyGrid(grid);
  tmp[row][col] = true;
  const path = findPath(tmp);
  return [path !== null, path];
}

/**
 * Convert a path of grid points to world-space positions (Y = base)
 */
export function pathToWorld(path: Path): Array<{ x: number; y: number }> {
  const CS = 8; // CELL_SIZE
  const cols = GRID_COLS;
  const rows = GRID_ROWS;
  const baseY = 1;

  const result: Array<{ x: number; y: number }> = [];
  for (const p of path) {
    // Centre of cell, origin at (0, 0) = grid centre
    const wx = (p.col + 0.5 - cols / 2) * CS;
    const wy = (p.row + 0.5 - rows / 2) * CS;
    result.push({ x: wx, y: wy });
  }
  return result;
}

/**
 * Given a world position, return nearest path index ahead of current index
 */
export function nearestPathIndex(
  worldPath: Array<{ x: number; y: number }>,
  pos: { x: number; y: number },
  currentIndex: number
): number {
  let best = currentIndex;
  let bestDist = Infinity;

  // Only search from current index forward (avoids backtracking)
  for (let i = currentIndex; i < worldPath.length; i++) {
    const dx = worldPath[i].x - pos.x;
    const dy = worldPath[i].y - pos.y;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }

  return best;
}
