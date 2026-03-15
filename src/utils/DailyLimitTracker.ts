import { DAILY_PLAY_LIMIT } from '../constants';

function getTodayKey(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `crazy-click-plays-${yyyy}-${mm}-${dd}`;
}

export class DailyLimitTracker {
  private key: string;

  constructor() {
    this.key = getTodayKey();
  }

  getPlaysToday(): number {
    try {
      const val = localStorage.getItem(this.key);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  }

  increment(): void {
    try {
      const current = this.getPlaysToday();
      localStorage.setItem(this.key, String(current + 1));
    } catch {
      // Ignore storage errors
    }
  }

  hasReachedLimit(): boolean {
    return this.getPlaysToday() >= DAILY_PLAY_LIMIT;
  }

  getRemainingPlays(): number {
    return Math.max(0, DAILY_PLAY_LIMIT - this.getPlaysToday());
  }
}
