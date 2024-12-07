import { getAuth, onAuthStateChanged } from "@firebase/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.server) {
    const checkAuthState = new Promise((resolve, reject) => {
      onAuthStateChanged(getAuth(), async (user) => {
        if (user) {
          // ユーザーが認証されている場合
          if (user.emailVerified) {
            resolve(user);
            console.log("ログインしています");
          } else {
            // メール認証されていない場合
            reject("メール認証されていません");
          }
        } else {
          // ユーザーが認証されていない場合
          reject("ユーザー未認証");
        }
      });
    });

    try {
      const user = await checkAuthState;
      console.log("認証されているユーザー:", user);
      // 必要に応じてここで認証後の処理を追加
    } catch (err) {
      console.log(err);

      // ログインしていないユーザーやメール認証されていないユーザーをリダイレクト
      if (to.path === "/" || to.path.startsWith("/auth")) {
        // トップページや認証ページはアクセスを許可
        return;
      } else {
        // 認証されていない場合や未認証ユーザーはリダイレクト
        return await navigateTo("/auth");
      }
    }
  }
});
