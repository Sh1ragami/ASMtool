import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

export default defineNuxtPlugin((nuxtApp) => {
  let defaultTheme = 'dark'; // デフォルトはダークテーマ

  if (import.meta.client) {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    defaultTheme = isDarkMode ? 'dark' : 'light';
  }

  const vuetify = createVuetify({
    theme: {
      defaultTheme,
      themes: {
        light: {
          dark: false,
          colors: {
            background: '#FFFFFF',
            surface: '#F8F9FA',
            primary: '#1976D2',
            secondary: '#424242',
            error: '#FF5252',
          },
        },
        dark: {
          dark: true,
          colors: {
            background: '#121212',
            surface: '#1E1E1E',
            primary: '#90CAF9',
            secondary: '#BDBDBD',
              error: '#FF867C',
            rank: '#aaaaaaa',
          },
        },
      },
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);

  // ダークモード/ライトモードの切り替え
  if (process.client) {
    const toggleDarkMode = () => {
      vuetify.framework.theme.dark = !vuetify.framework.theme.dark;
    };

    // ダークモード/ライトモードの初期値を保存
    const savedTheme = localStorage.getItem('savedTheme');
    if (savedTheme === 'dark') {
      vuetify.framework.theme.dark = true;
    } else if (savedTheme === 'light') {
      vuetify.framework.theme.dark = false;
    }
  }

  return {
  };
});