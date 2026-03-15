import { IScoreRepository, ScoreEntry } from './IScoreRepository';

const STORAGE_KEY = 'crazy-click-scores';

export class LocalStorageRepository implements IScoreRepository {
  private loadAll(): ScoreEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as ScoreEntry[];
    } catch {
      return [];
    }
  }

  private saveAll(entries: ScoreEntry[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  async save(name: string, score: number): Promise<ScoreEntry> {
    const entry: ScoreEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: name.trim() || 'Anonymous',
      score,
      createdAt: Date.now(),
    };

    const all = this.loadAll();
    all.push(entry);
    // Sort descending by score, then by createdAt ascending (earlier = better)
    all.sort((a, b) => b.score - a.score || a.createdAt - b.createdAt);
    this.saveAll(all);
    return entry;
  }

  async getTopScores(limit: number): Promise<ScoreEntry[]> {
    const all = this.loadAll();
    all.sort((a, b) => b.score - a.score || a.createdAt - b.createdAt);
    return all.slice(0, limit);
  }
}
