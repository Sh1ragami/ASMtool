<template>
  <v-container class="pa-5" fluid>
    <v-row>
      <!-- テーマ設定 -->
      <v-col cols="12" sm="6">
        <v-card class="elevation-2" outlined>
          <v-card-title>
            <v-icon class="mr-2">mdi-theme-light-dark</v-icon>
            テーマ設定
          </v-card-title>
          <v-card-subtitle>
            アプリのテーマをライトモードまたはダークモードに切り替えます。
          </v-card-subtitle>
          <v-switch v-model="isDarkMode" label="ダークモード" class="mt-4"></v-switch>
        </v-card>
      </v-col>

      <!-- 通知設定 -->
      <v-col cols="12" sm="6">
        <v-card class="elevation-2" outlined>
          <v-card-title>
            <v-icon class="mr-2">mdi-bell-ring</v-icon>
            通知設定
          </v-card-title>
          <v-card-subtitle>
            通知を受け取るかどうか設定します。
          </v-card-subtitle>
          <v-switch v-model="notificationsEnabled" label="通知を有効にする" class="mt-4"></v-switch>
        </v-card>
      </v-col>

      <!-- 言語設定 -->
      <v-col cols="12" sm="6">
        <v-card class="elevation-2" outlined>
          <v-card-title>
            <v-icon class="mr-2">mdi-language</v-icon>
            言語設定
          </v-card-title>
          <v-card-subtitle>
            アプリの表示言語を選択できます。
          </v-card-subtitle>
          <v-select
            v-model="selectedLanguage"
            :items="languages"
            label="言語を選択"
            item-text="text"
            item-value=language.value
            class="mt-4"
            dense
          ></v-select>
        </v-card>
      </v-col>

      <!-- アカウント設定 -->
      <v-col cols="12" sm="6">
        <v-card class="elevation-2" outlined>
          <v-card-title>
            <v-icon class="mr-2">mdi-account</v-icon>
            アカウント設定
          </v-card-title>
          <v-card-subtitle>
            アカウント情報の変更を行います。
          </v-card-subtitle>
          <v-btn color="primary" class="rounded-0" @click="goToAccountSettings">アカウント設定へ</v-btn>
        </v-card>
      </v-col>

      <!-- セキュリティ設定 -->
      <v-col cols="12" sm="6">
        <v-card class="elevation-2" outlined>
          <v-card-title>
            <v-icon class="mr-2">mdi-security</v-icon>
            セキュリティ設定
          </v-card-title>
          <v-card-subtitle>
            セキュリティ強化のため、二段階認証などを設定できます。
          </v-card-subtitle>
          <v-btn color="primary" class="rounded-0" @click="goToSecuritySettings">セキュリティ設定へ</v-btn>
        </v-card>
      </v-col>

      <!-- スキャン設定 -->
      <v-col cols="12" sm="6">
        <v-card class="elevation-2" outlined>
          <v-card-title>
            <v-icon class="mr-2">mdi-scan</v-icon>
            スキャン設定
          </v-card-title>
          <v-card-subtitle>
            スキャンの間隔やオプションを設定します。
          </v-card-subtitle>
          <v-btn color="primary" class="rounded-0" @click="goToScanSettings">スキャン設定へ</v-btn>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const isDarkMode = ref(false);
const notificationsEnabled = ref(true);
const selectedLanguage = ref('ja'); // 初期値
const languages = ref([
  { label: '日本語', value: 'ja' },
  { label: '英語', value: 'en' },
  { label: 'フランス語', value: 'fr' },
]);

const router = useRouter();

const goToAccountSettings = () => {
  router.push('/settings/account');
};

const goToSecuritySettings = () => {
  router.push('/settings/security');
};

const goToScanSettings = () => {
  router.push('/settings/scan');
};
</script>

<style scoped>
.v-card {
  transition: box-shadow 0.3s ease-in-out;
  border-radius: 10px;
}

.v-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.v-btn {
  text-transform: none;
  font-weight: 600;
}

.v-row {
  margin-top: 20px;
}

.v-icon {
  color: #1976d2;
}

.v-select, .v-switch {
  width: 100%;
}

.v-container {
  border-radius: 20px;
  padding: 20px;
}

h1 {
  font-weight: bold;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
}
</style>
