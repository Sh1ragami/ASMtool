<template>
  <v-container fluid>

    <!-- エラーメッセージ -->
    <v-alert v-if="error" type="error" variant="filled" class="mt-4 rounded-lg">
      <v-icon left>mdi-alert-circle-outline</v-icon>
      {{ error }}
    </v-alert>

    <!-- 結果 -->
      <!-- タブ -->
      <v-tabs
        v-model="activeTab"
        centered
        v-if="Object.keys(categorizedResults).length > 0"
      >
        <v-tab
          v-for="(items, category) in categorizedResults"
          :key="category"
          >{{ category }}</v-tab
        >
      </v-tabs>

      <!-- データテーブル -->
      <v-data-table
        v-if="Object.keys(categorizedResults).length > 0"
        :items="categorizedResults[Object.keys(categorizedResults)[activeTab]]"
        :headers="tableHeaders"
        item-value="message"
        class="mt-4"
        dense
        hide-default-footer
      >
        <template v-slot:[`item.message`]="{ item }">
          <td>{{ item }}</td>
        </template>
      </v-data-table>
  </v-container>
</template>

<script setup>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, computed, onMounted } from "vue";
import { useRuntimeConfig, useNuxtApp } from "#app";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Firestoreの参照を取得
const { $db } = useNuxtApp();
const auth = getAuth();
const result = ref(null);
const activeTab = ref(0);
const error = ref(null);
const loading = ref(false);

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

// Firestoreからスキャン結果を取得
async function getFirestoreData(uid) {
  try {
    const userResultsRef = doc($db, "users", uid);
    const userResultsDoc = await getDoc(userResultsRef);

    if (userResultsDoc.exists()) {
      result.value = userResultsDoc.data().results;
      if (result.value && result.value.length > 0) {
        activeTab.value = Object.keys(categorizedResults.value)[0];
      }
      console.log("Firestoreから結果を取得しました:", result.value);
    } else {
      console.log("Firestoreに保存された結果がありません");
    }
  } catch (error) {
    console.error("Firestoreデータの取得に失敗しました:", error);
    error.value = "データの取得に失敗しました";
  }
}
</script>

<style scoped>
.v-data-table {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.v-data-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.v-btn {
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
}

.v-alert {
  background-color: #ffcccb;
}

.v-tabs {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.v-tab {
  font-weight: 600;
  font-size: 1.1rem;
  color: #1976d2;
}

.v-tab:hover {
  background-color: #f1f1f1;
}
</style>
