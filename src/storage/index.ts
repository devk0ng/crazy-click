import { IScoreRepository } from './IScoreRepository';
import { LocalStorageRepository } from './LocalStorageRepository';
import { FirestoreRepository } from './FirestoreRepository';

export function createScoreRepository(): IScoreRepository {
  const dbType = import.meta.env.VITE_DB_TYPE;
  if (dbType === 'firestore') {
    return new FirestoreRepository();
  }
  return new LocalStorageRepository();
}

export type { IScoreRepository };
export type { ScoreEntry } from './IScoreRepository';
