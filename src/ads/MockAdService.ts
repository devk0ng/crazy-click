import { IAdService } from './IAdService';

export class MockAdService implements IAdService {
  async preload(): Promise<void> {
    // Nothing to preload for mock
  }

  showRewardedAd(): Promise<{ watched: boolean }> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'ad-modal-overlay';

      const totalSeconds = 3;
      let remaining = totalSeconds;

      overlay.innerHTML = `
        <div class="ad-modal">
          <div class="ad-modal-title">Watch Ad to Continue</div>
          <div class="ad-modal-desc">Watch a short ad to unlock more plays!</div>
          <div class="ad-countdown" id="ad-countdown">${remaining}</div>
          <div class="ad-progress">
            <div class="ad-progress-bar" id="ad-progress-bar" style="width: 100%"></div>
          </div>
          <button class="ad-skip-btn" id="ad-skip-btn" disabled>Skip Ad</button>
        </div>
      `;

      document.body.appendChild(overlay);

      const countdownEl = overlay.querySelector('#ad-countdown') as HTMLElement;
      const progressBar = overlay.querySelector('#ad-progress-bar') as HTMLElement;
      const skipBtn = overlay.querySelector('#ad-skip-btn') as HTMLButtonElement;

      const interval = setInterval(() => {
        remaining--;
        if (countdownEl) countdownEl.textContent = remaining.toString();
        const pct = (remaining / totalSeconds) * 100;
        if (progressBar) progressBar.style.width = `${pct}%`;

        if (remaining <= 0) {
          clearInterval(interval);
          skipBtn.disabled = false;
          skipBtn.classList.add('enabled');
          skipBtn.textContent = 'Close & Claim Reward';
          if (countdownEl) countdownEl.textContent = '🎉';
        }
      }, 1000);

      skipBtn.addEventListener('click', () => {
        if (!skipBtn.disabled) {
          clearInterval(interval);
          document.body.removeChild(overlay);
          resolve({ watched: true });
        }
      });

      // Auto-close after completion
      setTimeout(() => {
        clearInterval(interval);
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
        resolve({ watched: true });
      }, (totalSeconds + 1) * 1000);
    });
  }
}
