import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'puppy-game-db';
const STORE_NAME = 'files';

interface FileData {
  id: string;
  gameId: string;
  file: File;
  timestamp: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

export const saveFileToDB = async (id: string, gameId: string, file: File) => {
  const db = await getDB();
  await db.put(STORE_NAME, {
    id,
    gameId,
    file,
    timestamp: Date.now(),
  });
};

export const getFilesFromDB = async (gameId?: string): Promise<FileData[]> => {
  const db = await getDB();
  const allFiles = await db.getAll(STORE_NAME) as FileData[];
  if (gameId) {
    return allFiles.filter(f => f.gameId === gameId);
  }
  return allFiles;
};

export const deleteFileFromDB = async (id: string) => {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
};

export const clearDB = async () => {
  const db = await getDB();
  await db.clear(STORE_NAME);
};
