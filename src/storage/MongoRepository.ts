import { IScoreRepository, ScoreEntry } from './IScoreRepository';
import { LEADERBOARD_TOP } from '../constants';

export class MongoRepository implements IScoreRepository {
  private readonly baseUrl: string;

  constructor() {
    // Vercel API endpoint — same origin in production, configurable for dev
    this.baseUrl = import.meta.env.VITE_API_URL ?? '/api';
  }

  async save(name: string, score: number): Promise<ScoreEntry> {
    const res = await fetch(`${this.baseUrl}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as any).error ?? `HTTP ${res.status}`);
    }

    return res.json() as Promise<ScoreEntry>;
  }

  async getTopScores(limit: number = LEADERBOARD_TOP): Promise<ScoreEntry[]> {
    const res = await fetch(`${this.baseUrl}/scores?limit=${limit}`);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return res.json() as Promise<ScoreEntry[]>;
  }
}
