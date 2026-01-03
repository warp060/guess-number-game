
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player, PlayerColor, Token } from '../types';
import { COLORS, SHARED_PATH_COORDS, HOME_STRETCH_COORDS, HOME_COORD, SAFE_ZONES, BASE_START_POSITIONS } from '../constants';

interface BoardProps {
  players: Player[];
  onTokenClick: (token: Token) => void;
  activeColor: PlayerColor;
  diceValue: number | null;
  movableTokenIds: number[];
}

const Board: React.FC<BoardProps> = ({ players, onTokenClick, activeColor, diceValue, movableTokenIds }) => {
  const [hoveredToken, setHoveredToken] = useState<Token | null>(null);

  const getPositionCoords = (color: PlayerColor, pos: number): [number, number] => {
    if (pos === -1) return [0, 0];
    if (pos === 57) return HOME_COORD;
    if (pos >= 52) return HOME_STRETCH_COORDS[color][pos - 52];
    
    const startIndex = BASE_START_POSITIONS[color];
    const globalIdx = (pos + startIndex) % 52;
    return SHARED_PATH_COORDS[globalIdx];
  };

  const getPotentialPath = (token: Token): [number, number][] => {
    if (!diceValue) return [];
    const path: [number, number][] = [];
    let currentPos = token.position;
    const steps = diceValue;
    
    if (currentPos === -1) {
      if (diceValue === 6) path.push(getPositionCoords(token.color, 0));
      return path;
    }

    for (let i = 1; i <= steps; i++) {
      const nextStep = currentPos + i;
      if (nextStep <= 57) path.push(getPositionCoords(token.color, nextStep));
    }
    return path;
  };

  const potentialPath = hoveredToken ? getPotentialPath(hoveredToken) : [];

  const tokenGroups: Record<string, Token[]> = {};
  players.forEach(p => {
    p.tokens.forEach(t => {
      if (t.position !== -1 && !t.isAtHome) {
        const [r, c] = getPositionCoords(t.color, t.position);
        const key = `${r}-${c}`;
        if (!tokenGroups[key]) tokenGroups[key] = [];
        tokenGroups[key].push(t);
      }
    });
  });

  const renderBase = (color: PlayerColor, r: number, c: number) => {
    const player = players.find(p => p.color === color);
    const tokensInBase = player?.tokens.filter(t => t.position === -1) || [];
    const playerIsActive = activeColor === color;

    return (
      <div 
        className="absolute w-[40%] h-[40%] p-1 md:p-2 transition-all duration-500"
        style={{ top: `${r * (100/15)}%`, left: `${c * (100/15)}%` }}
      >
        <div 
          className={`w-full h-full rounded-2xl border-4 md:border-8 transition-all duration-500 flex items-center justify-center overflow-hidden ${playerIsActive ? 'border-white shadow-[0_0_40px_rgba(255,255,255,0.3)] scale-100 z-10' : 'border-black/20 opacity-40'}`}
          style={{ backgroundColor: COLORS[color] }}
        >
          <div className="w-full h-full bg-black/20 grid grid-cols-2 grid-rows-2 gap-2 p-4">
            {tokensInBase.map(token => {
              const isMovable = playerIsActive && movableTokenIds.includes(token.id);
              return (
                <motion.div
                  key={`${token.color}-${token.id}`}
                  whileHover={isMovable ? { scale: 1.1 } : {}}
                  onClick={(e) => { e.stopPropagation(); if (isMovable) onTokenClick(token); }}
                  className={`aspect-square rounded-full border-2 md:border-4 flex items-center justify-center relative shadow-lg ${isMovable ? 'cursor-pointer' : 'opacity-40 grayscale pointer-events-none'}`}
                  style={{ backgroundColor: '#fff', borderColor: '#000' }}
                >
                  <div className="w-3/4 h-3/4 rounded-full" style={{ backgroundColor: COLORS[color] }} />
                  {isMovable && (
                    <motion.div 
                      className="absolute -inset-2 border-2 border-white rounded-full"
                      animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              );
            })}
            {[...Array(4 - tokensInBase.length)].map((_, i) => (
              <div key={i} className="aspect-square rounded-full bg-black/10 border border-black/5" />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getCellInfo = (r: number, c: number) => {
    let type: PlayerColor | null = null;
    let isHomeStretch = false;
    for (const [color, coords] of Object.entries(HOME_STRETCH_COORDS)) {
      if (coords.some(coord => coord[0] === r && coord[1] === c)) {
        type = color as PlayerColor;
        isHomeStretch = true;
      }
    }
    const isStart = Object.entries(BASE_START_POSITIONS).some(([col, startIdx]) => {
      const coord = SHARED_PATH_COORDS[startIdx];
      if (coord[0] === r && coord[1] === c) {
        type = col as PlayerColor;
        return true;
      }
      return false;
    });
    return { type, isHomeStretch, isStart };
  };

  return (
    <div className="relative aspect-square w-full max-w-[600px] bg-white p-1 rounded-xl shadow-2xl border-4 border-black/10 overflow-hidden">
      <div className="grid grid-cols-15 grid-rows-15 w-full h-full bg-slate-200">
        {[...Array(225)].map((_, i) => {
          const r = Math.floor(i / 15);
          const c = i % 15;
          const { type, isHomeStretch, isStart } = getCellInfo(r, c);
          const isPath = r === 7 || c === 7 || (r >= 6 && r <= 8) || (c >= 6 && c <= 8);
          const isBase = (r < 6 && c < 6) || (r < 6 && c > 8) || (r > 8 && c < 6) || (r > 8 && c > 8);
          const isCenter = r >= 6 && r <= 8 && c >= 6 && c <= 8 && !isPath;
          
          if (isBase) return <div key={i} className="bg-transparent" />;

          const isSafe = SAFE_ZONES.some(sz => {
            const coord = SHARED_PATH_COORDS[sz];
            return coord[0] === r && coord[1] === c;
          });

          const isDest = potentialPath.some(p => p[0] === r && p[1] === c);

          return (
            <div 
              key={i} 
              className={`border-[1px] border-black/10 flex items-center justify-center relative ${isPath ? 'bg-white' : ''}`}
              style={{ 
                backgroundColor: isStart || isHomeStretch ? `${COLORS[type!]}` : (isSafe ? '#e2e8f0' : (isPath ? '#fff' : 'transparent')),
                boxShadow: isDest ? 'inset 0 0 10px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              {isSafe && !isStart && <i className="fas fa-star text-black/10 text-[10px]"></i>}
              {isDest && <motion.div animate={{ scale: [0.8, 1.1, 0.8] }} transition={{ repeat: Infinity }} className="w-2 h-2 rounded-full bg-black/20" />}
            </div>
          );
        })}
      </div>

      {renderBase('red', 0, 0)}
      {renderBase('green', 0, 9)}
      {renderBase('yellow', 9, 9)}
      {renderBase('blue', 9, 0)}

      {/* Center Triangle Finish */}
      <div className="absolute w-[20%] h-[20%] top-[40%] left-[40%] bg-white border-2 border-black z-20">
        <div className="w-full h-full relative overflow-hidden">
          <div className="absolute inset-0 rotate-45 scale-150" style={{ background: `conic-gradient(${COLORS.red} 0 90deg, ${COLORS.green} 90deg 180deg, ${COLORS.yellow} 180deg 270deg, ${COLORS.blue} 270deg 360deg)` }} />
          <div className="absolute inset-0 flex items-center justify-center font-orbitron font-black text-black text-[10px] drop-shadow-sm uppercase">HOME</div>
        </div>
      </div>

      {/* Tokens */}
      {Object.entries(tokenGroups).map(([key, tokens]) => {
        const [r, c] = key.split('-').map(Number);
        return tokens.map((token, idx) => {
          const isCurrent = activeColor === token.color;
          const isMovable = isCurrent && movableTokenIds.includes(token.id);
          const offset = (idx - (tokens.length - 1) / 2) * 4;

          return (
            <motion.div
              key={`${token.color}-${token.id}`}
              layout
              animate={{ 
                top: `${r * (100/15)}%`, 
                left: `${c * (100/15)}%`,
                x: offset, 
                y: offset,
                scale: isMovable ? 1.1 : 1,
                zIndex: isMovable ? 100 : 50 + idx
              }}
              onClick={() => isMovable && onTokenClick(token)}
              className={`absolute w-[5%] h-[5%] rounded-full border-[2px] shadow-lg flex items-center justify-center transition-all ${isMovable ? 'cursor-pointer ring-2 ring-white ring-offset-1' : 'pointer-events-none'}`}
              style={{ backgroundColor: COLORS[token.color], borderColor: '#fff' }}
            >
              <div className="w-1/2 h-1/2 rounded-full bg-white/30" />
            </motion.div>
          );
        });
      })}
    </div>
  );
};

export default Board;
