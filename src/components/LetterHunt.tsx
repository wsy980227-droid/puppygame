import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Timer } from 'lucide-react';
import { motion } from 'motion/react';

interface LetterHuntProps {
  onScore: (playerId: string) => void;
  players: { id: string; name: string; emoji: string }[];
}

export const LetterHunt: React.FC<LetterHuntProps> = ({ onScore, players }) => {
  const [letter, setLetter] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const generateLetter = () => {
    const random = alphabet[Math.floor(Math.random() * alphabet.length)];
    setLetter(random);
    setTimeLeft(10);
    setIsActive(true);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
  }, [isActive, timeLeft]);

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-xl font-bold">4. 首字母找东西</h3>
      </div>
      
      <div className="puppy-card flex-1 flex flex-col items-center justify-center p-6 min-h-0 relative overflow-hidden bg-white shadow-xl">
        {!letter ? (
          <button onClick={generateLetter} className="puppy-button bg-soft-pink text-2xl px-12 py-6 shadow-lg">
            <Search size={32} /> 抽取字母
          </button>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-[10rem] font-bold leading-none text-soft-text"
              >
                {letter}
              </motion.div>
              
              <div className={`text-3xl font-bold flex items-center justify-center gap-2 mt-4 ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-soft-text'}`}>
                <Timer size={24} /> {timeLeft}s
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full shrink-0 overflow-y-auto no-scrollbar max-h-[50%]">
              {players.map(p => (
                <button
                  key={p.id}
                  onClick={() => onScore(p.id)}
                  className="puppy-button bg-soft-pink hover:bg-soft-blue py-4 text-lg flex flex-col gap-1 shadow-md"
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <span>{p.name} 找到了！</span>
                </button>
              ))}
              <div className="col-span-full flex justify-center mt-2">
                <button onClick={generateLetter} className="puppy-button bg-soft-blue text-soft-text text-sm py-2 px-6">
                  <RotateCcw size={14} /> 重新抽取
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
