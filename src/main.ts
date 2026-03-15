import { GameEngine } from './game/GameEngine';

// Prevent default touch behaviors (scroll, zoom, context menu)
document.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
document.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });
document.addEventListener('contextmenu', (e) => e.preventDefault());

const app = document.getElementById('app');
const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;

if (!app || !canvas) {
  throw new Error('Required DOM elements not found');
}

const engine = new GameEngine(app, canvas);
engine.start();
