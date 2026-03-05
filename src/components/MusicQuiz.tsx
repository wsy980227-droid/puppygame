import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, LogIn } from 'lucide-react';

interface MusicQuizProps {
  onScore: (playerId: string) => void;
  players: { id: string; name: string; emoji: string }[];
}

export const MusicQuiz: React.FC<MusicQuizProps> = ({ onScore, players }) => {
  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-xl font-bold">2. 听歌识曲</h3>
      </div>

      <div className="puppy-card flex-1 flex flex-col items-center justify-center p-6 bg-white shadow-xl min-h-0 overflow-hidden">
        <div className="text-center mb-6 shrink-0">
          <div className="w-24 h-24 bg-soft-blue/10 rounded-full flex items-center justify-center mx-auto animate-float mb-4">
            <Music size={48} className="text-soft-blue" />
          </div>
          
          <p className="text-soft-text font-bold text-lg max-w-md">
            PD 请在播放器中播放歌曲。当歌曲响起，嘉宾即可抢答！
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 w-full overflow-y-auto no-scrollbar pr-1">
          {players.map(p => (
            <button
              key={p.id}
              onClick={() => onScore(p.id)}
              className="puppy-button bg-soft-pink hover:bg-soft-blue py-6 text-xl flex flex-col gap-1 shadow-lg"
            >
              <span className="text-3xl">{p.emoji}</span>
              <span>{p.name} 积1分</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
