<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <!-- <div>
    default.vue から取得した時刻を dashboard.vue に渡す
    <default-component @updateTime="setTime" />
    <dashboard-component :currentTime="currentTime" />
  </div> -->

</template>

<!-- <script setup>
import { ref } from 'vue';
import DefaultComponent from '/home/rui0421/ASMtool/layouts/default.vue';  // default.vue のパス
import DashboardComponent from '/home/rui0421/ASMtool/pages/dashboard.vue';  // dashboard.vue のパス

// 現在時刻を格納するための reactive 変数
const currentTime = ref('');

// 時刻を更新するメソッド
const setTime = (time) => {
  currentTime.value = time;
};
</script> -->
