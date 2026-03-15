const BEST_SCORE_KEY = 'crazy-click-best-score';

export class ResultScreen {
  private el: HTMLElement;
  private onRegister: (score: number) => void;
  private onPlayAgain: () => void;
  private onGoHome: () => void;
  private currentScore = 0;

  constructor(
    container: HTMLElement,
    onRegister: (score: number) => void,
    onPlayAgain: () => void,
    onGoHome: () => void,
  ) {
    this.onRegister = onRegister;
    this.onPlayAgain = onPlayAgain;
    this.onGoHome = onGoHome;
    this.el = document.createElement('div');
    this.el.className = 'screen result-screen';
    container.appendChild(this.el);
  }

  private getBestScore(): number {
    try {
      return parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10);
    } catch {
      return 0;
    }
  }

  setScore(score: number): void {
    this.currentScore = score;
    const prevBest = this.getBestScore();
    const isNewBest = score > prevBest;

    // Update best score in localStorage
    if (isNewBest) {
      try {
        localStorage.setItem(BEST_SCORE_KEY, String(score));
      } catch {
        // ignore
      }
    }

    const bestToShow = isNewBest ? score : prevBest;

    this.el.innerHTML = `
      <div class="result-label">GAME OVER</div>
      <div class="result-score">${score}</div>
      <div class="result-score-label">TAPS IN 5 SECONDS</div>
      ${
        isNewBest
          ? `<div class="result-new-best">🏆 New Best Record!</div>`
          : `<div class="result-best">Best: ${bestToShow}</div>`
      }
      <div class="result-buttons">
        <button class="btn-primary" id="result-register-btn">📋 Register to Leaderboard</button>
        <button class="btn-secondary" id="result-again-btn">Play Again</button>
        <button class="btn-ghost" id="result-home-btn">🏠 Home</button>
      </div>
    `;

    this.el.querySelector('#result-register-btn')!.addEventListener('click', () =>
      this.onRegister(this.currentScore),
    );
    this.el.querySelector('#result-again-btn')!.addEventListener('click', () =>
      this.onPlayAgain(),
    );
    this.el.querySelector('#result-home-btn')!.addEventListener('click', () =>
      this.onGoHome(),
    );
  }

  show(): void {
    this.el.classList.add('active');
  }

  hide(): void {
    this.el.classList.remove('active');
  }
}
