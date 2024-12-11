import { createRouter, createWebHistory } from "vue-router";
import SaveTime from "@/layouts/default.vue";
import DisplayTime from "@/pages/dashboard.vue";

const routes = [
  { path: "/", name: "SaveTime", component: SaveTime },
  { path: "/display", name: "DisplayTime", component: DisplayTime },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
