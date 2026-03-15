export class RippleEffect {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  create(x: number, y: number): void {
    const size = 60;
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;

    this.container.appendChild(ripple);

    setTimeout(() => {
      if (this.container.contains(ripple)) {
        this.container.removeChild(ripple);
      }
    }, 600);
  }
}
