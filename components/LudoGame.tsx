
import React, { useState, useEffect, useCallback } from 'react';
import Dice from './Dice.tsx';
import Board from './Board.tsx';
import { GameState, Player, PlayerColor, Token } from '../types.ts';
import { COLORS, INITIAL_TOKENS, SAFE_ZONES, BASE_START_POSITIONS } from '../constants.ts';

interface PlayerConfig {
  color: PlayerColor;
  type: 'HUMAN' | 'AI' | 'CLOSED';
  avatar: string;
}

interface LudoGameProps {
  playerConfigs: PlayerConfig[];
  onReset: () => void;
}

const LudoGame: React.FC<LudoGameProps> = ({ playerConfigs, onReset }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const players: Player[] = playerConfigs.map(config => ({
      color: config.color,
      tokens: INITIAL_TOKENS(config.color),
      isHuman: config.type === 'HUMAN',
      hasFinished: false,
      isActive: config.type !== 'CLOSED',
      avatarUrl: config.avatar
    }));

    const firstIdx = players.findIndex(p => p.isActive);
    return {
      players,
      currentPlayerIndex: firstIdx,
      diceValue: null,
      isRolling: false,
      message: `${players[firstIdx].color.toUpperCase()}'S TURN`,
      gameStatus: 'IDLE',
    };
  });

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  const canMoveToken = (token: Token, dice: number): boolean => {
    if (token.isAtHome) return false;
    if (token.position === -1) return dice === 6;
    return token.position + dice <= 57;
  };

  const nextTurn = useCallback(() => {
    setGameState(prev => {
      let nextIdx = (prev.currentPlayerIndex + 1) % 4;
      let iterations = 0;
      while ((!prev.players[nextIdx].isActive || prev.players[nextIdx].hasFinished) && iterations < 8) {
        nextIdx = (nextIdx + 1) % 4;
        iterations++;
      }
      return {
        ...prev,
        currentPlayerIndex: nextIdx,
        diceValue: null,
        gameStatus: 'IDLE',
        message: `${prev.players[nextIdx].color.toUpperCase()}'S TURN`,
      };
    });
  }, []);

  const handleRollDice = () => {
    if (gameState.gameStatus !== 'IDLE' || gameState.isRolling) return;
    setGameState(prev => ({ ...prev, isRolling: true, gameStatus: 'ROLLING' }));

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setGameState(prev => {
        const moves = prev.players[prev.currentPlayerIndex].tokens.filter(t => canMoveToken(t, roll));
        if (moves.length === 0) {
          setTimeout(nextTurn, 1000);
          return { ...prev, diceValue: roll, isRolling: false, gameStatus: 'WAITING_FOR_MOVE', message: 'NO MOVES' };
        }
        return { 
          ...prev, 
          diceValue: roll, 
          isRolling: false, 
          gameStatus: 'WAITING_FOR_MOVE', 
          message: 'CHOOSE TOKEN'
        };
      });
    }, 600);
  };

  const handleTokenClick = (token: Token) => {
    if (gameState.gameStatus !== 'WAITING_FOR_MOVE' || !gameState.diceValue) return;
    if (token.color !== currentPlayer.color) return;
    
    const roll = gameState.diceValue;
    if (!canMoveToken(token, roll)) return;

    let newPos = token.position === -1 ? 0 : token.position + roll;

    setGameState(prev => {
      const updatedPlayers = prev.players.map(p => {
        if (p.color === token.color) {
          const updatedTokens = p.tokens.map(t => t.id === token.id ? { ...t, position: newPos, isAtHome: newPos === 57 } : t);
          return { ...p, tokens: updatedTokens, hasFinished: updatedTokens.every(ut => ut.isAtHome) };
        }
        return p;
      });

      if (updatedPlayers[prev.currentPlayerIndex].hasFinished) {
        return { ...prev, players: updatedPlayers, gameStatus: 'FINISHED', message: `${token.color.toUpperCase()} WINS!` };
      }
      return { ...prev, players: updatedPlayers, gameStatus: 'IDLE' };
    });

    if (roll !== 6) nextTurn();
  };

  useEffect(() => {
    if (!currentPlayer.isHuman && gameState.gameStatus === 'IDLE') {
      const t = setTimeout(handleRollDice, 800);
      return () => clearTimeout(t);
    }
    if (!currentPlayer.isHuman && gameState.gameStatus === 'WAITING_FOR_MOVE') {
      const t = setTimeout(() => {
        const moves = currentPlayer.tokens.filter(t => canMoveToken(t, gameState.diceValue!));
        if (moves.length > 0) handleTokenClick(moves[Math.floor(Math.random() * moves.length)]);
        else nextTurn();
      }, 800);
      return () => clearTimeout(t);
    }
  }, [gameState.currentPlayerIndex, gameState.gameStatus, currentPlayer.isHuman, gameState.diceValue]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-5xl">
      {/* Header Info Panel */}
      <div className="bg-white p-4 border-2 border-black flex gap-4 rounded-xl shadow-lg">
        {gameState.players.filter(p => p.isActive).map(p => (
          <div 
            key={p.color}
            className={`w-12 h-12 border-4 transition-all rounded-lg overflow-hidden ${p.color === currentPlayer.color ? 'border-black scale-110' : 'border-transparent opacity-50'}`}
            style={{ backgroundColor: COLORS[p.color] }}
          >
            <img src={p.avatarUrl} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-10">
        <div className="ludo-container p-2 shadow-2xl border-4 border-black">
          <Board 
            players={gameState.players.filter(p => p.isActive)} 
            onTokenClick={handleTokenClick} 
            activeColor={currentPlayer.color}
            diceValue={gameState.diceValue}
            movableTokenIds={gameState.diceValue ? currentPlayer.tokens.filter(t => canMoveToken(t, gameState.diceValue!)).map(t => t.id) : []}
          />
        </div>

        <div className="flex flex-col items-center gap-4 bg-white p-6 border-4 border-black rounded-3xl shadow-xl min-w-[200px]">
          <Dice 
            value={gameState.diceValue} 
            isRolling={gameState.isRolling} 
            onClick={handleRollDice} 
            disabled={!currentPlayer.isHuman || gameState.gameStatus !== 'IDLE'} 
            color={COLORS[currentPlayer.color]} 
          />
          <div className="text-center font-black uppercase text-sm tracking-widest mt-4 text-black">
            {gameState.message}
          </div>
          <button 
            onClick={onReset} 
            className="mt-10 px-6 py-2 bg-gray-100 hover:bg-red-100 text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest rounded-full transition-colors"
          >
            Exit Game
          </button>
        </div>
      </div>
      
      {gameState.gameStatus === 'FINISHED' && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white p-12 border-4 border-black text-center max-w-sm w-full rounded-[2rem] shadow-2xl">
            <h2 className="text-4xl font-black mb-4 uppercase text-black">VICTORY!</h2>
            <p className="font-bold mb-8 uppercase text-gray-500">{gameState.message}</p>
            <button onClick={onReset} className="w-full py-4 bg-black text-white font-bold uppercase text-xs tracking-widest rounded-xl hover:scale-105 transition-transform">Restart Arena</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LudoGame;
