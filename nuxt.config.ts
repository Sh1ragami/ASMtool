export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'vuetify-nuxt-module'
  ],
  nitro: {
    firebase: {
      gen:2
    }
  }
})
