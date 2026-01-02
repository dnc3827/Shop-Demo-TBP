<script>
// import { clearAuth, getRole } from "./storage/auth.storage"

// export default {
//   methods: {
//     logout() {
//       clearAuth()
//       this.$router.push("/login")
//     },
//     getRole,
//   },
// }
</script>

<template>
  <!-- <div>
    <button v-if="getRole()" @click="logout">Logout</button>
    <router-view />
  </div> -->

  <router-view />
</template>
