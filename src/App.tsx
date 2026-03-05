/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dog, 
  ChevronRight, 
  Trophy,
  Home,
  Database,
  Upload
} from 'lucide-react';
import { Player, GameType, GAMES } from './types';
import { Scoreboard } from './components/Scoreboard';
import { CharacterQuiz } from './components/CharacterQuiz';
import { MusicQuiz } from './components/MusicQuiz';
import { MediaQuiz } from './components/MediaQuiz';
import { LetterHunt } from './components/LetterHunt';
import { ProcreateGuess } from './components/ProcreateGuess';
import { MemoryChallenge } from './components/MemoryChallenge';
import { PetFinder } from './components/PetFinder';
import { useGameStore } from './store/useGameStore';

import confetti from 'canvas-confetti';

const ANIMAL_EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];

export default function App() {
  const { 
    players, setPlayers, updateScore, 
    gameState, setGameState, 
    activeGame, setActiveGame,
    files, loadFilesFromDB, clearAllFiles
  } = useGameStore();
  
  const [newPlayerName, setNewPlayerName] = useState('');

  useEffect(() => {
    loadFilesFromDB();
  }, [loadFilesFromDB]);

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 5) {
      const usedEmojis = players.map(p => p.emoji);
      const availableEmojis = ANIMAL_EMOJIS.filter(e => !usedEmojis.includes(e));
      const emoji = availableEmojis[Math.floor(Math.random() * availableEmojis.length)] || '🐾';
      
      setPlayers([...players, { 
        id: Date.now().toString(), 
        name: newPlayerName.trim(), 
        score: 0,
        emoji: emoji
      }]);
      setNewPlayerName('');
    }
  };

  const startGame = (gameId: GameType) => {
    setActiveGame(gameId);
    setGameState('PLAYING');
  };

  const handleCharacterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (uploadedFiles) {
      const { addFile } = useGameStore.getState();
      for (const file of Array.from(uploadedFiles) as File[]) {
        await addFile('CHARACTER_QUIZ', file);
      }
    }
  };

  const finishGame = async () => {
    setGameState('FINISH');
    await clearAllFiles();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFAB76', '#FFDCAE', '#FFF9F0', '#5C4033']
    });
  };

  const renderGame = () => {
    switch (activeGame) {
      case 'CHARACTER_QUIZ': return <CharacterQuiz onScore={(id) => updateScore(id, 1)} />;
      case 'MUSIC_QUIZ': return <MusicQuiz players={players} onScore={(id) => updateScore(id, 1)} />;
      case 'MEDIA_QUIZ': return <MediaQuiz players={players} onScore={(id) => updateScore(id, 1)} />;
      case 'LETTER_HUNT': return <LetterHunt players={players} onScore={(id) => updateScore(id, 1)} />;
      case 'PROCREATE_GUESS': return <ProcreateGuess players={players} onScore={(id) => updateScore(id, 1)} />;
      case 'MEMORY_CHALLENGE': return <MemoryChallenge players={players} onScore={(id) => updateScore(id, 1)} />;
      case 'PET_FINDER': return <PetFinder players={players} onScore={(id) => updateScore(id, 1)} />;
      default: return null;
    }
  };

  const getIcon = (icon: string) => {
    return <span className="text-2xl">{icon}</span>;
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const totalFiles = Object.values(files).flat().length;

  return (
    <div className="viewport-fill">
      {/* Header */}
      <header className="p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-soft-pink p-1.5 rounded-2xl rotate-[-10deg] shadow-lg shadow-soft-pink/20">
            <Dog className="text-soft-text" size={24} />
          </div>
          <h1 className="text-2xl font-priority text-soft-text">芒狗不忙 🥭</h1>
        </div>
        
        <div className="flex gap-2 items-center">
          {totalFiles > 0 && gameState !== 'REGISTRATION' && (
            <div className="flex items-center gap-1.5 bg-soft-blue/30 px-3 py-1.5 rounded-full text-soft-text text-xs font-bold border border-soft-blue/20">
              <Database size={14} />
              <span>已加载 {totalFiles} 个资源</span>
            </div>
          )}
          {gameState === 'PLAYING' && (
            <div className="flex gap-2">
              {activeGame === 'CHARACTER_QUIZ' && (
                <label className="puppy-button bg-soft-blue text-soft-text py-2 px-4 text-sm cursor-pointer">
                  <Upload size={16} /> 上传照片
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleCharacterUpload} />
                </label>
              )}
              <button 
                onClick={() => setGameState('LOBBY')}
                className="puppy-button bg-soft-blue text-soft-text py-2 px-4 text-sm"
              >
                <Home size={16} /> 返回大厅
              </button>
            </div>
          )}
          {gameState === 'FINISH' && (
            <button 
              onClick={() => {
                setPlayers(players.map(p => ({ ...p, score: 0 })));
                setGameState('REGISTRATION');
              }}
              className="puppy-button bg-soft-pink text-soft-text py-2 px-4 text-sm"
            >
              重新开始
            </button>
          )}
        </div>
      </header>

      <main className="content-area max-w-5xl mx-auto w-full px-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {gameState === 'REGISTRATION' && (
            <motion.div
              key="reg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="puppy-card p-6 text-center border-soft-pink h-full flex flex-col justify-center"
            >
              <h2 className="text-3xl font-bold mb-6 text-soft-text">嘉宾登记 🐾</h2>
              <div className="flex gap-2 max-w-md mx-auto mb-6 shrink-0">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                  placeholder="输入嘉宾姓名..."
                  className="puppy-input flex-1 text-lg"
                />
                <button onClick={addPlayer} className="puppy-button">
                  添加
                </button>
              </div>

              <div className="space-y-2 mb-8 overflow-y-auto no-scrollbar max-h-[40vh]">
                {players.map((p) => (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    key={p.id}
                    className="flex items-center justify-between bg-white p-3 rounded-xl border-2 border-soft-pink/20"
                  >
                    <span className="font-bold text-lg flex items-center gap-3">
                      <span className="text-2xl">{p.emoji}</span>
                      <span className="text-soft-text">{p.name}</span>
                    </span>
                    <button 
                      onClick={() => setPlayers(players.filter(pl => pl.id !== p.id))}
                      className="text-red-400 hover:text-red-600 p-2"
                    >
                      删除
                    </button>
                  </motion.div>
                ))}
                {players.length < 2 && (
                  <p className="text-sm text-gray-400 italic">至少需要登记 2 位嘉宾 (目前: {players.length}/5)</p>
                )}
              </div>

              <div className="shrink-0">
                <button
                  disabled={players.length < 2}
                  onClick={() => setGameState('LOBBY')}
                  className="puppy-button text-xl px-10 py-4 shadow-xl"
                >
                  进入大厅 <ChevronRight size={24} />
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'LOBBY' && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col gap-4 overflow-hidden"
            >
              <div className="text-center shrink-0">
                <h2 className="text-3xl font-bold text-soft-text">游戏大厅 🦴</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 overflow-y-auto no-scrollbar pr-1 flex-1">
                {GAMES.map((game, idx) => (
                  <motion.div
                    key={game.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startGame(game.id)}
                    className="puppy-card p-4 cursor-pointer border-2 border-transparent hover:border-soft-pink transition-all group bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-soft-blue p-2 rounded-xl text-soft-text group-hover:bg-soft-pink transition-colors shadow-sm shrink-0">
                        {getIcon(game.icon)}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="text-lg font-bold text-soft-text truncate">{idx + 1}. {game.title}</h3>
                        <p className="text-gray-500 text-xs truncate">{game.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="shrink-0 flex justify-center pb-4">
                <button
                  onClick={finishGame}
                  className="puppy-button bg-soft-text text-white px-12 py-4 text-xl shadow-xl"
                >
                  结束游戏并结算 🏁
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'FINISH' && (
            <motion.div
              key="finish"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center p-8 bg-soft-cream rounded-extreme shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <Trophy size={400} className="absolute -top-20 -left-20 rotate-12" />
                <Trophy size={300} className="absolute -bottom-10 -right-10 -rotate-12" />
              </div>

              <div className="text-center space-y-6 z-10 w-full max-w-2xl">
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-9xl mb-4 animate-float"
                >
                  🏅
                </motion.div>
                <h2 className="text-5xl font-bold text-soft-text mb-8">最终得分汇总</h2>
                
                <div className="space-y-4 w-full">
                  {sortedPlayers.map((p, idx) => (
                    <motion.div
                      key={p.id}
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className={`flex items-center justify-between p-6 rounded-2xl shadow-lg ${
                        idx === 0 ? 'bg-white border-4 border-soft-pink scale-105' : 'bg-white/60'
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <span className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl ${
                          idx === 0 ? 'bg-soft-pink text-soft-text' : 'bg-soft-blue text-soft-text'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-4xl">{p.emoji}</span>
                        <span className="text-2xl font-bold text-soft-text">{p.name}</span>
                        {idx === 0 && <span className="bg-soft-pink text-soft-text text-xs px-3 py-1 rounded-full font-bold">MVP</span>}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-soft-text">{p.score}</span>
                        <span className="text-sm font-bold opacity-60">分</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'PLAYING' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-full overflow-hidden"
            >
              {renderGame()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Scoreboard 
        players={players} 
        onUpdateScore={updateScore} 
      />

      {/* Fixed Bottom Ranking Bar */}
      {players.length > 0 && gameState !== 'FINISH' && (
        <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-soft-text/10 z-40 p-2 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-6 overflow-x-auto no-scrollbar">
            {sortedPlayers.map((p, idx) => (
              <div key={p.id} className="flex items-center gap-2 whitespace-nowrap">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  idx === 0 ? 'bg-soft-pink text-soft-text' : 'bg-soft-blue text-soft-text'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-xl">{p.emoji}</span>
                <span className="font-bold text-soft-text text-sm">{p.name}</span>
                <span className="font-bold text-soft-text text-xl">{p.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
