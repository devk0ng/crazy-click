interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

const COLORS = ['#00f5ff', '#7b2fff', '#ff006e', '#ffffff', '#ffd700'];

export class ParticleEffect {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animFrameId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(x: number, y: number): void {
    const count = Math.floor(Math.random() * 5) + 8; // 8-12 particles
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 4 + 2;
      const maxLife = 400;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 4 + 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 1,
        life: 0,
        maxLife,
      });
    }

    if (this.animFrameId === null) {
      this.animate();
    }
  }

  private animate(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles = this.particles.filter((p) => p.life < p.maxLife);

    for (const p of this.particles) {
      p.life += 16;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // gravity
      p.alpha = 1 - p.life / p.maxLife;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animFrameId = requestAnimationFrame(() => this.animate());
    } else {
      this.animFrameId = null;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
