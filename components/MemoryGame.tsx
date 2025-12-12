import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Play, RotateCcw } from 'lucide-react';

const COLORS = [
  { id: 0, color: 'bg-accent-yellow', border: 'border-accent-yellow', shadow: 'shadow-accent-yellow/50' }, // Top Left
  { id: 1, color: 'bg-accent-purple', border: 'border-accent-purple', shadow: 'shadow-accent-purple/50' }, // Top Right
  { id: 2, color: 'bg-accent-aqua', border: 'border-accent-aqua', shadow: 'shadow-accent-aqua/50' },   // Bottom Left
  { id: 3, color: 'bg-accent-red', border: 'border-accent-red', shadow: 'shadow-accent-red/50' }      // Bottom Right
];

export const MemoryGame: React.FC = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [isUserTurn, setIsUserTurn] = useState(false);

  // Sound placeholders (Visual only for now, but structure allows expansion)
  const playTone = (id: number) => {
    // In a real implementation, we would play Audio here
  };

  const startGame = () => {
    setSequence([]);
    setScore(0);
    setGameState('playing');
    setUserStep(0);
    setIsUserTurn(false);
    addToSequence([]);
  };

  const addToSequence = useCallback((currentSequence: number[]) => {
    const nextColor = Math.floor(Math.random() * 4);
    const newSequence = [...currentSequence, nextColor];
    setSequence(newSequence);
    playSequence(newSequence);
  }, []);

  const playSequence = (seq: number[]) => {
    setIsUserTurn(false);
    let i = 0;
    
    const interval = setInterval(() => {
      if (i >= seq.length) {
        clearInterval(interval);
        setIsUserTurn(true);
        setActivePad(null);
        return;
      }

      const padId = seq[i];
      setActivePad(padId);
      playTone(padId);

      // Turn off pad shortly after turning it on
      setTimeout(() => {
        setActivePad(null);
      }, 400);

      i++;
    }, 800);
  };

  const handlePadClick = (id: number) => {
    if (!isUserTurn || gameState !== 'playing') return;

    // Flash the pad immediately on click
    setActivePad(id);
    playTone(id);
    setTimeout(() => setActivePad(null), 200);

    // Logic
    if (id === sequence[userStep]) {
      // Correct
      const nextStep = userStep + 1;
      setUserStep(nextStep);

      if (nextStep === sequence.length) {
        // Completed the sequence
        setScore(prev => prev + 1);
        setIsUserTurn(false);
        setUserStep(0);
        setTimeout(() => {
          addToSequence(sequence);
        }, 1000);
      }
    } else {
      // Wrong
      setGameState('gameover');
      setIsUserTurn(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#1A1A1A] dark:bg-[#0A0A0A] relative overflow-hidden flex flex-col p-6 transition-colors duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex flex-col">
           <span className="text-xs font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2 mb-1">
              <BrainCircuit size={14} className="text-brand-periwinkle" />
              History Sequences
           </span>
           <div className="flex items-baseline gap-1">
             <span className="text-sm text-slate-500">Score:</span>
             <span className="text-2xl font-display font-bold text-white">{score}</span>
           </div>
        </div>
        
        {gameState === 'playing' && (
             <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${isUserTurn ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                 <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    {isUserTurn ? 'Your Turn' : 'Watch'}
                 </span>
             </div>
        )}
      </div>

      {/* Game Grid */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 w-full max-w-[220px] aspect-square">
            {COLORS.map((pad) => (
                <motion.button
                    key={pad.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePadClick(pad.id)}
                    className={`
                        relative rounded-2xl border-2 transition-all duration-100 ease-out
                        ${activePad === pad.id 
                            ? `${pad.color} ${pad.border} ${pad.shadow} shadow-[0_0_30px_rgba(255,255,255,0.4)] scale-[1.02] z-10 brightness-110` 
                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                        }
                    `}
                >
                    {/* Inner Gloss */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                </motion.button>
            ))}
        </div>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {gameState === 'idle' && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            >
                <motion.button
                    onClick={startGame}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-3 group"
                >
                    <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-shadow">
                        <Play size={28} className="ml-1 fill-black" />
                    </div>
                    <span className="text-white font-display font-bold tracking-widest text-sm uppercase">Start Game</span>
                </motion.button>
            </motion.div>
        )}

        {gameState === 'gameover' && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
            >
                <h3 className="text-3xl font-bold text-white mb-1">Sequence Broken</h3>
                <p className="text-slate-400 mb-6">Final Score: {score}</p>
                <motion.button
                    onClick={startGame}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-brand-periwinkle hover:text-white transition-colors"
                >
                    <RotateCcw size={18} />
                    Try Again
                </motion.button>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
