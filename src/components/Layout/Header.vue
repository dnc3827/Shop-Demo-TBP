<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import {
  isLoggedIn,
  getRole,
  clearAuth
} from "../../storage/auth.storage"

const router = useRouter()

const loggedIn = computed(() => isLoggedIn())
const role = computed(() => getRole())
const isAdmin = computed(() => role.value === "Admin")

const logout = () => {
  clearAuth()
  router.push("/login")
}

// ===== CART =====
const cartCount = ref(0)
let intervalId = null

const updateCartCount = () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]")
  cartCount.value = cart.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  )
}

onMounted(() => {
  updateCartCount()
  intervalId = setInterval(updateCartCount, 500)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <nav class="header">
    <!-- LOGO -->
    <div class="logo" @click="router.push('/')">
      DEMO_SHOP
    </div>

    <!-- MENU -->
    <ul class="nav-links">
      <li><router-link to="/">Trang chủ</router-link></li>
      <li><router-link to="/products">Sản phẩm</router-link></li>
      <li><router-link to="/contact">Liên hệ</router-link></li>
    </ul>

    <!-- RIGHT -->
    <div class="right-actions">
      <!-- CART -->
      <div class="cart-btn" @click="router.push('/cart')">
        🛒
        <span class="cart-badge" v-if="cartCount > 0">
          {{ cartCount }}
        </span>
      </div>

      <!-- AUTH -->
      <div v-if="!loggedIn" class="auth-buttons">
        <router-link to="/login">
          <button class="btn-login">Đăng nhập</button>
        </router-link>
        <router-link to="/register">
          <button class="btn-register">Đăng ký</button>
        </router-link>
      </div>

      <div v-else class="auth-buttons">
        <span class="role">{{ role }}</span>

        <router-link v-if="isAdmin" to="/admin">
          <button class="btn-admin">Admin</button>
        </router-link>

        <button class="btn-login" @click="logout">Logout</button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 5%;
  background: #0b2c24;
  color: white;
}

.logo {
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
}

.nav-links {
  display: flex;
  gap: 20px;
  list-style: none;
}

.nav-links a {
  color: white;
  text-decoration: none;
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cart-btn {
  position: relative;
  cursor: pointer;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: red;
  color: white;
  font-size: 11px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.btn-login {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 4px 12px;
}

.btn-register {
  background: #42b883;
  border: none;
  color: white;
  padding: 4px 12px;
}

.btn-admin {
  background: #b9ff3f;
  border: none;
  padding: 4px 12px;
}
</style>
