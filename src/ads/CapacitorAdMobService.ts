import { IAdService } from './IAdService';

/**
 * Production AdMob implementation using Capacitor.
 * Requires @capacitor-community/admob to be installed and configured.
 * TODO: Install @capacitor-community/admob and implement fully.
 */
export class CapacitorAdMobService implements IAdService {
  async preload(): Promise<void> {
    // TODO: Initialize AdMob and load rewarded ad
    // const { AdMob } = await import('@capacitor-community/admob');
    // await AdMob.initialize({ requestTrackingAuthorization: true });
    // await AdMob.prepareRewardVideoAd({
    //   adId: 'YOUR_REWARDED_AD_UNIT_ID',
    //   isTesting: false,
    // });
    throw new Error('Not implemented: CapacitorAdMobService.preload');
  }

  async showRewardedAd(): Promise<{ watched: boolean }> {
    // TODO: Show rewarded ad via AdMob
    // const { AdMob } = await import('@capacitor-community/admob');
    // const result = await AdMob.showRewardVideoAd();
    // return { watched: result.type === 'Rewarded' };
    throw new Error('Not implemented: CapacitorAdMobService.showRewardedAd');
  }
}
