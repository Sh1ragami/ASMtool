export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["vuetify-nuxt-module"],
  plugins: [
    "~/plugins/firebase.ts", // プラグインのパスを設定
  ],
  nitro: {
    firebase: {
      gen: 2,
    },
  },
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      resasApiKey: process.env.NUXT_PUBLIC_RESAS_API_KEY,
      apiKey: process.env.NUXT_PUBLIC_FB_API_KEY,
      authDomain: process.env.NUXT_PUBLIC_FB_AUTH_DOMAIN,
      projectId: process.env.NUXT_PUBLIC_FB_PROJECT_ID,
      storageBucket: process.env.NUXT_PUBLIC_FB_STORAGE_BUCKET,
      messagingSenderId: process.env.NUXT_PUBLIC_FB_MESSAGING_SENDER_ID,
      appId: process.env.NUXT_PUBLIC_FB_APP_ID,
      measurementId: process.env.NUXT_PUBLIC_FB_MEASUREMENT_ID,
    },
  },
});
