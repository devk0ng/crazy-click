export interface IAdService {
  showRewardedAd(): Promise<{ watched: boolean }>;
  preload(): Promise<void>;
}
