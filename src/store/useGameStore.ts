import { create } from 'zustand';
import { Player, GameType } from '../types';
import { saveFileToDB, getFilesFromDB, clearDB, deleteFileFromDB } from '../utils/db';

interface GameFile {
  id: string;
  gameId: GameType;
  url: string;
  file: File;
}

interface GameStore {
  players: Player[];
  gameState: 'REGISTRATION' | 'LOBBY' | 'PLAYING' | 'FINISH';
  activeGame: GameType | null;
  files: Record<GameType, GameFile[]>;
  completedFileIds: Record<GameType, string[]>;
  
  // Player Actions
  setPlayers: (players: Player[]) => void;
  updateScore: (id: string, delta: number) => void;
  
  // Game State Actions
  setGameState: (state: 'REGISTRATION' | 'LOBBY' | 'PLAYING' | 'FINISH') => void;
  setActiveGame: (gameId: GameType | null) => void;
  
  // File Actions
  addFile: (gameId: GameType, file: File) => Promise<void>;
  removeFile: (gameId: GameType, id: string) => Promise<void>;
  loadFilesFromDB: () => Promise<void>;
  clearAllFiles: () => Promise<void>;
  markFileAsCompleted: (gameId: GameType, id: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  players: [],
  gameState: 'REGISTRATION',
  activeGame: null,
  files: {
    CHARACTER_QUIZ: [],
    MUSIC_QUIZ: [],
    MEDIA_QUIZ: [],
    LETTER_HUNT: [],
    PROCREATE_GUESS: [],
    MEMORY_CHALLENGE: [],
    PET_FINDER: [],
  },
  completedFileIds: {
    CHARACTER_QUIZ: [],
    MUSIC_QUIZ: [],
    MEDIA_QUIZ: [],
    LETTER_HUNT: [],
    PROCREATE_GUESS: [],
    MEMORY_CHALLENGE: [],
    PET_FINDER: [],
  },

  setPlayers: (players) => set({ players }),
  
  updateScore: (id, delta) => set((state) => ({
    players: state.players.map((p) => 
      p.id === id ? { ...p, score: Math.max(0, p.score + delta) } : p
    ),
  })),

  setGameState: (state) => set({ gameState: state }),
  
  setActiveGame: (gameId) => set({ activeGame: gameId }),

  addFile: async (gameId, file) => {
    const id = `${gameId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const url = URL.createObjectURL(file);
    
    // Save to IndexedDB
    await saveFileToDB(id, gameId, file);
    
    set((state) => ({
      files: {
        ...state.files,
        [gameId]: [...state.files[gameId], { id, gameId, url, file }],
      },
    }));
  },

  removeFile: async (gameId, id) => {
    const fileToRemove = get().files[gameId].find(f => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    
    // Remove from IndexedDB
    await deleteFileFromDB(id);
    
    set((state) => ({
      files: {
        ...state.files,
        [gameId]: state.files[gameId].filter((f) => f.id !== id),
      },
    }));
  },

  loadFilesFromDB: async () => {
    const allFiles = await getFilesFromDB();
    const filesMap: Record<GameType, GameFile[]> = {
      CHARACTER_QUIZ: [],
      MUSIC_QUIZ: [],
      MEDIA_QUIZ: [],
      LETTER_HUNT: [],
      PROCREATE_GUESS: [],
      MEMORY_CHALLENGE: [],
      PET_FINDER: [],
    };

    allFiles.forEach(f => {
      const url = URL.createObjectURL(f.file);
      filesMap[f.gameId as GameType].push({
        id: f.id,
        gameId: f.gameId as GameType,
        url,
        file: f.file,
      });
    });

    set({ files: filesMap });
  },

  clearAllFiles: async () => {
    const { files } = get();
    Object.values(files).flat().forEach(f => {
      URL.revokeObjectURL(f.url);
    });
    
    await clearDB();
    
    set({
      files: {
        CHARACTER_QUIZ: [],
        MUSIC_QUIZ: [],
        MEDIA_QUIZ: [],
        LETTER_HUNT: [],
        PROCREATE_GUESS: [],
        MEMORY_CHALLENGE: [],
        PET_FINDER: [],
      },
      completedFileIds: {
        CHARACTER_QUIZ: [],
        MUSIC_QUIZ: [],
        MEDIA_QUIZ: [],
        LETTER_HUNT: [],
        PROCREATE_GUESS: [],
        MEMORY_CHALLENGE: [],
        PET_FINDER: [],
      },
    });
  },

  markFileAsCompleted: (gameId, id) => set((state) => ({
    completedFileIds: {
      ...state.completedFileIds,
      [gameId]: [...state.completedFileIds[gameId], id],
    },
  })),
}));
