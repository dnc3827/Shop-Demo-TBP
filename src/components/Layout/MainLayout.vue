<script setup>
import Header from "./Header.vue"
import Footer from "./Footer.vue"
import ZaloButton from "../common/ZaloButton.vue"
</script>

<template>
  <div class="layout">
    <Header />

    <main>
      <router-view />
    </main>

    <Footer />
    <ZaloButton />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
