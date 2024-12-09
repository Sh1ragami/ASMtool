<template>
  <v-container>
    <v-row justify="center" style="margin-top: 20vh">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="headline">メール認証</v-card-title>
          <v-card-text>
            <p>
              認証メールを送信しました。メールを確認してアカウントを有効化してください。
            </p>
            <p>まだメールが届いていない場合は以下のボタンで再送信できます。</p>
            <v-btn
              @click="resendVerificationEmail"
              color="primary"
              class="mt-4"
              block
            >
              認証メールを再送信
            </v-btn>
            <v-btn @click="goToLogin" class="mt-4" block>
              ログイン画面に戻る
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { sendEmailVerification } from "firebase/auth";

definePageMeta({
  layout: "empty",
});

// Nuxtアプリから提供されたauthを取得
const { $auth } = useNuxtApp();

const resendVerificationEmail = async () => {
  try {
    const user = $auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
      alert("認証メールを再送信しました。メールを確認してください。");
    } else {
      alert("ユーザー情報が取得できませんでした。ログインし直してください。");
    }
  } catch (error) {
    console.error("認証メール再送エラー:", error.message);
    alert("認証メールの再送信に失敗しました。");
  }
};

const goToLogin = () => {
  navigateTo("/auth");
};
</script>
