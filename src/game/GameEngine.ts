import { GamePhase } from './GameState';
import { COUNTDOWN_START, DAILY_PLAY_LIMIT, LEADERBOARD_TOP } from '../constants';
import { IdleScreen } from '../screens/IdleScreen';
import { PlayScreen } from '../screens/PlayScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import { createAdService } from '../ads/index';
import { createScoreRepository } from '../storage/index';
import { DailyLimitTracker } from '../utils/DailyLimitTracker';
import { IAdService } from '../ads/IAdService';
import { IScoreRepository } from '../storage/IScoreRepository';
import { AudioManager } from '../audio/AudioManager';

export class GameEngine {
  private _phase: GamePhase = 'IDLE';

  get currentPhase(): GamePhase {
    return this._phase;
  }
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;

  private idleScreen!: IdleScreen;
  private playScreen!: PlayScreen;
  private resultScreen!: ResultScreen;
  private leaderboardScreen!: LeaderboardScreen;

  private adService: IAdService;
  private scoreRepo: IScoreRepository;
  private dailyTracker: DailyLimitTracker;
  private audio: AudioManager;

  private lastScore = 0;

  constructor(container: HTMLElement, canvas: HTMLCanvasElement) {
    this.container = container;
    this.canvas = canvas;
    this.adService = createAdService();
    this.scoreRepo = createScoreRepository();
    this.dailyTracker = new DailyLimitTracker();
    this.audio = new AudioManager();

    this.initScreens();
    this.adService.preload().catch(() => {});
  }

  private initScreens(): void {
    this.idleScreen = new IdleScreen(
      this.container,
      () => this.onPlayPressed(),
      () => this.goToLeaderboard(),
    );

    this.playScreen = new PlayScreen(
      this.container,
      this.canvas,
      (score) => this.onGameEnd(score),
    );

    this.resultScreen = new ResultScreen(
      this.container,
      (score) => this.onRegisterToLeaderboard(score),
      () => this.onPlayAgainFromResult(),
      () => this.setPhase('IDLE'),
    );

    this.leaderboardScreen = new LeaderboardScreen(
      this.container,
      () => this.onPlayAgainFromLeaderboard(),
      () => this.setPhase('IDLE'),
    );
  }

  start(): void {
    this.setPhase('IDLE');
  }

  private setPhase(phase: GamePhase): void {
    this._phase = phase;

    // Hide all screens
    this.idleScreen.hide();
    this.playScreen.hide();
    this.resultScreen.hide();
    this.leaderboardScreen.hide();

    switch (phase) {
      case 'IDLE':
        this.idleScreen.update(this.dailyTracker.getPlaysToday(), DAILY_PLAY_LIMIT);
        this.idleScreen.show();
        break;

      case 'COUNTDOWN':
        this.runCountdown();
        break;

      case 'PLAYING':
        this.playScreen.show();
        this.playScreen.startGame();
        break;

      case 'RESULT':
        this.resultScreen.setScore(this.lastScore);
        this.resultScreen.show();
        break;

      case 'AD_GATE':
        this.runAdGate();
        break;

      case 'LEADERBOARD':
        this.loadAndShowLeaderboard();
        break;
    }
  }

  private onPlayPressed(): void {
    if (this.dailyTracker.hasReachedLimit()) {
      this.setPhase('AD_GATE');
    } else {
      this.setPhase('COUNTDOWN');
    }
  }

  private async runAdGate(): Promise<void> {
    try {
      const result = await this.adService.showRewardedAd();
      if (result.watched) {
        this.setPhase('COUNTDOWN');
      } else {
        this.setPhase('IDLE');
      }
    } catch {
      this.setPhase('IDLE');
    }
  }

