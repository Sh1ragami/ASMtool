// plugins/axios.ts
import axios from "axios";

export default defineNuxtPlugin(() => {
  const instance = axios.create({
    baseURL: useRuntimeConfig().public.apiBaseUrl || "",
  });

  return {
    provide: {
      $axios: instance,
    },
  };
});
