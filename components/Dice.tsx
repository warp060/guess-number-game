
import React from 'react';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  onClick: () => void;
  disabled: boolean;
  color: string;
}

const Dice: React.FC<DiceProps> = ({ value, isRolling, onClick, disabled }) => {
  const getDots = (val: number) => {
    const dot = <circle r="8" fill="black" />;
    switch (val) {
      case 1: return <g transform="translate(50,50)">{dot}</g>;
      // Fix: Using fragment to return multiple SVG elements instead of the comma operator which results in unused expression
      case 2: return <><g transform="translate(25,25)">{dot}</g><g transform="translate(75,75)">{dot}</g></>;
      case 3: return <><g transform="translate(20,20)">{dot}</g><g transform="translate(50,50)">{dot}</g><g transform="translate(80,80)">{dot}</g></>;
      case 4: return <><g transform="translate(25,25)">{dot}</g><g transform="translate(75,25)">{dot}</g><g transform="translate(25,75)">{dot}</g><g transform="translate(75,75)">{dot}</g></>;
      case 5: return <><g transform="translate(20,20)">{dot}</g><g transform="translate(80,20)">{dot}</g><g transform="translate(50,50)">{dot}</g><g transform="translate(20,80)">{dot}</g><g transform="translate(80,80)">{dot}</g></>;
      case 6: return <><g transform="translate(30,20)">{dot}</g><g transform="translate(70,20)">{dot}</g><g transform="translate(30,50)">{dot}</g><g transform="translate(70,50)">{dot}</g><g transform="translate(30,80)">{dot}</g><g transform="translate(70,80)">{dot}</g></>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        onClick={!disabled ? onClick : undefined}
        className={`w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-black/10 rounded-xl flex items-center justify-center shadow-md transition-all ${disabled ? 'opacity-30 grayscale' : 'cursor-pointer active:scale-95'}`}
      >
        {isRolling ? (
          <div className="animate-spin text-2xl text-gray-300">
            <i className="fas fa-dice"></i>
          </div>
        ) : (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
            {value && getDots(value)}
          </svg>
        )}
      </div>
      {!disabled && !isRolling && !value && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tap to Roll</span>
      )}
    </div>
  );
};

export default Dice;
