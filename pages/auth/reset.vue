<template>
  <v-container>
    <v-row justify="center" style="margin-top: 20vh;">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="headline">パスワードリセット</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="resetPassword">
              <v-text-field
                v-model="email"
                label="登録済みのメールアドレス"
                type="email"
                required
              />
              <v-btn type="submit" color="primary" class="mt-4" block>
                リセットリンクを送信
              </v-btn>
            </v-form>
            <v-btn @click="goToLogin" class="mt-4" block>
              ログインページに戻る
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

   <script setup>
   import { ref } from "vue";
   import { sendPasswordResetEmail } from "firebase/auth";
   
   definePageMeta({
     layout: "empty",
   });
   
   // 入力データ
   const email = ref("");
   
   // Nuxtアプリから提供されたauthを取得
   const { $auth } = useNuxtApp();
   
   const resetPassword = async () => {
     try {
       // パスワードリセットリンク送信
       await sendPasswordResetEmail($auth, email.value);
       alert("パスワードリセットリンクを送信しました。メールをご確認ください。");
       await navigateTo("/auth");
     } catch (error) {
       console.error("リセットエラー:", error.message);
       alert("パスワードリセットに失敗しました。メールアドレスを確認してください。");
     }
   };
   
   const goToLogin = () => {
     navigateTo("/auth");
   };
   </script>