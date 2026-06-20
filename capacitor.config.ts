import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.gerrydekens.m81wallet',
  appName: 'm81 Wallet',
  bundledWebRuntime: false,
  webDir: 'www',
  plugins: {
    PushNotifications: {
      presentationOptions: ['alert']
    },
    SplashScreen: {
      launchAutoHide: false,
      androidSplashResourceName: 'screen'
    }
  },
  server: {
    androidScheme: 'http'
  },
  android: {
    allowMixedContent: true
  }
}

export default config