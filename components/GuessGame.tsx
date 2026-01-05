
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;
const MotionP = motion.p as any;
const MotionButton = motion.button as any;
const MotionSpan = motion.span as any;

interface GuessGameProps {
  onWin: () => void;
}

const GuessGame: React.FC<GuessGameProps> = ({ onWin }) => {
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState<number[]>([]);
  const [message, setMessage] = useState('NEURAL LINK ESTABLISHED. ENTER A NUMBER BETWEEN 1 TO 10.');
  const [status, setStatus] = useState<'playing' | 'won' | 'lost' | 'scanning'>('playing');
  const [attempts, setAttempts] = useState(7);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setTarget(Math.floor(Math.random() * 10) + 1);
    setGuesses([]);
    setAttempts(7);
    setMessage('ACCESS TERMINAL READY. ENTER A NUMBER BETWEEN 1 TO 10.');
    setStatus('playing');
    setGuess('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'playing' || !guess) return;

    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > 10) {
      setMessage('ERROR: YOU MUST ENTER A NUMBER BETWEEN 1 TO 10.');
      return;
    }

    if (guesses.includes(num)) {
      setMessage('FREQUENCY PREVIOUSLY SCANNED.');
      return;
    }

    setStatus('scanning');
    setMessage('ANALYZING SIGNAL PATH...');

    setTimeout(() => {
      const newGuesses = [num, ...guesses];
      setGuesses(newGuesses);
      setGuess('');

      if (num === target) {
        setMessage('CORE BREACHED! ENCRYPTION CRACKED. 🎉');
        setStatus('won');
        onWin();
      } else {
        const remaining = attempts - 1;
        setAttempts(remaining);

        if (remaining === 0) {
          setMessage(`LINK SEVERED. TARGET FREQUENCY WAS ${target}.`);
          setStatus('lost');
        } else {
          setStatus('playing');
          setMessage(num > target ? 'SIGNAL FREQUENCY: TOO HIGH 🔺' : 'SIGNAL FREQUENCY: TOO LOW 🔻');
        }
      }
    }, 800);
  };

  return (
    <div className="w-full max-w-md relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      
      <div className="relative glass p-8 rounded-[2.5rem] border border-blue-500/30 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>

        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-orbitron text-cyan-400 uppercase tracking-[0.3em] font-bold">GUESS NUMBER</span>
            <span className="text-[8px] text-cyan-400/50 uppercase font-orbitron tracking-widest mt-1">Status: Active_Link</span>
          </div>
          <div className="flex gap-1.5">
            {[...Array(7)].map((_, i) => (
              <MotionDiv 
                key={i} 
                initial={false}
                animate={{
                  height: i < attempts ? [16, 20, 16] : 16,
                  backgroundColor: i < attempts ? '#00d4ff' : 'rgba(255,255,255,0.05)',
                  boxShadow: i < attempts ? '0 0 12px #00d4ff' : 'none'
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                className="w-2.5 rounded-full"
              />
            ))}
          </div>
        </div>

        <div className="mb-10 text-center h-20 flex items-center justify-center relative z-10 px-4">
          <AnimatePresence mode="wait">
            <MotionP
              key={message}
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              className={`text-sm md:text-base font-orbitron font-bold tracking-widest leading-relaxed ${
                status === 'won' ? 'text-green-400 drop-shadow-[0_0_8px_#4ade80]' : 
                status === 'lost' ? 'text-pink-600 drop-shadow-[0_0_8px_#db2777]' : 
                'text-cyan-300'
              }`}
            >
              {message}
            </MotionP>
          </AnimatePresence>
        </div>

        <div className="mb-8 relative z-10">
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
            <MotionDiv 
              className="h-full bg-gradient-to-r from-cyan-600 to-blue-400"
              initial={{ width: '100%' }}
              animate={{ width: `${(attempts / 7) * 100}%` }}
              style={{ boxShadow: '0 0 15px #00d4ff' }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-[8px] text-cyan-400/50 uppercase font-orbitron tracking-tighter">Signal Integrity</p>
            <p className="text-[8px] text-cyan-400/50 uppercase font-orbitron tracking-tighter">{Math.round((attempts/7)*100)}%</p>
          </div>
        </div>

        <form onSubmit={handleGuess} className="space-y-6 relative z-10">
          <div className="relative">
            <input
              ref={inputRef}
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={status !== 'playing'}
              placeholder="--"
              min="1"
              max="10"
              className={`w-full bg-black/60 border-2 rounded-2xl py-8 text-center text-5xl font-orbitron text-white outline-none transition-all placeholder:opacity-10 ${
                status === 'scanning' ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-cyan-500/30 focus:border-cyan-400 shadow-[inset_0_0_20px_rgba(0,212,255,0.1)]'
              }`}
            />
            {status === 'scanning' && (
              <MotionDiv 
                layoutId="scanning-bar"
                className="absolute left-0 right-0 h-1 bg-cyan-400 z-20"
                animate={{ top: ['10%', '90%', '10%'] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                style={{ boxShadow: '0 0 15px #00d4ff' }}
              />
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {status === 'playing' ? (
              <MotionButton
                key="btn-process"
                type="submit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl font-orbitron font-bold text-lg uppercase tracking-[0.3em] hover:brightness-125 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] border border-cyan-400/50"
              >
                Inject Pulse
              </MotionButton>
            ) : status === 'scanning' ? (
              <MotionDiv
                key="btn-scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full py-5 bg-yellow-500/10 border border-yellow-500/50 rounded-2xl text-yellow-400 font-orbitron font-bold text-center tracking-widest animate-pulse"
              >
                SCANNING...
              </MotionDiv>
            ) : status === 'lost' ? (
              <MotionButton
                key="btn-retry"
                type="button"
                onClick={resetGame}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full py-5 bg-pink-600/20 border border-pink-500 rounded-2xl font-orbitron font-bold text-lg uppercase tracking-[0.3em] hover:bg-pink-600/30 transition-all text-pink-400"
              >
                Retry Link
              </MotionButton>
            ) : (
              <MotionDiv 
                key="btn-won"
                className="w-full py-5 text-center text-green-400 font-orbitron font-bold tracking-[0.4em] animate-bounce"
              >
                UNLOCKED
              </MotionDiv>
            )}
          </AnimatePresence>
        </form>

        <div className="mt-10 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-[1px] flex-1 bg-cyan-500/20"></div>
            <p className="text-[10px] text-cyan-400/40 uppercase font-orbitron tracking-widest">Attempt Logs</p>
            <div className="h-[1px] flex-1 bg-cyan-500/20"></div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center min-h-[44px]">
            {guesses.length === 0 && <span className="text-[10px] text-white/10 italic font-orbitron uppercase py-3">No data recorded...</span>}
            {guesses.map((g, idx) => (
              <MotionSpan
                initial={{ scale: 0, opacity: 0, rotateY: 90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                key={idx}
                className={`w-10 h-10 flex items-center justify-center rounded-xl border-2 text-xs font-orbitron font-bold ${
                  g === target ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-black/40 border-cyan-500/20 text-cyan-200/60'
                }`}
              >
                {g}
              </MotionSpan>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuessGame;
