
import React from 'react';
import { motion } from 'framer-motion';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  onClick: () => void;
  disabled: boolean;
  color: string;
}

const Dice: React.FC<DiceProps> = ({ value, isRolling, onClick, disabled, color }) => {
  const getDots = (val: number) => {
    switch (val) {
      case 1: return <circle cx="50" cy="50" r="10" fill="white" />;
      case 2: return <><circle cx="30" cy="30" r="10" fill="white" /><circle cx="70" cy="70" r="10" fill="white" /></>;
      case 3: return <><circle cx="25" cy="25" r="9" fill="white" /><circle cx="50" cy="50" r="9" fill="white" /><circle cx="75" cy="75" r="9" fill="white" /></>;
      case 4: return <><circle cx="30" cy="30" r="9" fill="white" /><circle cx="70" cy="30" r="9" fill="white" /><circle cx="30" cy="70" r="9" fill="white" /><circle cx="70" cy="70" r="9" fill="white" /></>;
      case 5: return <><circle cx="25" cy="25" r="8" fill="white" /><circle cx="75" cy="25" r="8" fill="white" /><circle cx="50" cy="50" r="8" fill="white" /><circle cx="25" cy="75" r="8" fill="white" /><circle cx="75" cy="75" r="8" fill="white" /></>;
      case 6: return <><circle cx="30" cy="25" r="8" fill="white" /><circle cx="70" cy="25" r="8" fill="white" /><circle cx="30" cy="50" r="8" fill="white" /><circle cx="70" cy="50" r="8" fill="white" /><circle cx="30" cy="75" r="8" fill="white" /><circle cx="70" cy="75" r="8" fill="white" /></>;
      default: return null;
    }
  };

  return (
    <div className="relative group">
      {!disabled && !isRolling && (
        <motion.div 
          animate={{ y: [0, -5, 0], opacity: [1, 0.7, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-orbitron font-black px-4 py-2 rounded-full whitespace-nowrap shadow-xl z-50 uppercase tracking-[0.2em]"
        >
          Tap to Roll
        </motion.div>
      )}
      <motion.div
        animate={isRolling ? { rotate: [0, 180, -180, 360, 0], scale: [1, 1.2, 0.9, 1.1, 1] } : { rotate: 0, scale: 1 }}
        transition={isRolling ? { duration: 0.6, repeat: Infinity } : { type: "spring", stiffness: 200 }}
        className={`w-16 h-16 md:w-20 md:h-20 rounded-xl cursor-pointer flex items-center justify-center shadow-2xl transition-all border-4 border-white ${disabled ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:brightness-110 active:scale-95'}`}
        style={{ backgroundColor: color }}
        onClick={!disabled ? onClick : undefined}
      >
        {value && !isRolling ? (
          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} viewBox="0 0 100 100" className="w-full h-full p-3">{getDots(value)}</motion.svg>
        ) : (
          <i className="fas fa-dice text-2xl text-white/40"></i>
        )}
      </motion.div>
    </div>
  );
};

export default Dice;
