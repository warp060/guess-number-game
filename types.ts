
export type GamePhase = 'GUESS' | 'SNAKE';

// For Ludo and Setup
export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export interface Token {
  id: number;
  color: PlayerColor;
  position: number;
  isAtHome: boolean;
}

export interface Player {
  color: PlayerColor;
  tokens: Token[];
  isHuman: boolean;
  hasFinished: boolean;
  isActive: boolean;
  avatarUrl: string;
}

// GameState expanded to accommodate both GuessGame and LudoGame statuses and properties
export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  isRolling: boolean;
  message: string;
  gameStatus: 'playing' | 'won' | 'lost' | 'scanning' | 'IDLE' | 'ROLLING' | 'WAITING_FOR_MOVE' | 'FINISHED';
}

export interface Point {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
