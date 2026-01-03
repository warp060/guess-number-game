
import { PlayerColor } from './types';

export const COLORS: Record<PlayerColor, string> = {
  red: '#ff0055',    // Neon Pink-Red
  green: '#00ff99',  // Neon Seafoam
  yellow: '#f4ff00', // Neon Yellow
  blue: '#00d4ff',   // Neon Cyan
};

export const BASE_START_POSITIONS: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

// Coordinate mapping for the 52 shared path squares on a 15x15 grid
export const SHARED_PATH_COORDS: [number, number][] = [
  // Red side start (r6)
  [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  // Top green side (c6)
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 7], // Top junction
  [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  // Green side end (r6)
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  [7, 14], // Right junction
  [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  // Bottom yellow side (c8)
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  [14, 7], // Bottom junction
  [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  // Blue side end (r8)
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  [7, 0]  // Left junction
];

// Home stretch mapping: 52-56 indices
export const HOME_STRETCH_COORDS: Record<PlayerColor, [number, number][]> = {
  red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  green: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
  blue: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]]
};

// Final home square: 57
export const HOME_COORD: [number, number] = [7, 7];

export const INITIAL_TOKENS = (color: PlayerColor) => [
  { id: 0, color, position: -1, isAtHome: false },
  { id: 1, color, position: -1, isAtHome: false },
  { id: 2, color, position: -1, isAtHome: false },
  { id: 3, color, position: -1, isAtHome: false },
];

export const SAFE_ZONES = [0, 8, 13, 21, 26, 34, 39, 47];
