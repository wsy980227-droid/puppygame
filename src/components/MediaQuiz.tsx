import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Video } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

interface MediaQuizProps {
  onScore: (playerId: string) => void;
  players: { id: string; name: string; emoji: string }[];
}

export const MediaQuiz: React.FC<MediaQuizProps> = ({ onScore, players }) => {
  const { files, addFile } = useGameStore();
  const gameFiles = files['MEDIA_QUIZ'];
  
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isRevealed, setIsRevealed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-detect existing files
  useEffect(() => {
    if (gameFiles.length > 0 && currentIndex === -1) {
      // Stay in idle state but show count
    }
  }, [gameFiles.length, currentIndex]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (uploadedFiles) {
      for (const file of Array.from(uploadedFiles) as File[]) {
        await addFile('MEDIA_QUIZ', file);
      }
    }
  };

  const startVideo = () => {
    if (gameFiles.length === 0) return;
    const nextIndex = Math.floor(Math.random() * gameFiles.length);
    setCurrentIndex(nextIndex);
    setIsRevealed(false);
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-xl font-bold">3. 影视 Quiz</h3>
        <label className="puppy-button bg-soft-blue text-xs py-1.5 px-3 cursor-pointer">
          <Upload size={14} /> 上传视频
          <input type="file" multiple accept="video/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <div className="puppy-card flex-1 flex flex-col items-center justify-center p-4 min-h-0 relative overflow-hidden bg-white shadow-xl">
        {currentIndex === -1 ? (
          <div className="text-center space-y-4">
            <Video size={64} className="mx-auto text-soft-pink animate-float" />
            <p className="text-soft-text">已上传 {gameFiles.length} 个片段</p>
            <button onClick={startVideo} disabled={gameFiles.length === 0} className="puppy-button">
              开始挑战
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 relative rounded-extreme overflow-hidden bg-soft-bg border-2 border-soft-text/5 flex flex-col items-center justify-center p-8 text-center">
              {!isRevealed ? (
                <div className="space-y-8">
                  <div className="text-4xl font-priority text-soft-text leading-relaxed">
                    "{gameFiles[currentIndex].file.name.split('.')[0]}"
                  </div>
                  <button 
                    onClick={() => setIsRevealed(true)}
                    className="puppy-button bg-soft-pink text-xl px-12 py-4 shadow-xl"
                  >
                    揭晓答案
                  </button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={gameFiles[currentIndex].url}
                  autoPlay
                  controls
                  className="w-full h-full object-contain rounded-extreme"
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full shrink-0 overflow-y-auto no-scrollbar max-h-[40%]">
              {players.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    onScore(p.id);
                    setCurrentIndex(-1);
                    setIsRevealed(false);
                  }}
                  className="puppy-button bg-soft-pink hover:bg-soft-blue py-4 text-lg flex flex-col gap-1 shadow-md"
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <span>{p.name} 抢答正确</span>
                </button>
              ))}
              <button 
                onClick={() => {
                  setCurrentIndex(-1);
                  setIsRevealed(false);
                }}
                className="puppy-button bg-white text-gray-400 border-2 border-gray-200 py-4 text-lg shadow-md"
              >
                跳过此题
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
