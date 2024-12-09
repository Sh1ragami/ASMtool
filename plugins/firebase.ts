import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Firestoreのインポート

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.apiKey,
    authDomain: config.public.authDomain,
    projectId: config.public.projectId,
    storageBucket: config.public.storageBucket,
    messagingSenderId: config.public.messagingSenderId,
    appId: config.public.appId,
    measurementId: config.public.measurementId,
  };

  // Firebaseの初期化
  const app = initializeApp(firebaseConfig);

  // Firestoreインスタンスの作成
  const db = getFirestore(app);

  return {
    provide: {
      auth: getAuth(app), // Authインスタンスの提供
      db, // Firestoreインスタンスの提供
    },
  };
});
