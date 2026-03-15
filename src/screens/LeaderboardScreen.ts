import { ScoreEntry } from '../storage/IScoreRepository';

export class LeaderboardScreen {
  private el: HTMLElement;
  private onPlayAgain: () => void;
  private onGoHome: () => void;
  private highlightId: string | null = null;

  constructor(container: HTMLElement, onPlayAgain: () => void, onGoHome: () => void) {
    this.onPlayAgain = onPlayAgain;
    this.onGoHome = onGoHome;
    this.el = document.createElement('div');
    this.el.className = 'screen leaderboard-screen';
    container.appendChild(this.el);
    this.render([]);
  }

  setHighlight(id: string | null): void {
    this.highlightId = id;
  }

  render(entries: ScoreEntry[]): void {
    const listHtml = entries.length === 0
      ? `<div class="empty-leaderboard">No scores yet. Be the first!</div>`
      : entries.map((entry, i) => {
          const rank = i + 1;
          const rankClass = rank <= 3 ? ` rank-${rank}` : '';
          const itemClass = entry.id === this.highlightId ? ' my-score' : '';
          const topClass = rank <= 3 ? ` top-${rank}` : '';

          const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : String(rank);

          return `
            <div class="leaderboard-item${topClass}${itemClass}">
              <div class="rank-badge${rankClass}">${medal}</div>
              <div class="rank-name">${this.escapeHtml(entry.name)}</div>
              <div class="rank-score">${entry.score}</div>
            </div>
          `;
        }).join('');

    this.el.innerHTML = `
      <div class="leaderboard-header">
        <div class="leaderboard-title">Leaderboard</div>
        <div class="leaderboard-subtitle">Top ${entries.length > 0 ? entries.length : ''} Players</div>
      </div>
      <div class="leaderboard-list">
        ${listHtml}
      </div>
      <div class="leaderboard-footer">
        <button class="btn-primary" id="leaderboard-play-btn">Play Again</button>
        <button class="btn-ghost" id="leaderboard-home-btn">🏠 Home</button>
      </div>
    `;

    this.el.querySelector('#leaderboard-play-btn')!.addEventListener('click', () =>
      this.onPlayAgain(),
    );
    this.el.querySelector('#leaderboard-home-btn')!.addEventListener('click', () =>
      this.onGoHome(),
    );
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  show(): void {
    this.el.classList.add('active');
  }

  hide(): void {
    this.el.classList.remove('active');
  }
}
