const BEST_SCORE_KEY = 'crazy-click-best-score';

export class IdleScreen {
  private el: HTMLElement;
  private onPlay: () => void;
  private onLeaderboard: () => void;

  constructor(container: HTMLElement, onPlay: () => void, onLeaderboard: () => void) {
    this.onPlay = onPlay;
    this.onLeaderboard = onLeaderboard;
    this.el = document.createElement('div');
    this.el.className = 'screen idle-screen';
    container.appendChild(this.el);
    this.render(0, 5);
  }

  private getBestScore(): number {
    try {
      return parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10);
    } catch {
      return 0;
    }
  }

  static updateBestScore(score: number): void {
    try {
      const current = parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10);
      if (score > current) {
        localStorage.setItem(BEST_SCORE_KEY, String(score));
      }
    } catch {
      // ignore
    }
  }

  private render(playsToday: number, limit: number): void {
    const best = this.getBestScore();
    const remaining = Math.max(0, limit - playsToday);

    this.el.innerHTML = `
      <div class="idle-title">Crazy Click</div>
      <div class="idle-subtitle">Tap as fast as you can!</div>
      <div class="idle-stats">
        <div class="stat-row">
          <span class="stat-label">Best Score</span>
          <span class="stat-value">${best > 0 ? best : '-'}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Plays Today</span>
          <span class="stat-value">${playsToday} / ${limit}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Remaining</span>
          <span class="stat-value" style="color: ${remaining > 0 ? '#00f5ff' : '#ff006e'}">${remaining}</span>
        </div>
      </div>
      <button class="play-btn" id="idle-play-btn">PLAY!</button>
      <button class="leaderboard-btn" id="idle-leaderboard-btn">🏆 Leaderboard</button>
    `;

    this.el.querySelector('#idle-play-btn')!.addEventListener('click', () => this.onPlay());
    this.el.querySelector('#idle-leaderboard-btn')!.addEventListener('click', () => this.onLeaderboard());
  }

  update(playsToday: number, limit: number): void {
    this.render(playsToday, limit);
  }

  show(): void {
    this.el.classList.add('active');
  }

  hide(): void {
    this.el.classList.remove('active');
  }
}
