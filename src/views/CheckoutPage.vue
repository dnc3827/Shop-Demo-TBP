<template>
  <div class="checkout-page">
    <div class="container">
      <h1 class="page-title">Thanh Toán</h1>

      <form class="checkout-form" @submit.prevent="xacNhanThanhToan">
        <div class="form-group">
          <label>Họ tên</label>
          <input type="text" v-model="form.name" required />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="form.email" required />
        </div>

        <div class="form-group">
          <label>Số điện thoại</label>
          <input type="text" v-model="form.phone" required />
        </div>

        <div class="form-group">
          <label>Địa chỉ giao hàng</label>
          <textarea v-model="form.address" required></textarea>
        </div>

        <div class="form-group">
          <label>Phương thức thanh toán</label>
          <select v-model="form.paymentMethod" required>
            <option value="">-- Chọn phương thức --</option>
            <option value="COD">Thanh toán khi nhận hàng</option>
            <option value="BANK">Chuyển khoản</option>
            <option value="MOMO">MoMo</option>
          </select>
        </div>

        <div class="order-summary">
          Tổng thanh toán:
          <strong>{{ formatPrice(tongTien) }}</strong>
        </div>

        <button type="submit" class="btn-submit">
          XÁC NHẬN ĐẶT HÀNG
        </button>

        <router-link to="/cart" class="btn-back">
          ← Quay lại giỏ hàng
        </router-link>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import api from "@/services/axios"

const router = useRouter()
const cartItems = ref([])

const form = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
  paymentMethod: ""
})

onMounted(() => {
  const cart = localStorage.getItem("cart")
  cartItems.value = cart ? JSON.parse(cart) : []

  if (cartItems.value.length === 0) {
    router.push("/cart")
    return
  }

  const user = localStorage.getItem("user")
  if (user) {
    const u = JSON.parse(user)
    form.value.name = u.name || ""
    form.value.email = u.email || ""
    form.value.phone = u.phone || ""
  }
})

const tongTien = computed(() => {
  return cartItems.value.reduce(
    (total, item) => total + item.rawPrice * item.quantity,
    0
  )
})

const xacNhanThanhToan = async () => {
  try {
    const res = await api.post("/api/order/checkout", {
      receiverName: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      address: form.value.address,
      paymentMethod: form.value.paymentMethod,
      items: cartItems.value.map(i => ({
        productId: i.id,
        quantity: i.quantity
      }))
    })

    console.log("ORDER CREATED:", res.data)
    localStorage.removeItem("cart")
    alert("🎉 Đặt hàng thành công!")
    router.push("/")
  } catch (error) {
    alert("❌ Thanh toán thất bại")
  }
}

const formatPrice = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value)
}
</script>


<style scoped> 
.checkout-page { background: #f8f9fa; min-height: 80vh; padding: 60px 20px; } 
.container { max-width: 600px; margin: 0 auto; } 
.page-title { text-align: center; font-weight: 800; margin-bottom: 30px; } 
.checkout-form { background: white; padding: 30px; border-radius: 15px; } 
.form-group { margin-bottom: 15px; } .form-group label { font-weight: bold; display: block; margin-bottom: 5px; } 
.form-group input, .form-group textarea, 
.form-group select { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ddd; } 
.order-summary { margin: 20px 0; font-size: 1.2rem; } 
.btn-submit { width: 100%; padding: 15px; background: #0b2c24; color: #cefe05; border: none; font-weight: bold; border-radius: 8px; cursor: pointer; } 
.btn-back { display: block; text-align: center; margin-top: 15px; text-decoration: none; color: #555; } 

</style>