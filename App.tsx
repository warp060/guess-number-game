
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GuessGame from './components/GuessGame';
import LudoGame from './components/LudoGame';
import LudoSetup from './components/LudoSetup';
import { GamePhase, PlayerColor } from './types';

interface SlotConfig {
  color: PlayerColor;
  type: 'HUMAN' | 'AI' | 'CLOSED';
  avatar: string;
}

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('GUESS');
  const [unlocked, setUnlocked] = useState(false);
  const [ludoConfig, setLudoConfig] = useState<SlotConfig[] | null>(null);

  const handleGuessWin = () => {
    setUnlocked(true);
    setTimeout(() => {
      setPhase('LUDO_SETUP');
    }, 2000);
  };

  const handleStartLudo = (configs: SlotConfig[]) => {
    setLudoConfig(configs);
    setPhase('LUDO_PLAY');
  };

  const resetAll = () => {
    setPhase('GUESS');
    setUnlocked(false);
    setLudoConfig(null);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Video Simulator */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20 grayscale-[0.8] blur-sm"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-background-of-moving-blue-and-purple-dots-34411-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl px-4 py-8">
        <header className="text-center mb-8">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-orbitron font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 neon-text-blue"
          >
            NEON ARENA
          </motion.h1>
          <p className="text-blue-300/40 font-medium tracking-widest uppercase text-[10px] mt-2 font-orbitron">
            Multi-Operative Board Simulation
          </p>
        </header>

        <AnimatePresence mode="wait">
          {phase === 'GUESS' && (
            <motion.div
              key="guess"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <GuessGame onWin={handleGuessWin} />
            </motion.div>
          )}

          {phase === 'LUDO_SETUP' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex justify-center"
            >
              <LudoSetup onStart={handleStartLudo} onBack={resetAll} />
            </motion.div>
          )}

          {phase === 'LUDO_PLAY' && ludoConfig && (
            <motion.div
              key="ludo"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <LudoGame 
                playerConfigs={ludoConfig}
                onReset={resetAll}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Unlock Notification */}
      <AnimatePresence>
        {unlocked && phase === 'GUESS' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 glass border-pink-500/50 p-6 rounded-2xl flex flex-col items-center gap-2 z-50 shadow-[0_0_30px_rgba(236,72,153,0.3)]"
          >
            <div className="text-pink-400 text-3xl mb-2">
              <i className="fas fa-unlock-alt animate-bounce"></i>
            </div>
            <h2 className="text-2xl font-orbitron font-bold text-white uppercase tracking-tighter">
              Arena Unlocked!
            </h2>
            <p className="text-pink-200/80 text-[10px] font-orbitron tracking-widest uppercase">Protocol Initializing...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
