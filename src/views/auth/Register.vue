<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { registerApi } from "../../api/auth.api"

const router = useRouter()

const username = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref("")


const register = async () => {
  error.value = ""
  try {
    await registerApi({
      username: username.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    })

    alert("Đăng ký thành công")
    router.push("/login")
  } catch (err) {
    error.value = err.response?.data?.message || "Register thất bại"
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>Tạo tài khoản</h2>
        <p>Tham gia cùng chúng tôi ngay hôm nay</p>
      </div>

      <div class="form-group">
        <label>Username</label>
        <input v-model="username" type="text" placeholder="Tên đăng nhập" />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="example@gmail.com" />
      </div>

      <div class="form-group">
        <label>Mật khẩu</label>

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


      <div class="form-group">
        <label>Xác nhận mật khẩu</label>

        <div class="password-wrapper">
          <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="••••••••"
          />

          <span
            class="toggle-password"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            {{ showConfirmPassword ? "🙈" : "👁️" }}
          </span>
        </div>
      </div>


      <button class="btn-register" @click="register">Đăng ký</button>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <div class="footer">
        <span>Đã có tài khoản?</span>
        <router-link to="/login">Đăng nhập</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
}

.register-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px; /* Hơi rộng hơn login một chút vì nhiều field hơn */
}

.register-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.register-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
}

.register-header p {
  color: #777;
  margin-top: 0.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  color: #555;
  font-weight: 600;
  font-size: 0.85rem;
}

input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  outline: none;
}

input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-register {
  width: 100%;
  padding: 12px;
  background-color: #764ba2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 1rem;
}

.btn-register:hover {
  background-color: #667eea;
}

.btn-register:active {
  transform: scale(0.98);
}

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
