
import React from 'react';
import { Player, PlayerColor, Token } from '../types.ts';
import { COLORS, SHARED_PATH_COORDS, HOME_STRETCH_COORDS, HOME_COORD, SAFE_ZONES, BASE_START_POSITIONS } from '../constants.ts';

interface BoardProps {
  players: Player[];
  onTokenClick: (token: Token) => void;
  activeColor: PlayerColor;
  diceValue: number | null;
  movableTokenIds: number[];
}

const Board: React.FC<BoardProps> = ({ players, onTokenClick, activeColor, diceValue, movableTokenIds }) => {
  
  const getPositionCoords = (color: PlayerColor, pos: number): [number, number] => {
    if (pos === -1) return [0, 0];
    if (pos === 57) return HOME_COORD;
    if (pos >= 52) return HOME_STRETCH_COORDS[color][pos - 52];
    const globalIdx = pos % 52;
    return SHARED_PATH_COORDS[globalIdx];
  };

  const renderBase = (color: PlayerColor, top: string, left: string) => {
    const player = players.find(p => p.color === color);
    const tokensInBase = player?.tokens.filter(t => t.position === -1) || [];
    const isActive = activeColor === color;

    return (
      <div 
        className="absolute w-[40%] h-[40%] flex items-center justify-center p-4"
        style={{ top, left, backgroundColor: (COLORS as any)[color] }}
      >
        <div className="w-full h-full bg-white flex flex-wrap p-2 content-center items-center justify-center gap-4">
          {[...Array(4)].map((_, idx) => {
            const token = tokensInBase[idx];
            const isMovable = isActive && token && movableTokenIds.includes(token.id);
            return (
              <div 
                key={idx} 
                className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center"
              >
                {token && (
                  <TokenPawn 
                    color={(COLORS as any)[token.color]} 
                    onClick={() => isMovable && onTokenClick(token)}
                    isMovable={isMovable}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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

  return (
    <div className="relative aspect-square w-full max-w-[650px] bg-white border-[3px] border-black overflow-hidden shadow-lg">
      <div className="grid grid-cols-15 grid-rows-15 w-full h-full">
        {[...Array(225)].map((_, i) => {
          const r = Math.floor(i / 15);
          const c = i % 15;
          const isBase = (r < 6 && c < 6) || (r < 6 && c > 8) || (r > 8 && c < 6) || (r > 8 && c > 8);
          const isCenter = r >= 6 && r <= 8 && c >= 6 && c <= 8;
          
          if (isBase || isCenter) return <div key={i} className="bg-transparent" />;

          let bgColor = 'white';
          let star = false;
          let arrow = null;

          Object.entries(HOME_STRETCH_COORDS).forEach(([color, coords]) => {
            // Fix: Cast coords to [number, number][] to fix 'unknown' type error for .some()
            if ((coords as [number, number][]).some(coord => coord[0] === r && coord[1] === c)) bgColor = (COLORS as any)[color as PlayerColor];
          });

          Object.entries(BASE_START_POSITIONS).forEach(([color, startPos]) => {
            const coord = SHARED_PATH_COORDS[startPos];
            if (coord[0] === r && coord[1] === c) {
              bgColor = (COLORS as any)[color as PlayerColor];
              arrow = color;
            }
          });

          if (SAFE_ZONES.some(idx => SHARED_PATH_COORDS[idx][0] === r && SHARED_PATH_COORDS[idx][1] === c)) {
            star = true;
          }

          return (
            <div key={i} className="cell" style={{ backgroundColor: bgColor }}>
              {star && <i className="fas fa-star text-gray-400 text-sm md:text-xl"></i>}
              {arrow && <i className={`fas fa-arrow-right text-white/50 text-xs ${r === 6 ? '' : r === 0 ? 'rotate-90' : r === 8 ? 'rotate-180' : '-rotate-90'}`}></i>}
            </div>
          );
        })}
      </div>

      {/* Bases */}
      {renderBase('red', '0%', '0%')}
      {renderBase('green', '0%', '60%')}
      {renderBase('yellow', '60%', '60%')}
      {renderBase('blue', '60%', '0%')}

      {/* Center Home */}
      <div className="absolute w-[20%] h-[20%] top-[40%] left-[40%] bg-white border-2 border-black z-10 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="0,0 50,50 100,0" fill={COLORS.green} />
          <polygon points="100,0 50,50 100,100" fill={COLORS.yellow} />
          <polygon points="100,100 50,50 0,100" fill={COLORS.blue} />
          <polygon points="0,100 50,50 0,0" fill={COLORS.red} />
          <text x="50" y="52" textAnchor="middle" fontSize="12" fontWeight="900" fontFamily="sans-serif">HOME</text>
        </svg>
      </div>

      {/* Path Tokens */}
      {Object.entries(tokenGroups).map(([key, tokens]) => {
        const [r, c] = key.split('-').map(Number);
        return (
          <div 
            key={key} 
            className="absolute w-[6.66%] h-[6.66%] z-30 flex items-center justify-center"
            style={{ top: `${r * 6.666}%`, left: `${c * 6.666}%` }}
          >
            {tokens.map((token, idx) => {
              const isActive = activeColor === token.color;
              const isMovable = isActive && movableTokenIds.includes(token.id);
              const offset = (idx - (tokens.length - 1) / 2) * 6;
              return (
                <div 
                  key={token.id}
                  className="absolute"
                  style={{ transform: `translateX(${offset}px)` }}
                >
                  <TokenPawn 
                    color={(COLORS as any)[token.color]} 
                    onClick={() => isMovable && onTokenClick(token)}
                    isMovable={isMovable}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const TokenPawn: React.FC<{ color: string, onClick: () => void, isMovable: boolean }> = ({ color, onClick, isMovable }) => (
  <div 
    onClick={onClick}
    className={`w-6 h-6 md:w-9 md:h-9 flex items-center justify-center transition-transform ${isMovable ? 'cursor-pointer hover:scale-110' : ''}`}
  >
    <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-sm">
      <path 
        d="M50,140 C20,140 10,110 10,80 C10,50 30,10 50,10 C70,10 90,50 90,80 C90,110 80,140 50,140 Z" 
        fill={color} 
        stroke="white" 
        strokeWidth="6"
      />
      <circle cx="50" cy="50" r="15" fill="rgba(255,255,255,0.3)" />
    </svg>
    {isMovable && (
      <div className="absolute -inset-1 border-2 border-black/10 rounded-full animate-ping pointer-events-none" />
    )}
  </div>
);

export default Board;
