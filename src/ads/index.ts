import { IAdService } from './IAdService';
import { MockAdService } from './MockAdService';
import { CapacitorAdMobService } from './CapacitorAdMobService';

export function createAdService(): IAdService {
  // Check if running in Capacitor native environment
  if ((window as any).Capacitor?.isNativePlatform?.()) {
    return new CapacitorAdMobService();
  }
  return new MockAdService();
}

export type { IAdService };
