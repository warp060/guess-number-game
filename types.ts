
export type GamePhase = 'GUESS' | 'SNAKE';

export interface Point {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/* Ludo Player Colors */
export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

/* Ludo Token Definition */
export interface Token {
  id: number;
  color: PlayerColor;
  position: number;
  isAtHome: boolean;
}

/* Ludo Player Definition */
export interface Player {
  color: PlayerColor;
  tokens: Token[];
  isHuman: boolean;
  hasFinished: boolean;
  isActive: boolean;
  avatarUrl: string;
}

/* Unified GameState for all game logic */
export interface GameState {
  gameStatus: 'playing' | 'won' | 'lost' | 'scanning' | 'IDLE' | 'ROLLING' | 'WAITING_FOR_MOVE' | 'FINISHED';
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  isRolling: boolean;
  message: string;
}
