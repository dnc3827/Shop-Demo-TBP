<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { loginApi } from "../../api/auth.api"
import { saveAuth } from "../../storage/auth.storage"
import { getSessionId } from "../../storage/session.storage"

const router = useRouter()

const username = ref("")
const password = ref("")
const error = ref("")
const showPassword = ref(false)

const login = async () => {
  error.value = ""
  try {
    const res = await loginApi({
      username: username.value,
      password: password.value,
      sessionId: getSessionId()
    })

    const { token, user } = res.data

    // LƯU TOKEN + USER
    saveAuth(token, user)

    // ⚠️ LƯU ROLE RIÊNG (để router guard dùng)
    localStorage.setItem("role", user.role)

    // ✅ ĐIỀU HƯỚNG THEO ROLE
    if (user.role?.toLowerCase() === "admin") {
      router.push("/admin")
    } else {
      router.push("/")
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Login thất bại"
  }
}

</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Welcome Back</h2>
        <p>Vui lòng đăng nhập để tiếp tục</p>
      </div>

      <div class="form-group">
        <label>Username / Email</label>
        <input v-model="username" type="text" placeholder="Nhập tài khoản..." />
      </div>

      <div class="form-group">
        <label>Password</label>

        <div class="password-wrapper">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
          />

          <span
            class="toggle-password"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? "🙈" : "👁️" }}
          </span>
        </div>
      </div>

      <button class="btn-login" @click="login">Đăng nhập</button>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <div class="footer">
        <span>Chưa có tài khoản?</span>
        <router-link to="/register">Đăng ký ngay</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container căn giữa toàn màn hình */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Thẻ Card trắng chứa form */
.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
}

.login-header p {
  color: #777;
  margin-top: 0.5rem;
}

/* Các nhóm input */
.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 600;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box; /* Quan trọng để input không bị tràn */
  transition: all 0.3s ease;
  outline: none;
}

input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Nút bấm */
.btn-login {
  width: 100%;
  padding: 12px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 1rem;
}

.btn-login:hover {
  background-color: #5a67d8;
}

.btn-login:active {
  transform: scale(0.98);
}

/* Thông báo lỗi */
.error-msg {
  color: #e53e3e;
  background: #fff5f5;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-top: 1rem;
  text-align: center;
  border: 1px solid #fed7d7;
}

/* Footer link */
.footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
}

.footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
}

.footer a:hover {
  text-decoration: underline;
}

.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
  font-size: 1.1rem;
  opacity: 0.7;
}

.toggle-password:hover {
  opacity: 1;
}

</style>
