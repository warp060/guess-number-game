
// Fix: Import types from types.ts
import { PlayerColor, Token } from './types.ts';

export const MAX_ATTEMPTS = 7;
export const RANGE_MIN = 1;
export const RANGE_MAX = 10;

export const COLORS = {
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#eab308',
  blue: '#3b82f6',
};

// Returns initial tokens for a player based on color
// Fix: Use PlayerColor and Token types instead of any
export const INITIAL_TOKENS = (color: PlayerColor): Token[] => [
  { id: 1, color, position: -1, isAtHome: false },
  { id: 2, color, position: -1, isAtHome: false },
  { id: 3, color, position: -1, isAtHome: false },
  { id: 4, color, position: -1, isAtHome: false },
];

export const SAFE_ZONES = [1, 9, 14, 22, 27, 35, 40, 48];

export const BASE_START_POSITIONS = {
  red: 1,
  green: 14,
  yellow: 27,
  blue: 40,
};

// Full board path coordinates for a 15x15 Ludo board
export const SHARED_PATH_COORDS: [number, number][] = [
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6], [0, 7], [0, 8],
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14], [7, 14], [8, 14],
  [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8], [14, 7], [14, 6],
  [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0], [7, 0], [6, 0]
];

export const HOME_STRETCH_COORDS: Record<string, [number, number][]> = {
  red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]],
  green: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]],
  yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 8]],
  blue: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]],
};

export const HOME_COORD: [number, number] = [7, 7];
