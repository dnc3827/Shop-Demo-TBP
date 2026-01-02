<template>
  <a
    :href="zaloLink"
    class="zalo-float"
    target="_blank"
    rel="noopener"
  >
    <img src="/public/zalo-icon.png" alt="Zalo Chat" />
  </a>
</template>

<script setup>
const zaloLink = "https://zalo.me/0971405552"
</script>

<style scoped>
.zalo-float {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.zalo-float img {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: transform 0.2s;
}

.zalo-float img:hover {
  transform: scale(1.1);
}
</style>
