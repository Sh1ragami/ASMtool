<template>
  <v-container>
    <v-row justify="center" style="margin-top: 20vh;">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="headline">アカウント作成</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="signup">
              <v-text-field
                v-model="email"
                label="メールアドレス"
                type="email"
                required
              />
              <v-text-field
                v-model="password"
                label="パスワード"
                type="password"
                required
              />
              <v-btn type="submit" color="primary" class="mt-4" block>
                アカウント作成
              </v-btn>
            </v-form>
            <v-btn @click="goToLogin" class="mt-4" block>
              既にアカウントをお持ちですか？ログイン
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { extractIdentifiers } from "vue/compiler-sfc";

definePageMeta({
  layout: "empty",
});

// Nuxtアプリから提供されたauthを取得
const { $auth } = useNuxtApp();

const email = ref("");
const password = ref("");

const signup = async () => {
  try {
    // ユーザーの作成
    const userCredential = await createUserWithEmailAndPassword(
      $auth,
      email.value,
      password.value
    );
    const user = userCredential.user;

    // メール認証を送信
    await sendEmailVerification(user);

    // メール送信後、確認画面にリダイレクト
    alert("認証メールを送信しました。メールを確認してください。");
    navigateTo("/auth/verify");
    return false;
  } catch (error) {
    console.error("アカウント作成エラー:");
    alert("アカウント作成に失敗しました。エラー: ");
  }
};

const goToLogin = () => {
  navigateTo("/auth");
};
</script>
