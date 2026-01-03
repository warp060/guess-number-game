
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerColor } from '../types';
import { COLORS } from '../constants';

type PlayerType = 'HUMAN' | 'AI' | 'CLOSED';

interface SlotConfig {
  color: PlayerColor;
  type: PlayerType;
  avatar: string;
}

interface LudoSetupProps {
  onStart: (configs: SlotConfig[]) => void;
  onBack: () => void;
}

const LudoSetup: React.FC<LudoSetupProps> = ({ onStart, onBack }) => {
  const [slots, setSlots] = useState<SlotConfig[]>([
    { color: 'red', type: 'HUMAN', avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=red&backgroundColor=b6e3f4` },
    { color: 'blue', type: 'AI', avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=blue&backgroundColor=c0aede` },
    { color: 'yellow', type: 'AI', avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=yellow&backgroundColor=d1d4f9` },
    { color: 'green', type: 'AI', avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=green&backgroundColor=ffd5dc` },
  ]);

  const toggleSlot = (index: number) => {
    const newSlots = [...slots];
    const current = newSlots[index].type;
    if (current === 'HUMAN') newSlots[index].type = 'AI';
    else if (current === 'AI') newSlots[index].type = 'CLOSED';
    else newSlots[index].type = 'HUMAN';
    setSlots(newSlots);
  };

  const randomizeAvatar = (index: number) => {
    const newSlots = [...slots];
    newSlots[index].avatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${Math.random()}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
    setSlots(newSlots);
  };

  const activePlayersCount = slots.filter(s => s.type !== 'CLOSED').length;
  const canStart = activePlayersCount >= 2;

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-6xl min-h-[700px] overflow-hidden rounded-[3rem] shadow-[0_0_100px_rgba(255,255,255,0.1)] bg-black border border-white/10">
      
      {/* Sidebar - Control Deck */}
      <div className="w-full lg:w-64 bg-white flex flex-col p-10 space-y-8">
        <div className="flex flex-col items-center gap-4">
           <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-xl">
              <i className="fas fa-gamepad text-white text-2xl"></i>
           </div>
           <span className="font-orbitron text-black text-xl tracking-[0.2em] font-bold">SETUP</span>
        </div>
        
        <div className="space-y-6 pt-10 border-t border-black/10">
          <div className="space-y-2">
            <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Active Players</p>
            <p className="text-2xl font-orbitron text-black font-bold">{activePlayersCount} / 4</p>
          </div>
          <p className="text-[11px] leading-relaxed text-black/60 font-medium">
            Configure each sector. You need at least 2 active players to initiate the Arena.
          </p>
        </div>

        <div className="mt-auto space-y-4">
          <button 
            disabled={!canStart}
            onClick={() => onStart(slots)}
            className={`w-full py-6 rounded-2xl font-orbitron font-bold text-xs tracking-[0.3em] uppercase transition-all shadow-xl ${canStart ? 'bg-black text-white hover:bg-black/80' : 'bg-black/10 text-black/20 cursor-not-allowed'}`}
          >
            Start Game
          </button>
          <button onClick={onBack} className="w-full py-4 text-black/40 font-orbitron font-bold text-[10px] tracking-widest uppercase hover:text-black transition-colors">Abort</button>
        </div>
      </div>

      {/* Player Grid Area */}
      <div className="flex-1 p-10 lg:p-16 grid grid-cols-1 md:grid-cols-2 gap-8 bg-black relative">
        {/* Subtle Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <span className="text-[20vw] font-orbitron font-bold uppercase tracking-tighter">ARENA</span>
        </div>

        {slots.map((slot, index) => (
          <motion.div 
            key={slot.color}
            whileHover={{ scale: 1.02 }}
            className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col items-center gap-6 ${slot.type === 'CLOSED' ? 'border-white/5 opacity-40 grayscale' : 'border-white/20 bg-white/5 shadow-2xl'}`}
          >
            {/* Slot Header */}
            <div className="flex items-center justify-between w-full">
              <span className="font-orbitron text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: COLORS[slot.color] }}>
                {slot.color} Sector
              </span>
              <button 
                onClick={() => toggleSlot(index)}
                className={`px-4 py-1.5 rounded-full font-orbitron text-[9px] font-bold tracking-widest border transition-all ${slot.type === 'HUMAN' ? 'bg-white text-black border-white' : slot.type === 'AI' ? 'bg-transparent text-white border-white/40' : 'bg-white/5 text-white/20 border-white/5'}`}
              >
                {slot.type}
              </button>
            </div>

            {/* Avatar Selection */}
            <div className="relative">
               <div className={`w-32 h-32 rounded-3xl border-4 overflow-hidden transition-all duration-500 ${slot.type === 'CLOSED' ? 'border-white/5' : 'border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]'}`}>
                  <img src={slot.avatar} alt="Avatar" className="w-full h-full object-cover" />
               </div>
               {slot.type !== 'CLOSED' && (
                 <button 
                   onClick={() => randomizeAvatar(index)}
                   className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-black rounded-xl border-2 border-black flex items-center justify-center shadow-lg hover:scale-110 active:rotate-180 transition-all"
                 >
                   <i className="fas fa-sync-alt text-xs"></i>
                 </button>
               )}
            </div>

            {slot.type === 'CLOSED' ? (
              <p className="text-[11px] font-orbitron text-white/20 uppercase tracking-widest">Sector Inactive</p>
            ) : (
              <div className="w-full space-y-3">
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-white" 
                      initial={{ width: 0 }} 
                      animate={{ width: '100%' }} 
                      transition={{ duration: 1 }}
                    />
                 </div>
                 <p className="text-center text-[9px] font-orbitron text-white/40 uppercase tracking-widest">Neural Link Sync Complete</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LudoSetup;
