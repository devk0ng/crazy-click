import { IScoreRepository } from './IScoreRepository';
import { LocalStorageRepository } from './LocalStorageRepository';
import { MongoRepository } from './MongoRepository';

export function createScoreRepository(): IScoreRepository {
  const dbType = import.meta.env.VITE_DB_TYPE;
  if (dbType === 'mongo') {
    return new MongoRepository();
  }
  return new LocalStorageRepository();
}

export type { IScoreRepository };
export type { ScoreEntry } from './IScoreRepository';
