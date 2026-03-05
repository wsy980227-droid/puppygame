import React from 'react';
import { Palette } from 'lucide-react';

interface ProcreateGuessProps {
  onScore: (playerId: string) => void;
  players: { id: string; name: string; emoji: string }[];
}

export const ProcreateGuess: React.FC<ProcreateGuessProps> = ({ onScore, players }) => {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-xl font-bold">5. 五官猜人</h3>
      </div>
      
      <div className="puppy-card flex-1 flex flex-col items-center justify-center p-6 text-center min-h-0 overflow-hidden bg-white shadow-xl">
        <div className="shrink-0 mb-6">
          <div className="w-20 h-20 bg-soft-blue/20 rounded-extreme flex items-center justify-center mx-auto mb-4 rotate-3">
            <Palette size={40} className="text-soft-blue" />
          </div>
          <h4 className="text-xl font-bold mb-2 text-soft-text">Procreate 创作中...</h4>
          <p className="text-soft-text/60 text-sm max-w-md mx-auto">
            PD 请在 iPad Procreate 上进行局部绘画。
            嘉宾根据绘画内容进行抢答，此处仅负责记录分数。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full overflow-y-auto no-scrollbar pr-1">
          {players.map(p => (
            <button 
              key={p.id} 
              onClick={() => onScore(p.id)} 
              className="puppy-button bg-soft-pink hover:bg-soft-blue py-6 text-xl flex flex-col gap-1 shadow-lg"
            >
              <span className="text-3xl">{p.emoji}</span>
              <span>{p.name} 答对+1</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
