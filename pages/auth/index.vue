<template>
  <v-container>
    <v-row justify="center" style="margin-top: 20vh">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="headline">ログイン</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
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
                ログイン
              </v-btn>
            </v-form>
            <v-btn @click="goToSignup" class="mt-4" block>
              アカウントを作成する
            </v-btn>
          </v-card-text>
        </v-card>
        <div style="text-align: center; margin-top: 7vh">
          <a @click.prevent="goToResetPassword" class="reset-link">
            パスワードを忘れた場合はこちら
          </a>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

definePageMeta({
  layout: "empty",
});

// 入力データ
const email = ref("");
const password = ref("");

// Nuxtアプリから提供されたauthを取得
const { $auth } = useNuxtApp();

const login = async () => {
  try {
    // ログイン処理
    const userCredential = await signInWithEmailAndPassword(
      $auth,
      email.value,
      password.value
    );
    const user = userCredential.user;

    if (user.emailVerified) {
      // メール認証が完了している場合
      alert("ログイン成功！ダッシュボードにリダイレクトします。");
      await navigateTo("/dashboard");
    } else {
      // メール認証が未完了の場合
      if (
        window.confirm("メール認証がされていません。もう一度送信しますか？")
      ) {
        await sendEmailVerification(user);
        alert("認証メールを送信しました。メールを確認してください。");
      }
    }
  } catch (error) {
    console.error("ログインエラー:");
    alert("ログインに失敗しました。");
  }
};

const goToSignup = () => {
  navigateTo("/auth/signup");
};

const goToResetPassword = () => {
  navigateTo("/auth/reset");
};
</script>

<style>
/* リンクスタイルをカスタマイズ */
.reset-link {
  color: #1976d2;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
}

.reset-link:hover {
  color: #1565c0;
}
</style>
