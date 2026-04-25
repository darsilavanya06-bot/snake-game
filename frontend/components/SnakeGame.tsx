import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction, GameState } from '../types';
import { GRID_SIZE, INITIAL_SPEED } from '../constants';
import { GlitchText } from './GlitchText';

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

export const SnakeGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: Direction.UP,
    gameOver: false,
    score: 0,
    isPlaying: false,
  });

  const directionRef = useRef<Direction>(Direction.UP);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const startGame = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: Direction.UP,
      gameOver: false,
      score: 0,
      isPlaying: true,
    });
    directionRef.current = Direction.UP;
    setSpeed(INITIAL_SPEED);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!gameState.isPlaying || gameState.gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (directionRef.current !== Direction.DOWN) directionRef.current = Direction.UP;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (directionRef.current !== Direction.UP) directionRef.current = Direction.DOWN;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (directionRef.current !== Direction.RIGHT) directionRef.current = Direction.LEFT;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (directionRef.current !== Direction.LEFT) directionRef.current = Direction.RIGHT;
        break;
    }
  }, [gameState.isPlaying, gameState.gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!gameState.isPlaying || gameState.gameOver) return;

    const moveSnake = () => {
      setGameState(prev => {
        const head = prev.snake[0];
        const newHead = { ...head };

        switch (directionRef.current) {
          case Direction.UP: newHead.y -= 1; break;
          case Direction.DOWN: newHead.y += 1; break;
          case Direction.LEFT: newHead.x -= 1; break;
          case Direction.RIGHT: newHead.x += 1; break;
        }

        // Wall Collision
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          return { ...prev, gameOver: true, isPlaying: false };
        }

        // Self Collision
        if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          return { ...prev, gameOver: true, isPlaying: false };
        }

        const newSnake = [newHead, ...prev.snake];
        let newScore = prev.score;
        let newFood = prev.food;

        // Food Collision
        if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
          newScore += 10;
          newFood = generateFood(newSnake);
          // Increase speed slightly
          setSpeed(s => Math.max(50, s - 2));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          score: newScore,
          direction: directionRef.current
        };
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [gameState.isPlaying, gameState.gameOver, speed]);

  // Render Grid
  const grid = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const isSnakeHead = gameState.snake[0].x === x && gameState.snake[0].y === y;
      const isSnakeBody = gameState.snake.some((s, i) => i !== 0 && s.x === x && s.y === y);
      const isFood = gameState.food.x === x && gameState.food.y === y;

      let cellClass = "w-full h-full border-[0.5px] border-cyan-900/20 ";
      if (isSnakeHead) cellClass += "bg-cyan-300 shadow-[0_0_10px_#00ffff] z-10 relative";
      else if (isSnakeBody) cellClass += "bg-cyan-600 opacity-80";
      else if (isFood) cellClass += "bg-fuchsia-500 shadow-[0_0_15px_#ff00ff] animate-pulse";

      grid.push(<div key={`${x}-${y}`} className={cellClass} />);
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Header / Score */}
      <div className="w-full flex justify-between items-end mb-4 border-b-2 border-cyan-500 pb-2 px-2">
        <div>
          <div className="text-fuchsia-500 text-sm tracking-widest mb-1">PROCESS: SNAKE.EXE</div>
          <GlitchText text={`SCORE: ${gameState.score.toString().padStart(4, '0')}`} className="text-3xl text-cyan-400" />
        </div>
        <div className="text-right">
          <div className="text-cyan-700 text-xs">STATUS</div>
          <div className={`text-xl ${gameState.gameOver ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
            {gameState.gameOver ? 'CRITICAL_FAILURE' : gameState.isPlaying ? 'RUNNING' : 'IDLE'}
          </div>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative w-full aspect-square bg-black border-4 border-cyan-800 shadow-[0_0_30px_rgba(0,255,255,0.1)] p-1">
        {/* Grid */}
        <div 
          className="w-full h-full grid" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
          }}
        >
          {grid}
        </div>

        {/* Overlays */}
        {!gameState.isPlaying && !gameState.gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <GlitchText text="SYSTEM READY" className="text-4xl text-cyan-400 mb-8" />
            <button 
              onClick={startGame}
              className="px-8 py-3 border-2 border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-black transition-all text-xl tracking-widest shadow-[0_0_15px_rgba(255,0,255,0.4)]"
            >
              INITIALIZE
            </button>
          </div>
        )}

        {gameState.gameOver && (
          <div className="absolute inset-0 bg-red-900/40 flex flex-col items-center justify-center z-20 backdrop-blur-md border-4 border-red-500 tear-effect">
            <GlitchText text="FATAL ERROR" className="text-6xl text-red-500 mb-2" />
            <div className="text-white text-xl mb-8 font-mono">SEGMENTATION FAULT</div>
            <div className="text-cyan-400 text-2xl mb-8">FINAL SCORE: {gameState.score}</div>
            <button 
              onClick={startGame}
              className="px-8 py-3 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all text-xl tracking-widest"
            >
              REBOOT
            </button>
          </div>
        )}
      </div>
      
      <div className="w-full mt-4 text-center text-cyan-600 text-sm">
        USE [W][A][S][D] OR ARROW KEYS TO INTERFACE
      </div>
    </div>
  );
};
