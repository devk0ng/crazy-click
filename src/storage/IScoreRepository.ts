export interface ScoreEntry {
  id: string;
  name: string;
  score: number;
  createdAt: number;
}

export interface IScoreRepository {
  save(name: string, score: number): Promise<ScoreEntry>;
  getTopScores(limit: number): Promise<ScoreEntry[]>;
}
