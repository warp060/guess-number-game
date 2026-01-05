
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GuessGame from './components/GuessGame.tsx';
import SnakeGame from './components/SnakeGame.tsx';
import { GamePhase } from './types.ts';

const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('GUESS');
  const [unlocked, setUnlocked] = useState(false);

  const handleGuessWin = () => {
    setUnlocked(true);
    // Wait for the "UNLOCKED" animation to finish before switching phase
    setTimeout(() => {
      setPhase('SNAKE');
      setUnlocked(false);
    }, 2500);
  };

  const resetAll = () => {
    setPhase('GUESS');
    setUnlocked(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0c0032]">
      {/* Dynamic Cyberpunk Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0c0032] opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent animate-pulse" />
        {/* Decorative Grid */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl px-4 py-8 flex-1 flex flex-col justify-center items-center">
        {phase === 'GUESS' && !unlocked && (
          <header className="text-center mb-12">
            <MotionDiv
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4"
            >
              <span className="text-[10px] font-orbitron font-bold text-cyan-400 tracking-[0.5em] uppercase text-xs">
                NEURAL PROTOCOL ACTIVE
              </span>
            </MotionDiv>
            
            <MotionH1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-5xl md:text-8xl font-orbitron font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            >
              NEON ARENA
            </MotionH1>
            <p className="mt-4 text-cyan-400/60 font-orbitron text-xs tracking-[0.5em] uppercase">Crack the sequence to enter the grid</p>
          </header>
        )}

        <AnimatePresence mode="wait">
          {phase === 'GUESS' && (
            <MotionDiv
              key="guess"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full flex justify-center"
            >
              <GuessGame onWin={handleGuessWin} />
            </MotionDiv>
          )}

          {phase === 'SNAKE' && (
            <MotionDiv
              key="snake"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex justify-center"
            >
              <SnakeGame onBack={resetAll} />
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>

      <footer className="relative z-20 w-full py-4 px-10 flex justify-between items-center bg-black/40 backdrop-blur-md border-t border-white/5">
        <span className="text-[9px] font-orbitron text-white/30 uppercase tracking-widest font-bold">Encrypted Link Active</span>
        <span className="text-[9px] font-orbitron text-white/30 uppercase tracking-widest font-bold">Protocol v2.1.0</span>
      </footer>

      {/* Unlock Overlay */}
      <AnimatePresence>
        {unlocked && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-cyan-950/40 backdrop-blur-2xl flex items-center justify-center"
          >
            <MotionDiv
              initial={{ scale: 0.5, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              className="glass p-12 rounded-[3rem] border-cyan-400/50 flex flex-col items-center gap-8 shadow-[0_0_150px_rgba(0,212,255,0.3)]"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-20 animate-pulse" />
                <i className="fas fa-microchip text-7xl text-cyan-400 animate-bounce"></i>
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-5xl font-orbitron font-bold text-white uppercase tracking-widest">Core Breached</h2>
                <p className="text-cyan-400 font-orbitron text-sm tracking-widest">INITIALIZING GRID SIMULATION...</p>
              </div>
              <div className="h-1.5 w-64 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="h-full bg-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  style={{ boxShadow: '0 0 20px #22d3ee' }}
                />
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
