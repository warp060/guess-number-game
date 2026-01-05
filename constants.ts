
export const MAX_ATTEMPTS = 7;
export const RANGE_MIN = 1;
export const RANGE_MAX = 10;

// Production Theme Colors
export const THEME = {
  cyan: '#22d3ee',
  pink: '#f472b6',
  purple: '#a855f7',
  blue: '#3b82f6',
  bg: '#0c0032'
};

/* Ludo Color Map */
export const COLORS: Record<string, string> = {
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#eab308',
  blue: '#3b82f6'
};

/* Ludo Initial Token Generator */
export const INITIAL_TOKENS = (color: any) => [
  { id: 1, color, position: -1, isAtHome: false },
  { id: 2, color, position: -1, isAtHome: false },
  { id: 3, color, position: -1, isAtHome: false },
  { id: 4, color, position: -1, isAtHome: false },
];

/* Ludo Safe Zones (Shared Path Indices) */
export const SAFE_ZONES = [1, 9, 14, 22, 27, 35, 40, 48];

/* Ludo Starting Positions for Each Sector */
export const BASE_START_POSITIONS: Record<string, number> = {
  red: 1,
  green: 14,
  yellow: 27,
  blue: 40
};

/* Ludo 15x15 Grid Coordinates for the Shared Path */
export const SHARED_PATH_COORDS: [number, number][] = [
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 7], [0, 8],
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  [7, 14], [8, 14],
  [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  [14, 7], [14, 6],
  [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  [7, 0], [6, 0]
];

/* Ludo Home Stretch Coordinates for Each Player */
export const HOME_STRETCH_COORDS: Record<string, [number, number][]> = {
  red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  green: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
  blue: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]]
};

/* Ludo Winning Cell Coordinate */
export const HOME_COORD: [number, number] = [7, 7];
