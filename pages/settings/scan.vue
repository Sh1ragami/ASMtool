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
    target:
  - asojuku.ac.jp
    flags:
  - safe
  - passive
include:
  - subdomain-enum
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
