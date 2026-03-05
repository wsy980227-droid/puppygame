import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Timer, EyeOff } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

interface CharacterQuizProps {
  onScore: (playerId: string) => void;
}

export const CharacterQuiz: React.FC<CharacterQuizProps> = ({ onScore }) => {
  const { files, completedFileIds, markFileAsCompleted } = useGameStore();
  const gameFiles = files['CHARACTER_QUIZ'];
  const completedIds = completedFileIds['CHARACTER_QUIZ'];
  
  const availableFiles = gameFiles.filter(f => !completedIds.includes(f.id));
  
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [inputCount, setInputCount] = useState<string>('6');
  const [turnIndex, setTurnIndex] = useState(0);
  
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [phase, setPhase] = useState<'SETUP' | 'IDLE' | 'SHOWING' | 'RESULT' | 'GAMEOVER' | 'SUCCESS'>('SETUP');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const currentFile = gameFiles.find(f => f.id === currentFileId);

  const players = Array.from({ length: playerCount || 0 }, (_, i) => ({
    id: `p${i + 1}`,
    name: `${i + 1}号`,
  }));

  const getCurrentPlayerIndex = () => {
    if (!playerCount) return 0;
    if (turnIndex < playerCount) {
      return turnIndex;
    } else {
      return (playerCount - 1) - (turnIndex - (playerCount - 1));
    }
  };

  const currentPlayerIndex = getCurrentPlayerIndex();

  const nextPlayer = () => {
    if (!playerCount) return;
    const nextTurn = turnIndex + 1;
    if (nextTurn >= (playerCount * 2) - 1) {
      setPhase('SUCCESS');
    } else {
      setTurnIndex(nextTurn);
    }
  };

  const startRound = () => {
    if (availableFiles.length === 0) return;
    const nextIndex = Math.floor(Math.random() * availableFiles.length);
    setCurrentFileId(availableFiles[nextIndex].id);
    setTimeLeft(3);
    setPhase('SHOWING');
    setIsAnswerRevealed(false);
  };

  const handleCorrect = () => {
    if (currentFileId) {
      markFileAsCompleted('CHARACTER_QUIZ', currentFileId);
      nextPlayer();
      // If we didn't just transition to SUCCESS, start next round
      // We need to check the phase after nextPlayer() call, but state updates are async.
      // So we check the logic directly.
      const nextTurn = turnIndex + 1;
      if (nextTurn < (playerCount || 0) * 2 - 1 && availableFiles.length > 1) {
        startRound();
      }
    }
  };

  const handleWrong = () => {
    setPhase('GAMEOVER');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'RESULT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleCorrect();
      } else if (e.code === 'Enter') {
        e.preventDefault();
        handleWrong();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentFileId, turnIndex, playerCount, availableFiles.length]);

  useEffect(() => {
    if (phase === 'SHOWING' && timeLeft !== null) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase('RESULT');
      }
    }
  }, [phase, timeLeft]);

  const handleSetupComplete = () => {
    const count = parseInt(inputCount) || 6;
    setPlayerCount(count);
    setTurnIndex(0);
    // Start the first round immediately if files are available
    if (availableFiles.length > 0) {
      const nextIndex = Math.floor(Math.random() * availableFiles.length);
      setCurrentFileId(availableFiles[nextIndex].id);
      setTimeLeft(3);
      setPhase('SHOWING');
      setIsAnswerRevealed(false);
    } else {
      setPhase('IDLE');
    }
  };

  if (playerCount === null) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6">
        <h2 className="text-3xl font-bold text-soft-text">几个人玩？</h2>
        <div className="flex flex-col items-center gap-4">
          <input
            type="number"
            value={inputCount}
            onChange={(e) => setInputCount(e.target.value)}
            className="w-32 text-center text-4xl p-4 rounded-2xl border-4 border-soft-blue focus:outline-none focus:ring-4 focus:ring-soft-blue/20"
            min="1"
            max="20"
          />
          <button
            onClick={handleSetupComplete}
            className="puppy-button bg-soft-pink text-2xl px-12 py-4"
          >
            开始挑战
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Player Indicators */}
      <div className="flex justify-center gap-1.5 overflow-x-auto py-1 no-scrollbar shrink-0">
        {players.map((p, idx) => (
          <div
            key={p.id}
            className={`px-3 py-1 rounded-full font-bold text-sm transition-all duration-300 ${
              idx === currentPlayerIndex
                ? 'bg-soft-pink text-white scale-105 shadow-md ring-2 ring-soft-pink/30'
                : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            {p.name}
          </div>
        ))}
      </div>

      <div className="puppy-card flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden bg-white shadow-xl min-h-0">
        {phase === 'IDLE' ? (
          <div className="text-center space-y-4">
            {availableFiles.length > 0 ? (
              <>
                <div className="bg-soft-bg p-6 rounded-extreme border-2 border-soft-blue/20 mb-4">
                  <p className="text-soft-text font-bold text-lg">准备就绪</p>
                  <p className="text-gray-500 text-sm">剩余 {availableFiles.length} 张照片</p>
                </div>
                <button onClick={startRound} className="puppy-button bg-soft-pink text-xl px-12 py-5 shadow-lg">
                  <Play /> 开始挑战
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-soft-text text-2xl font-bold">🎉 全部挑战完成！</p>
                <button onClick={() => setPlayerCount(null)} className="puppy-button bg-soft-blue">重新开始</button>
              </div>
            )}
          </div>
        ) : phase === 'SUCCESS' ? (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-4xl font-bold text-soft-text">恭喜挑战成功！</h2>
            <p className="text-gray-500">所有玩家都顺利完成了本轮挑战。</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => {
                  setTurnIndex(0);
                  startRound();
                }}
                disabled={availableFiles.length === 0}
                className="puppy-button bg-soft-pink text-xl px-10 py-4 disabled:opacity-50"
              >
                再玩一局
              </button>
              <button 
                onClick={() => setPlayerCount(null)}
                className="puppy-button bg-soft-blue text-xl px-10 py-4"
              >
                重设人数
              </button>
            </div>
          </div>
        ) : phase === 'GAMEOVER' ? (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-4xl font-bold text-soft-text">游戏结束</h2>
            <p className="text-gray-500">很遗憾，答错了！</p>
            <button 
              onClick={() => {
                setPhase('IDLE');
                setTurnIndex(0);
              }} 
              className="puppy-button bg-soft-pink text-xl px-12 py-4"
            >
              重新挑战
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center overflow-hidden">
            <AnimatePresence mode="wait">
              {phase === 'SHOWING' && currentFile ? (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="relative w-full h-full flex flex-col items-center justify-center p-4"
                >
                  <div className="absolute top-4 right-4 bg-soft-pink text-soft-text w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white shadow-xl z-10">
                    {timeLeft}
                  </div>
                  <img
                    src={currentFile.url}
                    className="w-full h-full object-contain rounded-extreme border-4 border-soft-blue/30 shadow-2xl"
                    alt="Quiz"
                  />
                </motion.div>
              ) : phase === 'RESULT' && currentFile ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full h-full flex flex-col items-center gap-4 overflow-hidden"
                >
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
                    <div className="space-y-6">
                      <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">正确答案</p>
                      <AnimatePresence mode="wait">
                        {!isAnswerRevealed ? (
                          <motion.button
                            key="reveal-btn"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            onClick={() => setIsAnswerRevealed(true)}
                            className="puppy-button bg-soft-blue text-soft-text text-2xl px-16 py-6 shadow-xl hover:scale-105 transition-transform"
                          >
                            揭晓答案
                          </motion.button>
                        ) : (
                          <motion.div
                            key="answer-text"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="space-y-4"
                          >
                            <h4 className="text-7xl font-priority text-soft-pink drop-shadow-sm">
                              {currentFile.file.name.replace(/\.[^/.]+$/, "")}
                            </h4>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Referee Buttons */}
                  <div className="grid grid-cols-2 gap-8 w-full max-w-3xl mt-auto pb-10">
                    <button
                      onClick={handleCorrect}
                      className="puppy-button bg-emerald-500 hover:bg-emerald-600 text-white text-4xl py-10 flex flex-col items-center gap-1 shadow-2xl transition-all active:scale-95"
                    >
                      <span className="font-bold">对</span>
                      <span className="text-sm opacity-80 font-normal">(Space)</span>
                    </button>
                    <button
                      onClick={handleWrong}
                      className="puppy-button bg-rose-500 hover:bg-rose-600 text-white text-4xl py-10 flex flex-col items-center gap-1 shadow-2xl transition-all active:scale-95"
                    >
                      <span className="font-bold">错</span>
                      <span className="text-sm opacity-80 font-normal">(Enter)</span>
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      <div className="bg-soft-blue/10 p-2 rounded-xl text-[10px] text-soft-text flex items-start gap-2 shrink-0">
        <Timer size={12} className="mt-0.5 flex-shrink-0" />
        <p>规则：图片仅展示 3 秒，当前玩家需在展示期间喊出名字。3 秒后图片消失，由 PD 确认是否正确。空格键记为正确并进入下一题，回车键记为错误并结束游戏。</p>
      </div>
    </div>
  );
};
