import React, { useState, useEffect } from 'react';
import { Brain, Upload, Eye, EyeOff, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../store/useGameStore';

interface MemoryChallengeProps {
  onScore: (playerId: string) => void;
  players: { id: string; name: string; emoji: string }[];
}

export const MemoryChallenge: React.FC<MemoryChallengeProps> = ({ onScore, players }) => {
  const { files, addFile } = useGameStore();
  const gameFiles = files['MEMORY_CHALLENGE'];
  
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [timeLeft, setTimeLeft] = useState(10);
  const [phase, setPhase] = useState<'IDLE' | 'MEMORIZING' | 'QUESTIONING'>('IDLE');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-detect existing files
  useEffect(() => {
    if (gameFiles.length > 0 && phase === 'IDLE') {
      // Already in IDLE, just showing the count
    }
  }, [gameFiles.length, phase]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (uploadedFiles) {
      for (const file of Array.from(uploadedFiles) as File[]) {
        await addFile('MEMORY_CHALLENGE', file);
      }
    }
  };

  const startRound = (reuse = false) => {
    if (gameFiles.length === 0) return;
    if (!reuse) {
      setCurrentIndex(Math.floor(Math.random() * gameFiles.length));
    }
    setTimeLeft(10);
    setPhase('MEMORIZING');
    setIsFullscreen(false);
  };

  useEffect(() => {
    if (phase === 'MEMORIZING' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'MEMORIZING' && timeLeft === 0) {
      setPhase('QUESTIONING');
      setIsFullscreen(false);
    }
  }, [phase, timeLeft]);

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-xl font-bold">6. 最强大脑记忆挑战</h3>
        <label className="puppy-button bg-soft-blue text-xs py-1.5 px-3 cursor-pointer">
          <Upload size={14} /> 上传图片
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <div className="puppy-card flex-1 p-4 flex flex-col items-center justify-center min-h-0 relative overflow-hidden">
        {phase === 'IDLE' ? (
          <div className="text-center space-y-4">
            <Brain size={64} className="mx-auto text-soft-pink animate-float" />
            <p className="text-soft-text">已上传 {gameFiles.length} 张复杂图片</p>
            <button onClick={() => startRound()} disabled={gameFiles.length === 0} className="puppy-button">
              开始挑战
            </button>
          </div>
        ) : phase === 'MEMORIZING' ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <div className="flex justify-between items-center w-full px-4 shrink-0">
              <span className="flex items-center gap-2 font-bold text-soft-text">
                <Eye size={20} /> 点击图片可全屏观察
              </span>
              <span className="text-2xl font-bold text-red-500 flex items-center gap-2 bg-white px-4 py-1 rounded-full shadow-sm">
                <Timer size={20} /> {timeLeft}s
              </span>
            </div>
            
            <div 
              className="flex-1 w-full relative cursor-zoom-in group"
              onClick={() => setIsFullscreen(true)}
            >
              <img 
                src={gameFiles[currentIndex].url} 
                className="w-full h-full object-contain rounded-extreme border-4 border-soft-blue/30" 
                alt="Memory" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                <Eye size={48} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <AnimatePresence>
              {isFullscreen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black z-[200] flex flex-col p-4"
                >
                  <div className="flex justify-between items-center mb-4 px-4 shrink-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
                      className="puppy-button bg-white/20 text-white hover:bg-white/30"
                    >
                      退出全屏
                    </button>
                    <span className="text-3xl font-bold text-red-500 flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-xl">
                      <Timer size={24} /> {timeLeft}s
                    </span>
                  </div>
                  <div className="flex-1 relative overflow-hidden">
                    <img src={gameFiles[currentIndex].url} className="w-full h-full object-contain" alt="Memory Full" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-24 h-24 bg-soft-text rounded-full flex items-center justify-center mx-auto">
                <EyeOff size={48} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold">图片已消失！</h4>
              <p className="text-gray-600">PD 请提问，嘉宾抢答。</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full shrink-0 overflow-y-auto no-scrollbar max-h-[50%]">
              {players.map(p => (
                <button
                  key={p.id}
                  onClick={() => onScore(p.id)}
                  className="puppy-button bg-soft-pink hover:bg-soft-blue py-4 text-lg flex flex-col gap-1 shadow-md"
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <span>{p.name} 答对+1</span>
                </button>
              ))}
              <div className="col-span-full grid grid-cols-2 gap-3 mt-2">
                <button 
                  onClick={() => startRound(true)} 
                  className="puppy-button bg-soft-blue text-soft-text border-2 border-soft-blue/20 py-4 text-lg shadow-md"
                >
                  再来一次
                </button>
                <button 
                  onClick={() => setPhase('IDLE')} 
                  className="puppy-button bg-soft-pink text-soft-text py-4 text-lg shadow-md"
                >
                  下一题
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
