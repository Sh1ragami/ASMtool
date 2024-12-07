<template>
  <div>
    <h1>ホームページ</h1>
  </div>
</template>

<script>
export default {
  mounted() {
    // コンポーネントがマウントされたタイミングで自動的に遷移
    this.$router.push('/dashboard');
  },
};
</script>
