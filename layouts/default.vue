<template>
  <v-layout>
    <!-- ナビゲーションドロワー -->
    <v-navigation-drawer v-model="drawer">
      <div class="text-h4 mb-5 mt-5 text-center">ASMツール</div>
      <v-list density="compact" item-props :items="items" nav />

      <template #append>
        <v-list-item
          class="ma-2"
          to="/settings"
          nav
          prepend-icon="mdi-cog-outline"
          title="設定"
        />
      </template>
    </v-navigation-drawer>

    <!-- アプリバー -->
    <v-app-bar border="b" class="ps-4" flat>
      <!-- ナビゲーションドロワーのトグル -->
      <v-app-bar-nav-icon
        v-if="$vuetify.display.smAndDown"
        @click="drawer = !drawer"
      />

      <!-- アプリタイトル -->
      <v-app-bar-title>{{ appBarTitle }}</v-app-bar-title>

      <template #append>
        <!-- ダークモード切り替えボタン -->
        <v-btn icon class="me-2" @click="toggleTheme">
          <v-icon>{{ isDarkMode ? 'mdi-weather-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
        </v-btn>

        <!-- ユーザーメニュー -->
        <v-btn class="text-none me-2" height="48" icon slim>
          <v-avatar
            color="surface-light"
            :image="userPhoto || defaultAvatar"
            size="32"
          />
          <v-menu activator="parent">
            <v-list density="compact" nav>
              <v-list-item
                append-icon="mdi-cog-outline"
                to="/settings/user"
                title="ユーザー情報"
              />
              <v-list-item
                append-icon="mdi-logout"
                @click="logout"
                title="ログアウト"
              />
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-app-bar>

    <!-- メインコンテンツ -->
    <v-main>
      <div class="pa-5">
        <slot />
      </div>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { signOut } from "firebase/auth";

// プラグインからauthを取得
const { $auth } = useNuxtApp();

// ログアウト機能
const logout = async () => {
  try {
    await signOut($auth);
    console.log("ログアウトしました");
    await navigateTo("/auth");
  } catch (error) {
    console.error("ログアウトエラー:", error.message);
    alert("ログアウトに失敗しました");
  }
};

// ルート情報を取得
const route = useRoute();

// ページタイトルを動的に設定
const appBarTitle = computed(() => {
  const pageTitles = {
    "/dashboard": "ダッシュボード",
    "/asset": "資産一覧",
    "/settings": "設定",
    "/settings/scan": "スキャン設定",
    "/guide": "使い方",
    "/vulnerabilities": "脆弱性一覧",
  };
  return pageTitles[route.path] || "デフォルトタイトル";
});

// ナビゲーションドロワーの状態
const drawer = ref(true);

// メニュー項目
const items = ref([
  {
    title: "ダッシュボード",
    prependIcon: "mdi-view-dashboard-outline",
    to: "/dashboard",
  },
  {
    title: "資産管理",
    prependIcon: "mdi-account-group",
    to: "/asset",
  },
  {
    title: "脆弱性一覧",
    prependIcon: "mdi-briefcase-outline",
    to: "/vulnerabilities",
  },
  {
    title: "スキャン設定",
    prependIcon: "mdi-calendar",
    to: "/settings/scan",
  },
  {
    title: "使い方",
    prependIcon: "mdi-file-chart-outline",
    to: "/guide",
  },
]);

// ユーザー情報（仮の画像URLを設定）
const userPhoto = ref("https://cdn.vuetifyjs.com/images/john.png");
const defaultAvatar = "https://cdn.vuetifyjs.com/images/avatar/1.png";

// ダークモード管理
const isDarkMode = ref(false);

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  const vuetify = useNuxtApp().$vuetify;
  vuetify.theme.global.name.value = isDarkMode.value ? "dark" : "light";
};
</script>

<style scoped>
.v-avatar {
  cursor: pointer;
}
</style>
