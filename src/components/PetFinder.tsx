import React, { useState } from 'react';
import { Dog, Upload, CheckCircle2, PawPrint } from 'lucide-react';
import { motion } from 'motion/react';

interface PetFinderProps {
  onScore: (playerId: string) => void;
  players: { id: string; name: string; emoji: string }[];
}

export const PetFinder: React.FC<PetFinderProps> = ({ onScore, players }) => {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-2xl font-bold text-soft-text">7. 看图找自家宠物</h3>
        <div className="bg-soft-pink text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
          纯计分模式
        </div>
      </div>

      <div className="puppy-card flex-1 flex flex-col items-center justify-center p-6 bg-white shadow-xl min-h-0 overflow-hidden">
        <div className="text-center mb-6 shrink-0">
          <div className="w-20 h-20 bg-soft-blue/10 rounded-extreme flex items-center justify-center mx-auto border-2 border-soft-blue/20 mb-4">
            <PawPrint size={40} className="text-soft-blue" />
          </div>
          <h4 className="text-xl font-bold text-soft-text">嘉宾正在寻找宠物...</h4>
          <p className="text-soft-text/60 text-sm">PD 请在外部展示拼图，此处仅负责计分。</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full overflow-y-auto no-scrollbar pr-1">
          {players.map(p => (
            <button
              key={p.id}
              onClick={() => onScore(p.id)}
              className="puppy-button bg-soft-pink hover:bg-soft-blue py-6 text-xl flex flex-col gap-1 shadow-lg"
            >
              <span className="text-3xl">{p.emoji}</span>
              <span>{p.name} 找到了！</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
