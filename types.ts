
export type GamePhase = 'GUESS' | 'LUDO_SETUP' | 'LUDO_PLAY';

export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export interface Token {
  id: number;
  color: PlayerColor;
  position: number; // -1 means in base, 57 is home
  isAtHome: boolean;
}

export interface Player {
  color: PlayerColor;
  tokens: Token[];
  isHuman: boolean;
  hasFinished: boolean;
  isActive: boolean; // For choosing 2, 3, or 4 players
  avatarUrl: string;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  isRolling: boolean;
  message: string;
  gameStatus: 'IDLE' | 'ROLLING' | 'WAITING_FOR_MOVE' | 'FINISHED';
}
