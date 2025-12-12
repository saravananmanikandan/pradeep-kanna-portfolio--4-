import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, Keyboard, MousePointer2 } from 'lucide-react';

// --- Types ---
type Grid = number[][];
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// --- Constants ---
const SIZE = 3;
const WIN_VALUE = 2048; 

// --- Confetti Utility ---
const fireConfetti = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: any[] = [];
    const colors = ['#FCD748', '#917FF0', '#72D2BE', '#F97F7A', '#61ADEB', '#3FAD4B'];

    for (let i = 0; i < 100; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 5 + 2,
            life: 100
        });
    }

    const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;

        particles.forEach(p => {
            if (p.life > 0) {
                active = true;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2; // Gravity
                p.life--;
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life / 100;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        if (active) requestAnimationFrame(animate);
    };
    animate();
};

export const NumberGame: React.FC = () => {
    const [grid, setGrid] = useState<Grid>([]);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // --- Game Logic ---

    const initGame = useCallback(() => {
        const newGrid = Array(SIZE).fill(0).map(() => Array(SIZE).fill(0));
        addRandomTile(newGrid);
        addRandomTile(newGrid);
        setGrid(newGrid);
        setScore(0);
        setGameState('playing');
        if (containerRef.current) containerRef.current.focus();
    }, []);

    const addRandomTile = (currentGrid: Grid) => {
        const emptyCells = [];
        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                if (currentGrid[r][c] === 0) emptyCells.push({ r, c });
            }
        }
        if (emptyCells.length === 0) return;
        const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        currentGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    };

    const move = (direction: Direction) => {
        if (gameState !== 'playing') return;

        let moved = false;
        const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy
        let addedScore = 0;

        const traverse = (callback: (r: number, c: number) => void) => {
            for (let i = 0; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    let r = i, c = j;
                    if (direction === 'RIGHT') c = SIZE - 1 - j;
                    if (direction === 'DOWN') r = SIZE - 1 - j;
                }
            }
        };

        const rotateLeft = (g: Grid) => g[0].map((_, i) => g.map(row => row[i])).reverse();
        const rotateRight = (g: Grid) => g[0].map((_, i) => g.map(row => row[i]).reverse());
        
        let processGrid = newGrid;
        
        if (direction === 'RIGHT') processGrid = rotateRight(rotateRight(processGrid));
        if (direction === 'UP') processGrid = rotateLeft(processGrid);
        if (direction === 'DOWN') processGrid = rotateRight(processGrid);

        for (let r = 0; r < SIZE; r++) {
            const row = processGrid[r].filter((val: number) => val !== 0);
            for (let c = 0; c < row.length - 1; c++) {
                if (row[c] === row[c + 1]) {
                    row[c] *= 2;
                    addedScore += row[c];
                    row.splice(c + 1, 1);
                    if (row[c] === WIN_VALUE && gameState !== 'won') {
                        setGameState('won');
                        setTimeout(() => {
                           if(canvasRef.current) fireConfetti(canvasRef.current);
                        }, 100);
                    }
                }
            }
            while (row.length < SIZE) row.push(0);
            processGrid[r] = row;
        }

        if (direction === 'RIGHT') processGrid = rotateRight(rotateRight(processGrid));
        if (direction === 'UP') processGrid = rotateRight(processGrid);
        if (direction === 'DOWN') processGrid = rotateLeft(processGrid);

        if (JSON.stringify(grid) !== JSON.stringify(processGrid)) {
            moved = true;
        }

        if (moved) {
            addRandomTile(processGrid);
            setGrid(processGrid);
            setScore(prev => prev + addedScore);
            
            if (!canMove(processGrid)) {
                setGameState('lost');
            }
        }
    };

    const canMove = (checkGrid: Grid) => {
        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                if (checkGrid[r][c] === 0) return true;
                if (r < SIZE - 1 && checkGrid[r][c] === checkGrid[r + 1][c]) return true;
                if (c < SIZE - 1 && checkGrid[r][c] === checkGrid[r][c + 1]) return true;
            }
        }
        return false;
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
        e.preventDefault();
        
        switch (e.key) {
            case 'ArrowUp': move('UP'); break;
            case 'ArrowDown': move('DOWN'); break;
            case 'ArrowLeft': move('LEFT'); break;
            case 'ArrowRight': move('RIGHT'); break;
        }
    };

    useEffect(() => {
        initGame();
    }, [initGame]);

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && containerRef.current) {
                canvasRef.current.width = containerRef.current.clientWidth;
                canvasRef.current.height = containerRef.current.clientHeight;
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    // --- Colors & Styles ---
    const getTileStyle = (value: number) => {
        const base = "flex items-center justify-center rounded-lg font-bold text-2xl transition-all duration-200";
        if (value === 0) return `${base} bg-white/40 dark:bg-white/5 text-transparent`;
        
        let bg = "bg-slate-700 text-white";
        let shadow = "";
        
        // Use the requested accent palette for tiles
        if (value === 2) bg = "bg-accent-aqua text-black shadow-lg shadow-accent-aqua/20"; // Aqua
        else if (value === 4) bg = "bg-accent-yellow text-black shadow-lg shadow-accent-yellow/20"; // Yellow
        else if (value === 8) bg = "bg-accent-blue text-white shadow-lg shadow-accent-blue/20"; // Blue
        else if (value === 16) bg = "bg-accent-purple text-white shadow-lg shadow-accent-purple/20"; // Purple
        else if (value === 32) bg = "bg-accent-red text-white shadow-lg shadow-accent-red/20"; // Red
        else if (value === 64) bg = "bg-accent-green text-white shadow-lg shadow-accent-green/20"; // Green
        else if (value >= 128) {
            bg = "bg-white text-black border border-brand-periwinkle shadow-xl";
        }
        
        return `${base} ${bg} ${shadow}`;
    };

    return (
        <div 
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full h-full bg-slate-100 dark:bg-[#111111] relative overflow-hidden flex flex-col focus:outline-none focus:ring-1 focus:ring-accent-purple/30 group transition-colors duration-500"
        >
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-30" />

            {/* Header */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
                <div className="flex flex-col">
                    <span className="text-xs font-bold tracking-widest text-slate-500 uppercase flex items-center gap-2">
                        {isFocused ? <Keyboard size={12} className="text-accent-aqua" /> : <MousePointer2 size={12} />}
                        Play 2048
                    </span>
                    <span className="text-2xl font-display font-bold text-slate-900 dark:text-white">{score}</span>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); initGame(); }}
                    className="pointer-events-auto p-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full text-slate-900 dark:text-white transition-colors"
                    title="Reset Game"
                >
                    <RotateCcw size={16} />
                </button>
            </div>

            {/* Grid Container */}
            <div className="flex-1 flex items-center justify-center p-4 mt-8">
                <div className="grid grid-cols-3 gap-2 w-full max-w-[240px] aspect-square bg-white dark:bg-white/5 p-2 rounded-xl shadow-inner">
                    {grid.map((row, r) => (
                        row.map((val, c) => (
                            <motion.div
                                key={`${r}-${c}`}
                                layoutId={`tile-${r}-${c}`}
                                className={getTileStyle(val)}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                {val > 0 ? val : ""}
                            </motion.div>
                        ))
                    ))}
                </div>
            </div>

            {/* Overlays */}
            <AnimatePresence>
                {!isFocused && gameState === 'playing' && (
                     <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer"
                        onClick={() => containerRef.current?.focus()}
                     >
                        <span className="text-slate-800 dark:text-white/70 font-display text-sm uppercase tracking-widest border border-slate-300 dark:border-white/20 px-4 py-2 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors">
                            Click to Focus
                        </span>
                     </motion.div>
                )}

                {gameState === 'won' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 z-40 bg-white/90 dark:bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
                    >
                        <Trophy size={48} className="text-accent-yellow mb-4 animate-bounce" />
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">You Won!</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">You've reached {WIN_VALUE}</p>
                        <button 
                            onClick={initGame}
                            className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold hover:opacity-90 transition-opacity"
                        >
                            Play Again
                        </button>
                    </motion.div>
                )}

                {gameState === 'lost' && (
                    <motion.div 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className="absolute inset-0 z-40 bg-white/90 dark:bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
                    >
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Game Over</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">Score: {score}</p>
                        <button 
                            onClick={initGame}
                            className="px-6 py-2 bg-accent-blue text-white rounded-full font-bold hover:shadow-lg transition-all"
                        >
                            Try Again
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
