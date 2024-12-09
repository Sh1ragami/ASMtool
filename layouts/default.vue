<template>
  <v-layout>
    <!-- ナビゲーションドロワー -->
    <v-navigation-drawer v-model="drawer">
      <div class="text-h4 mb-5 mt-5 text-center">ASMツール</div>
      <v-list density="compact" item-props :items="items" nav />

      <v-form @submit.prevent="submitScan">
        <v-btn
          type="submit"
          color="primary"
          :loading="loading"
          class="ma-4"
          elevation="10"
          large
        >
          <v-icon left>mdi-run</v-icon>実行
        </v-btn>
      </v-form>

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
          <v-icon>{{
            isDarkMode ? "mdi-weather-sunny" : "mdi-moon-waning-crescent"
          }}</v-icon>
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
import { signOut } from "firebase/auth";
import axios from "axios";
import { useRoute } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, computed, onMounted } from "vue";
import { useRuntimeConfig, useNuxtApp } from "#app";
import { doc, setDoc, getDoc } from "firebase/firestore";
import yaml from 'js-yaml';

// Firestoreの参照を取得
const { $db } = useNuxtApp();
const auth = getAuth();
const result = ref(null);
const activeTab = ref(0);
const error = ref(null);
const loading = ref(false);

const apiBaseURL = useRuntimeConfig().public.apiBaseUrl || "";

const tableHeaders = [{ text: "メッセージ", align: "start", key: "message" }];
const categorizedResults = computed(() => {
  if (!result.value) return {};
  const categories = {};
  result.value.forEach((entry) => {
    const match = entry.message.match(/^\[(.+?)\]/);
    if (match) {
      const category = match[1];
      if (!categories[category]) categories[category] = [];
      categories[category].push(entry.message);
    }
  });
  return categories;
});

const user = ref(null);
const yamlData = ref(null); // Firestoreから取得したYAMLデータを保持

// ユーザー認証の状態を監視
onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    user.value = currentUser; // ユーザーがサインインしている場合にユーザー情報をセット
  });
});

// スキャン結果を送信する関数
async function submitScan() {
  loading.value = true;
  error.value = null;

  try {
    // FirestoreからYAMLデータを取得
    if (user.value) {
      const yamlFromFirestore = await getFirestoreData(user.value.uid); // UIDに基づいてFirestoreからデータ取得
      if (!yamlFromFirestore) {
        throw new Error("YAMLデータがFirestoreに存在しません");
      }

      // YAMLデータを適切な形式に変換
      yamlData.value = yaml.dump(yamlFromFirestore);
    }

    // APIリクエストにYAMLデータを含めて送信
    const response = await axios.post(`${apiBaseURL}/run-bbot`, {
      yaml: yamlData.value, // APIが期待するフィールド名に合わせて送信
    });

    result.value = response.data.result;

    // Firestoreに結果を保存
    if (user.value && result.value) {
      const userResultsRef = doc($db, "users", user.value.uid);
      await setDoc(userResultsRef, { results: result.value }, { merge: true });
      console.log("結果をFirestoreに保存しました");
    }
  } catch (err) {
    console.error("APIエラー:", err);
    error.value = `エラーが発生しました: ${err.message}`;

    if (err.response) {
      console.error("サーバーからの応答がありました:", err.response.data);
      // サーバー側からのエラー応答をUIに表示するなど処理
      error.value = `サーバーエラー: ${err.response.data.error || err.response.data.message}`;
    }
  } finally {
    loading.value = false;
  }
} 

// FirestoreからYAMLデータを取得する関数
async function getFirestoreData(uid) {
  try {
    const docRef = doc($db, "yamls", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().results; // Firestoreのドキュメントフィールド名に基づく
    } else {
      console.log("指定されたUIDのデータが見つかりません");
      return null;
    }
  } catch (error) {
    console.error("Firestoreデータの取得に失敗しました:", error);
    throw error;
  }
}


// 初期のYAMLデータをFirestoreに保存
async function saveInitialYaml(uid) {
  try {
    const initialYaml = `
    flags:
  - safe
  - passive
excavate: true
interactsh_token: null
folder_blobs: false
aggregate: true
engine:
  debug: false
cloudcheck: true
interactsh_disable: false
url_extension_httpx_only:
  - js
include:
  - subdomain-enum
scope:
  search_distance: 0
  strict: false
  report_distance: 0
web:
  user_agent: >-
    Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like
    Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.2151.97
  http_max_redirects: 5
  ssl_verify: false
  httpx_retries: 1
  spider_distance: 0
  http_proxy: null
  http_headers: {}
  httpx_timeout: 5
  http_timeout: 10
  spider_depth: 1
  debug: false
  spider_links_per_page: 25
  http_retries: 1
target:
  - asojuku.ac.jp
dns:
  wildcard_tests: 10
  retries: 1
  abort_threshold: 50
  wildcard_ignore: []
  minimal: false
  wildcard_disable: false
  brute_nameservers: >-
    https://raw.githubusercontent.com/blacklanternsecurity/public-dns-servers/master/nameservers.txt
  search_distance: 1
  timeout: 5
  omit_queries:
    - SRV:mail.protection.outlook.com
    - CNAME:mail.protection.outlook.com
    - TXT:mail.protection.outlook.com
  brute_threads: 1000
  filter_ptrs: true
  debug: false
  runaway_limit: 5
  threads: 25
url_extension_blacklist:
  - png
  - jpg
  - bmp
  - ico
  - jpeg
  - gif
  - svg
  - webp
  - css
  - woff
  - woff2
  - ttf
  - eot
  - sass
  - scss
  - mp3
  - m4a
  - wav
  - flac
  - mp4
  - mkv
  - avi
  - wmv
  - mov
  - flv
  - webm
config:
  modules:
    censys:
      api_key: null
    chaos:
      api_key: null
    subdomainradar:
      api_key: null
    c99:
      c99: null
    github_codesearch:
      api_key: null
    bufferoverrun:
      api_key: null
    fullhunt:
      api_key: null
    dehashed:
      api_key: null
    zoomeye:
      api_key: null
    binaryedge:
      api_key: null
    trickest:
      api_key: null
    virustotal:
      api_key: null
    bevigil:
      api_key: null
    credshed:
      api_key: null
    securitytrails:
      api_key: null
    builtwith:
      api_key: null
    passivetotal:
      api_key: null
    ip2location:
      api_key: null
    shodan_dns:
      api_key: null
    hunterio:
      api_key: null
    ipstack:
      api_key: null
keep_scans: 20
speculate: true
home: ~/.bbot
status_frequency: 15
deps:
  ffuf:
    version: 2.1.0
  behavior: abort_on_failure
url_querystring_remove: true
url_querystring_collapse: true
omit_event_types:
  - HTTP_RESPONSE
  - RAW_TEXT
  - URL_UNVERIFIED
  - DNS_NAME_UNRESOLVED
  - FILESYSTEM
  - WEB_PARAMETER
  - RAW_DNS_RECORD
file_blobs: false
interactsh_server: null
module_dirs: []
modules: null
description: 攻撃面の発見方法や対象についての設定ファイル
    `;
    const parsedYaml = yaml.load(initialYaml);
    const userResultsRef = doc($db, "yamls", uid);
    await setDoc(userResultsRef, { results: parsedYaml }, { merge: true });
    console.log("初期のYAMLがFirestoreに保存されました");
    yamlData.value = parsedYaml;
    yamlRaw.value = initialYaml;
  } catch (error) {
    console.error("Firestoreへの初期YAML保存に失敗しました:", error);
  }
}

// ログアウト機能
const logout = async () => {
  try {
    await signOut(auth);
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
