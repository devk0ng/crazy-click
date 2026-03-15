import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.crazyclick.app',
  appName: 'Crazy Click',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
