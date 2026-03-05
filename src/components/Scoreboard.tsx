import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X, Plus, Minus, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Player } from '../types';

interface ScoreboardProps {
  players: Player[];
  onUpdateScore: (id: string, delta: number) => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ players, onUpdateScore }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      drag
      dragMomentum={false}
      className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2 cursor-move"
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ x: 100, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 100, opacity: 0, scale: 0.9 }}
            className="w-48 bg-white/95 backdrop-blur-md border-2 border-soft-pink rounded-extreme p-3 shadow-xl overflow-hidden"
          >
            <div className="flex justify-between items-center mb-3 border-b border-soft-text/10 pb-2">
              <h2 className="text-sm font-bold flex items-center gap-1 text-soft-text">
                <Trophy size={14} className="text-soft-pink" /> 实时分
              </h2>
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-soft-blue rounded-full transition-colors text-gray-400"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
              {players.map((player) => (
                <div key={player.id} className="flex flex-col gap-1 bg-soft-bg p-2 rounded-xl border border-soft-text/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate flex items-center gap-1">
                      <span>{player.emoji}</span>
                      <span className="truncate text-soft-text">{player.name}</span>
                    </span>
                    <span className="text-lg font-bold text-soft-text leading-none">{player.score}</span>
                  </div>
                  <div className="flex gap-1 justify-end">
                    <button
                      onClick={() => onUpdateScore(player.id, 1)}
                      className="flex-1 py-1 bg-soft-pink/20 text-soft-text rounded-lg hover:bg-soft-pink transition-all"
                    >
                      <Plus size={12} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => onUpdateScore(player.id, -1)}
                      className="flex-1 py-1 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Minus size={12} className="mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
              {players.length === 0 && (
                <p className="text-center text-[10px] text-gray-400 py-2">暂无嘉宾</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isExpanded && (
        <motion.button
          layoutId="scoreboard-toggle"
          onClick={() => setIsExpanded(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-soft-pink text-soft-text p-3 rounded-full shadow-lg border-2 border-white flex items-center justify-center"
        >
          <Trophy size={20} />
        </motion.button>
      )}
    </motion.div>
  );
};
