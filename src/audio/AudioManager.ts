export class AudioManager {
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    // Resume if suspended (browser autoplay policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainStart = 0.3,
    gainEnd = 0,
    startDelay = 0,
  ): void {
    try {
      const ctx = this.getCtx();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + startDelay);

      gainNode.gain.setValueAtTime(gainStart, ctx.currentTime + startDelay);
      gainNode.gain.exponentialRampToValueAtTime(
        Math.max(gainEnd, 0.001),
        ctx.currentTime + startDelay + duration / 1000,
      );

      oscillator.start(ctx.currentTime + startDelay);
      oscillator.stop(ctx.currentTime + startDelay + duration / 1000 + 0.01);
    } catch {
      // Ignore audio errors silently
    }
  }

  /** Quick tap feedback: 800Hz with fast decay */
  playTap(): void {
    this.playTone(800, 80, 'sine', 0.15, 0);
  }

  /** Countdown beep: medium pitched */
  playCountdown(): void {
    this.playTone(440, 150, 'square', 0.2, 0);
  }

  /** GO sound: higher pitch beep */
  playGo(): void {
    this.playTone(880, 200, 'sine', 0.3, 0);
    this.playTone(1320, 200, 'sine', 0.2, 0, 0.1);
  }

  /** Game over: descending tone */
  playGameOver(): void {
    this.playTone(600, 200, 'sine', 0.3, 0.1);
    this.playTone(400, 200, 'sine', 0.25, 0.1, 0.2);
    this.playTone(250, 400, 'sine', 0.2, 0, 0.4);
  }
}