  private runCountdown(): void {
    // Show a full-screen countdown overlay
    const overlay = document.createElement('div');
    overlay.className = 'screen active countdown-screen';
    overlay.style.zIndex = '100';
    this.container.appendChild(overlay);

    const numberEl = document.createElement('div');
    overlay.appendChild(numberEl);

    let count = COUNTDOWN_START;

    const showNumber = (n: number | string, isGo: boolean) => {
      numberEl.className = isGo ? 'countdown-go' : 'countdown-number';
      numberEl.textContent = String(n);
      // Reset animation
      numberEl.style.animation = 'none';
      void numberEl.offsetWidth;
      numberEl.style.animation = '';

      if (!isGo) {
        this.audio.playCountdown();
      } else {
        this.audio.playGo();
      }
    };

    showNumber(count, false);

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        showNumber(count, false);
      } else if (count === 0) {
        showNumber('GO!', true);
      } else {
        clearInterval(interval);
        if (this.container.contains(overlay)) {
          this.container.removeChild(overlay);
        }
        this.setPhase('PLAYING');
      }
    }, 900);
  }

  private onGameEnd(score: number): void {
    this.lastScore = score;
    this.dailyTracker.increment();
    IdleScreen.updateBestScore(score);
    this.setPhase('RESULT');
  }

  private async onRegisterToLeaderboard(score: number): Promise<void> {
    try {
      const result = await this.adService.showRewardedAd();
      if (result.watched) {
        this.showNameInput(score);
      }
      // If not watched, just stay on result screen
    } catch {
      // Stay on result screen on error
    }
  }

  private showNameInput(score: number): void {
    const overlay = document.createElement('div');
    overlay.className = 'name-modal-overlay';
    overlay.innerHTML = `
      <div class="name-modal">
        <div class="name-modal-title">Register Your Score</div>
        <div class="name-modal-score">${score}</div>
        <input
          class="name-input"
          id="name-input-field"
          type="text"
          placeholder="Enter your name"
          maxlength="20"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="words"
          spellcheck="false"
        />
        <button class="name-submit-btn" id="name-submit-btn" disabled>Register</button>
        <button class="name-cancel-btn" id="name-cancel-btn">Cancel</button>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector('#name-input-field') as HTMLInputElement;
    const submitBtn = overlay.querySelector('#name-submit-btn') as HTMLButtonElement;
    const cancelBtn = overlay.querySelector('#name-cancel-btn') as HTMLButtonElement;

    input.addEventListener('input', () => {
      submitBtn.disabled = input.value.trim().length === 0;
    });

    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    submitBtn.addEventListener('click', async () => {
      const name = input.value.trim();
      if (!name) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';

      try {
        const entry = await this.scoreRepo.save(name, score);
        document.body.removeChild(overlay);
        this.leaderboardScreen.setHighlight(entry.id);
        this.setPhase('LEADERBOARD');
      } catch (e) {
        console.error('Failed to save score:', e);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
      }
    });

    // Focus input after a short delay to avoid keyboard issues
    setTimeout(() => input.focus(), 100);
  }

  private onPlayAgainFromResult(): void {
    if (this.dailyTracker.hasReachedLimit()) {
      this.setPhase('AD_GATE');
    } else {
      this.setPhase('COUNTDOWN');
    }
  }

  private onPlayAgainFromLeaderboard(): void {
    this.leaderboardScreen.setHighlight(null);
    if (this.dailyTracker.hasReachedLimit()) {
      this.setPhase('AD_GATE');
    } else {
      this.setPhase('COUNTDOWN');
    }
  }

  private async goToLeaderboard(): Promise<void> {
    this.leaderboardScreen.setHighlight(null);
    await this.loadAndShowLeaderboard();
  }

  private async loadAndShowLeaderboard(): Promise<void> {
    this.leaderboardScreen.show();
    try {
      const entries = await this.scoreRepo.getTopScores(LEADERBOARD_TOP);
      this.leaderboardScreen.render(entries);
    } catch (e) {
      console.error('Failed to load leaderboard:', e);
      this.leaderboardScreen.render([]);
    }
  }
}
