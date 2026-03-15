import { GAME_DURATION } from '../constants';
import { EffectEngine } from '../effects/EffectEngine';

export class PlayScreen {
  private el: HTMLElement;
  private tapArea!: HTMLElement;
  private scoreEl!: HTMLElement;
  private timerEl!: HTMLElement;
  private progressBar!: HTMLElement;
  private effects: EffectEngine;
  private count = 0;
  private startTime = 0;
  private timerInterval: number | null = null;
  private onGameEnd: (score: number) => void;
  private boundTouchStart: (e: TouchEvent) => void;
  private boundMouseDown: (e: MouseEvent) => void;
  private isActive = false;

  constructor(
    container: HTMLElement,
    canvas: HTMLCanvasElement,
    onGameEnd: (score: number) => void,
  ) {
    this.onGameEnd = onGameEnd;
    this.el = document.createElement('div');
    this.el.className = 'screen play-screen';
    container.appendChild(this.el);

    this.buildDOM();

    this.effects = new EffectEngine(this.tapArea, canvas);

    this.boundTouchStart = this.handleTouch.bind(this);
    this.boundMouseDown = this.handleMouse.bind(this);
  }

  private buildDOM(): void {
    this.el.innerHTML = `
      <div class="play-header">
        <div class="score-counter" id="score-counter">0</div>
        <div class="timer-display" id="timer-display">5.0</div>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" id="progress-bar" style="width: 100%"></div>
      </div>
      <div class="tap-area" id="tap-area">
        <div class="tap-hint">TAP!</div>
      </div>
    `;

    this.scoreEl = this.el.querySelector('#score-counter')!;
    this.timerEl = this.el.querySelector('#timer-display')!;
    this.progressBar = this.el.querySelector('#progress-bar')!;
    this.tapArea = this.el.querySelector('#tap-area')!;
  }

  private handleTouch(e: TouchEvent): void {
    e.preventDefault();
    if (!this.isActive) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const rect = this.tapArea.getBoundingClientRect();
      const x = t.clientX - rect.left;
      const y = t.clientY - rect.top;
      this.registerTap(x, y);
    }
  }

  private handleMouse(e: MouseEvent): void {
    e.preventDefault();
    if (!this.isActive) return;
    const rect = this.tapArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.registerTap(x, y);
  }

  private registerTap(x: number, y: number): void {
    this.count++;
    this.effects.onTap(x, y);
    this.scoreEl.textContent = String(this.count);
    this.scoreEl.classList.remove('bump');
    // Force reflow to restart animation
    void (this.scoreEl as HTMLElement).offsetWidth;
    this.scoreEl.classList.add('bump');
  }

  startGame(): void {
    this.count = 0;
    this.isActive = true;
    this.startTime = Date.now();
    this.scoreEl.textContent = '0';
    this.timerEl.textContent = '5.0';
    this.timerEl.classList.remove('urgent');
    this.progressBar.style.width = '100%';
    this.progressBar.style.background = 'linear-gradient(90deg, #00f5ff, #7b2fff)';

    this.tapArea.addEventListener('touchstart', this.boundTouchStart, { passive: false });
    this.tapArea.addEventListener('mousedown', this.boundMouseDown);

    this.timerInterval = window.setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      const remaining = Math.max(0, GAME_DURATION - elapsed);
      const pct = (remaining / GAME_DURATION) * 100;

      this.timerEl.textContent = (remaining / 1000).toFixed(1);
      this.progressBar.style.width = `${pct}%`;

      if (remaining <= 1500) {
        this.timerEl.classList.add('urgent');
        this.progressBar.style.background = 'linear-gradient(90deg, #ff006e, #ff6b00)';
      }

      if (remaining <= 0) {
        this.endGame();
      }
    }, 50);
  }

  private endGame(): void {
    if (!this.isActive) return;
    this.isActive = false;

    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.tapArea.removeEventListener('touchstart', this.boundTouchStart);
    this.tapArea.removeEventListener('mousedown', this.boundMouseDown);

    this.effects.onGameOver();
    this.timerEl.textContent = '0.0';
    this.progressBar.style.width = '0%';

    setTimeout(() => {
      this.onGameEnd(this.count);
    }, 300);
  }

  show(): void {
    this.el.classList.add('active');
  }

  hide(): void {
    this.isActive = false;
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.tapArea.removeEventListener('touchstart', this.boundTouchStart);
    this.tapArea.removeEventListener('mousedown', this.boundMouseDown);
    this.el.classList.remove('active');
  }
}
