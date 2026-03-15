import { RippleEffect } from './RippleEffect';
import { ParticleEffect } from './ParticleEffect';
import { AudioManager } from '../audio/AudioManager';

export class EffectEngine {
  private ripple: RippleEffect;
  private particle: ParticleEffect;
  private audio: AudioManager;

  constructor(tapContainer: HTMLElement, canvas: HTMLCanvasElement) {
    this.ripple = new RippleEffect(tapContainer);
    this.particle = new ParticleEffect(canvas);
    this.audio = new AudioManager();
  }

  onTap(x: number, y: number): void {
    this.ripple.create(x, y);
    this.particle.burst(x, y);
    this.audio.playTap();
  }

  onCountdown(): void {
    this.audio.playCountdown();
  }

  onGo(): void {
    this.audio.playGo();
  }

  onGameOver(): void {
    this.audio.playGameOver();
  }
}
