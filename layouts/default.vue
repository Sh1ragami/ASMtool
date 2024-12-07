<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer">
      <h1 style="margin: 3vh 7vh; font-weight: bold; overflow-wrap: break-word">
        ASMツール
      </h1>
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

    <v-app-bar border="b" class="ps-4" flat>
      <v-app-bar-nav-icon
        v-if="$vuetify.display.smAndDown"
        @click="drawer = !drawer"
      />

      <v-app-bar-title>{{ appBarTitle }}</v-app-bar-title>

      <template #append>
        <v-btn class="text-none me-2" height="48" icon slim>
          <v-avatar
            color="surface-light"
            image="https://cdn.vuetifyjs.com/images/john.png"
            size="32"
          />

          <v-menu activator="parent">
            <v-list density="compact" nav>
              <v-list-item
                append-icon="mdi-cog-outline"
                to="/settings/user"
                title="ユーザー情報"
              />

              <v-list-item append-icon="mdi-logout" link title="Logout" />
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <div class="pa-4">
        <!-- ここにメインコンテンツを埋め込む -->
        <slot />
      </div>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref } from "vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

// 現在のルート情報を取得
const route = useRoute();

// ページごとのタイトル設定
const appBarTitle = computed(() => {
  const pageTitles = {
      "/dashboard": "ダッシュボード",
    "/asset": "資産一覧",
    "/settings": "設定",
    "/settings/scan": "スキャン設定",
      "/guide": "使い方",
      "/vulnerabilities": "脆弱性一覧"
  };
  return pageTitles[route.path] || "デフォルトタイトル";
});

const drawer = ref(true);

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
</script>
