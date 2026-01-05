
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Point, Direction } from '../types.ts';

const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 150;

interface SnakeGameProps {
  onBack: () => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('snakeHighScore') || '0'));
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snakeHighScore', newScore.toString());
          }
          // Speed up every 50 points
          if (newScore % 50 === 0) setSpeed(prev => Math.max(prev - 10, 60));
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, isGameOver, isPaused, generateFood, highScore]);

  // Handle key presses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== 'DOWN') directionRef.current = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== 'UP') directionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Game loop
  useEffect(() => {
    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [moveSnake, speed]);

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#0c0032';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Subtle)
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Draw Food (Core)
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#f472b6';
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(
      food.x * size + size / 2,
      food.y * size + size / 2,
      size / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw Snake
    snake.forEach((part, index) => {
      const isHead = index === 0;
      ctx.shadowBlur = isHead ? 20 : 10;
      ctx.shadowColor = '#22d3ee';
      
      // Gradient for tail effect
      const alpha = 1 - (index / snake.length) * 0.7;
      ctx.fillStyle = isHead ? '#22d3ee' : `rgba(6, 182, 212, ${alpha})`;
      
      const padding = 2;
      ctx.fillRect(
        part.x * size + padding,
        part.y * size + padding,
        size - padding * 2,
        size - padding * 2
      );

      // Add "eye" to head
      if (isHead) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#0c0032';
        ctx.fillRect(part.x * size + size/2 - 2, part.y * size + size/2 - 2, 4, 4);
      }
    });

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* HUD */}
      <div className="w-full max-w-[500px] flex justify-between items-end glass p-6 rounded-3xl border border-cyan-500/30">
        <div className="flex flex-col">
          <span className="text-[10px] font-orbitron text-cyan-400/50 uppercase tracking-widest font-bold">Data Harvested</span>
          <span className="text-4xl font-orbitron font-bold text-white drop-shadow-[0_0_8px_#fff]">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-orbitron text-purple-400/50 uppercase tracking-widest font-bold">Top System Sync</span>
          <span className="text-xl font-orbitron font-bold text-purple-400">{highScore}</span>
        </div>
      </div>

      <div className="relative group">
        {/* Glow behind canvas */}
        <div className="absolute -inset-1 bg-cyan-500 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
        
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="relative glass rounded-2xl border-2 border-cyan-500/40 shadow-2xl max-w-full aspect-square"
        />

        {/* Game Over Overlay */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-8 z-20"
            >
              {isGameOver ? (
                <>
                  <i className="fas fa-skull text-6xl text-pink-600 mb-4 animate-bounce"></i>
                  <h2 className="text-4xl font-orbitron font-bold text-white mb-2 uppercase tracking-tighter">System Failure</h2>
                  <p className="text-pink-400 font-orbitron text-sm mb-8 tracking-widest">SIGNAL CONNECTION TERMINATED</p>
                  <MotionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetGame}
                    className="w-full max-w-[200px] py-4 bg-cyan-600 text-white font-orbitron font-bold uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.5)] border border-cyan-400"
                  >
                    Reboot
                  </MotionButton>
                </>
              ) : (
                <>
                  <i className="fas fa-pause text-6xl text-cyan-400 mb-4"></i>
                  <h2 className="text-4xl font-orbitron font-bold text-white mb-8 uppercase tracking-widest">Simulation Paused</h2>
                  <MotionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPaused(false)}
                    className="w-full max-w-[200px] py-4 bg-cyan-600 text-white font-orbitron font-bold uppercase tracking-widest rounded-xl"
                  >
                    Resume
                  </MotionButton>
                </>
              )}
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Controls / Help */}
      <div className="w-full max-w-[500px] flex flex-col items-center gap-6">
        <div className="flex gap-4">
           <div className="grid grid-cols-3 gap-2">
              <div />
              <MotionButton 
                onMouseDown={() => { if(directionRef.current !== 'DOWN') directionRef.current = 'UP'; }}
                className="w-14 h-14 glass rounded-xl flex items-center justify-center text-cyan-400 text-xl border border-cyan-500/30 active:bg-cyan-500/20"
              >
                <i className="fas fa-chevron-up"></i>
              </MotionButton>
              <div />
              <MotionButton 
                onMouseDown={() => { if(directionRef.current !== 'RIGHT') directionRef.current = 'LEFT'; }}
                className="w-14 h-14 glass rounded-xl flex items-center justify-center text-cyan-400 text-xl border border-cyan-500/30 active:bg-cyan-500/20"
              >
                <i className="fas fa-chevron-left"></i>
              </MotionButton>
              <MotionButton 
                onMouseDown={() => { if(directionRef.current !== 'UP') directionRef.current = 'DOWN'; }}
                className="w-14 h-14 glass rounded-xl flex items-center justify-center text-cyan-400 text-xl border border-cyan-500/30 active:bg-cyan-500/20"
              >
                <i className="fas fa-chevron-down"></i>
              </MotionButton>
              <MotionButton 
                onMouseDown={() => { if(directionRef.current !== 'LEFT') directionRef.current = 'RIGHT'; }}
                className="w-14 h-14 glass rounded-xl flex items-center justify-center text-cyan-400 text-xl border border-cyan-500/30 active:bg-cyan-500/20"
              >
                <i className="fas fa-chevron-right"></i>
              </MotionButton>
           </div>

           <div className="flex flex-col justify-center gap-2">
              <MotionButton 
                onClick={() => setIsPaused(p => !p)}
                className="px-6 py-4 glass rounded-xl text-cyan-400 font-orbitron text-[10px] font-bold uppercase tracking-widest border border-cyan-500/30"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </MotionButton>
              <MotionButton 
                onClick={onBack}
                className="px-6 py-4 glass rounded-xl text-pink-400 font-orbitron text-[10px] font-bold uppercase tracking-widest border border-pink-500/30"
              >
                Exit
              </MotionButton>
           </div>
        </div>

        <p className="text-[10px] font-orbitron text-white/20 uppercase tracking-[0.4em] font-bold">
          [ WASD / ARROWS ] TO NAVIGATE THE GRID
        </p>
      </div>
    </div>
  );
};

export default SnakeGame;
