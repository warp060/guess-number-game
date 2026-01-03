
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dice from './Dice';
import Board from './Board';
import { GameState, Player, PlayerColor, Token } from '../types';
import { COLORS, INITIAL_TOKENS, SAFE_ZONES, BASE_START_POSITIONS } from '../constants';

const SOUNDS = {
  roll: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  move: 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3',
  capture: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
};

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
      message: players[firstIdx].isHuman ? 'TAP DICE TO ROLL' : `${players[firstIdx].color.toUpperCase()}'S TURN`,
      gameStatus: 'IDLE',
    };
  });

  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.volume = 0.4;
      audioRefs.current[key] = audio;
    });
  }, []);

  const playSound = (sound: keyof typeof SOUNDS) => {
    const audio = audioRefs.current[sound];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

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
      const nextP = prev.players[nextIdx];
      return {
        ...prev,
        currentPlayerIndex: nextIdx,
        diceValue: null,
        gameStatus: 'IDLE',
        message: nextP.isHuman ? 'TAP DICE TO ROLL' : `${nextP.color.toUpperCase()}'S TURN`,
      };
    });
  }, []);

  const handleRollDice = () => {
    if (gameState.gameStatus !== 'IDLE' || gameState.isRolling) return;

    playSound('roll');
    setGameState(prev => ({ ...prev, isRolling: true, gameStatus: 'ROLLING', message: 'ROLLING...' }));

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setGameState(prev => {
        const moves = prev.players[prev.currentPlayerIndex].tokens.filter(t => canMoveToken(t, roll));
        if (moves.length === 0) {
          setTimeout(nextTurn, 1000);
          return { ...prev, diceValue: roll, isRolling: false, gameStatus: 'WAITING_FOR_MOVE', message: 'NO MOVES POSSIBLE' };
        }
        return { 
          ...prev, 
          diceValue: roll, 
          isRolling: false, 
          gameStatus: 'WAITING_FOR_MOVE', 
          message: prev.players[prev.currentPlayerIndex].isHuman ? 'SELECT YOUR TOKEN' : 'AI CALCULATING...' 
        };
      });
    }, 800);
  };

  const handleTokenClick = (token: Token) => {
    if (gameState.gameStatus !== 'WAITING_FOR_MOVE' || !gameState.diceValue) return;
    if (token.color !== currentPlayer.color) return;
    
    const roll = gameState.diceValue;
    if (!canMoveToken(token, roll)) return;

    playSound('move');
    let newPos = token.position === -1 ? 0 : token.position + roll;

    setGameState(prev => {
      let captured = false;
      const startIdx = BASE_START_POSITIONS[token.color];
      const globalIdx = newPos < 52 ? (newPos + startIdx) % 52 : -1;
      const isSafe = newPos < 52 && SAFE_ZONES.includes(newPos);

      const updatedPlayers = prev.players.map(p => {
        if (p.color === token.color) {
          const updatedTokens = p.tokens.map(t => t.id === token.id ? { ...t, position: newPos, isAtHome: newPos === 57 } : t);
          return { ...p, tokens: updatedTokens, hasFinished: updatedTokens.every(ut => ut.isAtHome) };
        }
        if (globalIdx !== -1 && !isSafe) {
          const updatedOpponentTokens = p.tokens.map(t => {
            if (t.position === -1 || t.isAtHome || t.position >= 52) return t;
            const oppStart = BASE_START_POSITIONS[p.color];
            const oppGlobal = (t.position + oppStart) % 52;
            if (oppGlobal === globalIdx) { captured = true; return { ...t, position: -1 }; }
            return t;
          });
          if (captured) return { ...p, tokens: updatedOpponentTokens };
        }
        return p;
      });

      if (captured) playSound('capture');
      if (updatedPlayers[prev.currentPlayerIndex].hasFinished) {
        playSound('win');
        return { ...prev, players: updatedPlayers, gameStatus: 'FINISHED', message: `${token.color.toUpperCase()} WINS!` };
      }
      return { ...prev, players: updatedPlayers, gameStatus: roll === 6 ? 'IDLE' : 'IDLE', message: roll === 6 ? 'SIX! ROLL AGAIN' : prev.message };
    });

    if (roll !== 6) nextTurn();
  };

  useEffect(() => {
    if (!currentPlayer.isHuman && gameState.gameStatus === 'IDLE') {
      const timer = setTimeout(handleRollDice, 1200);
      return () => clearTimeout(timer);
    }
    if (!currentPlayer.isHuman && gameState.gameStatus === 'WAITING_FOR_MOVE') {
      const timer = setTimeout(() => {
        const moves = currentPlayer.tokens.filter(t => canMoveToken(t, gameState.diceValue!));
        if (moves.length > 0) handleTokenClick(moves[Math.floor(Math.random() * moves.length)]);
        else nextTurn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayerIndex, gameState.gameStatus, currentPlayer.isHuman, gameState.diceValue]);

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-6xl rounded-[2rem] overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
      <div className="w-full lg:w-64 bg-slate-800 p-8 flex flex-col border-r border-white/5">
        <div className="flex flex-col items-center gap-4 mb-8">
           <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-microchip text-slate-800 text-xl"></i>
           </div>
           <h3 className="font-orbitron font-bold text-xs tracking-widest text-white opacity-50 uppercase">Arena Control</h3>
        </div>
        <div className="flex flex-col gap-3">
          {gameState.players.filter(p => p.isActive).map((p, idx) => {
            const isTurn = p.color === currentPlayer.color;
            return (
              <motion.div 
                key={p.color} 
                animate={isTurn ? { scale: 1.05, opacity: 1 } : { scale: 1, opacity: 0.4 }}
                className={`flex items-center gap-3 p-3 rounded-xl border ${isTurn ? 'bg-white/10 border-white' : 'border-white/5 bg-transparent'}`}
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-black border border-white/20">
                  <img src={p.avatarUrl} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-orbitron text-[9px] font-bold text-white uppercase">{p.color}</span>
                  <span className="text-[7px] text-white/40 uppercase font-bold">{p.isHuman ? 'User' : 'AI'}</span>
                </div>
                {isTurn && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </motion.div>
            );
          })}
        </div>
        <div className="mt-auto pt-6">
           <button onClick={onReset} className="w-full py-4 text-[9px] font-orbitron font-bold border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors uppercase tracking-widest">Quit Game</button>
        </div>
      </div>

      <div className="flex-1 p-6 lg:p-12 flex flex-col items-center justify-center bg-[#020617] relative">
        <div className="relative z-10 flex flex-col items-center gap-8 w-full">
          <Board 
            players={gameState.players.filter(p => p.isActive)} 
            onTokenClick={handleTokenClick} 
            activeColor={currentPlayer.color}
            diceValue={gameState.diceValue}
            movableTokenIds={gameState.diceValue ? currentPlayer.tokens.filter(t => canMoveToken(t, gameState.diceValue!)).map(t => t.id) : []}
          />

          <div className="flex flex-col items-center gap-6 w-full">
            <div className="bg-white text-black px-10 py-4 rounded-full shadow-xl">
               <p className="font-orbitron font-black text-[10px] tracking-[0.3em] uppercase text-center">{gameState.message}</p>
            </div>
            <div className={currentPlayer.isHuman && gameState.gameStatus === 'IDLE' ? 'scale-110' : 'scale-90 opacity-40 grayscale'}>
              <Dice value={gameState.diceValue} isRolling={gameState.isRolling} onClick={handleRollDice} disabled={!currentPlayer.isHuman || gameState.gameStatus !== 'IDLE'} color={COLORS[currentPlayer.color]} />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {gameState.gameStatus === 'FINISHED' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-8 backdrop-blur-md">
            <div className="bg-white p-12 rounded-[3rem] text-center shadow-2xl max-w-sm w-full border-8 border-slate-900">
               <div className="w-32 h-32 mx-auto mb-6 rounded-3xl overflow-hidden border-4 border-slate-900">
                 <img src={gameState.players.find(p => p.hasFinished)?.avatarUrl} className="w-full h-full object-cover" />
               </div>
               <h2 className="text-4xl font-orbitron font-black text-slate-900 mb-2 uppercase">VICTORY</h2>
               <p className="font-orbitron text-xs text-slate-500 mb-10 tracking-widest uppercase">{gameState.players.find(p => p.hasFinished)?.color} Secured The Arena</p>
               <button onClick={onReset} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-orbitron font-bold text-xs tracking-widest uppercase hover:scale-105 transition-transform">Back to Core</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LudoGame;
