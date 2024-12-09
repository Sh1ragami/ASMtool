<template>
  <!-- タブ切り替え -->
  <v-tabs v-model="tab">
    <v-tab>フォーム形式で編集</v-tab>
    <v-tab>YAML直接編集</v-tab>
  </v-tabs>

  <!-- フォーム形式 -->
  <v-tab-item v-if="tab === 0">
    <v-form class="mt-5">
      <h3>調査対象(ドメイン名、IPアドレス)</h3>
      <v-row>
        <v-col
          v-for="(item, index) in yamlData.target || []"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <v-text-field v-model="yamlData.target[index]" label="調査対象" />
        </v-col>
      </v-row>

      <h3>フラグ</h3>
      <v-row>
        <v-col
          v-for="(item, index) in yamlData.flags || []"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <v-text-field v-model="yamlData.flags[index]" label="フラグ" />
        </v-col>
      </v-row>

      <h3>スキャン方法</h3>
      <v-row>
        <v-col
          v-for="(item, index) in yamlData.include || []"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <v-text-field
            v-model="yamlData.include[index]"
            label="スキャン方法"
          />
        </v-col>
      </v-row>

      <h3>APIキー設定</h3>
      <div v-if="yamlData.config && yamlData.config.modules">
        <v-row>
          <v-col
            v-for="(module, key) in yamlData.config.modules"
            :key="key"
            cols="12"
            sm="6"
            md="4"
          >
            <v-text-field v-model="module.api_key" :label="`${key} APIキー`" />
          </v-col>
        </v-row>
      </div>

      <v-btn color="primary" class="mt-4" @click="saveYaml">保存</v-btn>
    </v-form>
  </v-tab-item>

  <!-- YAML直接編集 -->
  <v-tab-item v-if="tab === 1">
    <!-- YAMLエディタ -->
    <v-row>
      <v-col cols="12">
        <v-textarea v-model="yamlRaw" label="YAML設定" rows="20" outlined />
      </v-col>
    </v-row>

    <v-btn color="primary" class="mt-4" @click="saveYamlDirect">保存</v-btn>
  </v-tab-item>
</template>

<script setup>
import yaml from "js-yaml"; // js-yamlライブラリを利用
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Firestoreの参照を取得
const { $db } = useNuxtApp();
const auth = getAuth();
const result = ref(null);
const tab = ref(0); // タブの選択状態を管理
const loading = ref(false);
const yamlData = ref({});
const yamlRaw = ref("");
const user = ref(null);

// ユーザー認証の状態を監視
onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    user.value = currentUser; // ユーザーがサインインしている場合にユーザー情報をセット

    if (currentUser) {
      // Firestoreからデータを取得する処理
      await getFirestoreData(currentUser.uid);
    }
  });
});

// Firestoreからyamlファイルを取得
async function getFirestoreData(uid) {
  try {
    loading.value = true; // ローディング状態にする
    const userResultsRef = doc($db, "yamls", uid);
    const userResultsDoc = await getDoc(userResultsRef);

    if (userResultsDoc.exists()) {
      result.value = userResultsDoc.data().results;
      yamlData.value = result.value;
      yamlRaw.value = yaml.dump(result.value);
      console.log("Firestoreから結果を取得しました:", result.value);
    } else {
      console.log("Firestoreに保存された結果がありません");
      // Firestoreに初期のYAMLを保存
      await saveInitialYaml(uid);
    }
  } catch (error) {
    console.error("Firestoreデータの取得に失敗しました:", error);
  } finally {
    loading.value = false; // ローディング状態を解除
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

// YAMLデータをFirestoreに保存
async function saveYaml() {
  try {
    yamlRaw.value = yaml.dump(yamlData.value); // YAMLデータを文字列に変換
    await saveToFirestore();
    alert("保存しました");
  } catch (e) {
    alert("保存に失敗しました: " + e.message);
  }
}

// YAMLデータを直接編集してFirestoreに保存
async function saveYamlDirect() {
  try {
    yamlData.value = yaml.load(yamlRaw.value) || {}; // 文字列をYAMLデータに変換
    await saveToFirestore();
    alert("保存しました");
  } catch (e) {
    alert("保存に失敗しました: " + e.message);
  }
}

// Firestoreにデータを保存
async function saveToFirestore() {
  if (user.value && yamlData.value) {
    const userResultsRef = doc($db, "yamls", user.value.uid);
    await setDoc(userResultsRef, { results: yamlData.value }, { merge: true });
    console.log("結果をFirestoreに保存しました");
  }
}
</script>

<style scoped>
.v-container {
  padding: 20px;
}
</style>
