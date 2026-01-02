<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">Giỏ Hàng Của Bạn</h1>

      <div v-if="cartItems.length === 0" class="empty-cart">
        <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" class="empty-icon" />
        <p>Giỏ hàng đã được thanh toán hoặc chưa có sản phẩm.</p>
        <router-link to="/" class="btn-back">← Quay lại mua sắm</router-link>
      </div>

      <div v-else class="cart-content">
        <div class="cart-list">
          <div class="cart-header">
            <span>Sản phẩm</span>
            <span class="text-center">Số lượng</span>
            <span class="text-right">Tạm tính</span>
            <span></span>
          </div>

          <div v-for="(item, index) in cartItems" :key="item.id" class="cart-item">
            <div class="item-info">
              <img :src="item.image" :alt="item.name" class="item-img" />
              <div class="item-details">
                <h3>{{ item.name }}</h3>
                <p class="item-price">{{ formatPrice(item.rawPrice) }}</p>
              </div>
            </div>

            <div class="item-quantity">
              <button @click="giamSoLuong(index)">-</button>
              <input type="text" :value="item.quantity" readonly />
              <button @click="tangSoLuong(index)">+</button>
            </div>

            <div class="item-total text-right">
              {{ formatPrice(item.rawPrice * item.quantity) }}
            </div>

            <div class="item-remove">
              <button @click="xoaSanPham(index)" title="Xóa">×</button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <h2>Tổng đơn hàng</h2>
          <div class="summary-row">
            <span>Tạm tính:</span>
            <span>{{ formatPrice(tongTien) }}</span>
          </div>
          <div class="summary-row">
            <span>Giảm giá:</span>
            <span>0 đ</span>
          </div>
          <div class="divider"></div>
          <div class="summary-row total">
            <span>Thành tiền:</span>
            <span class="highlight">{{ formatPrice(tongTien) }}</span>
          </div>
          
          <button class="btn-checkout" @click="thanhToan">THANH TOÁN & HOÀN TẤT</button>
          
          <router-link to="/" class="link-continue">Tiếp tục mua hàng</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const cartItems = ref([]);

// 1. Khi trang vừa load, lấy dữ liệu từ LocalStorage
onMounted(() => {
  const savedCart = localStorage.getItem("cart")
  cartItems.value = savedCart ? JSON.parse(savedCart) : []
})

// 2. Tính tổng tiền
const tongTien = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.rawPrice * item.quantity);
  }, 0);
});

// 3. Hàm lưu lại vào LocalStorage
const updateLocalStorage = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
};

// 4. Các hàm xử lý tăng/giảm/xóa
const tangSoLuong = (index) => {
  cartItems.value[index].quantity++;
  updateLocalStorage();
};

const giamSoLuong = (index) => {
  if (cartItems.value[index].quantity > 1) {
    cartItems.value[index].quantity--;
    updateLocalStorage();
  } else {
    xoaSanPham(index);
  }
};

const xoaSanPham = (index) => {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    cartItems.value.splice(index, 1);
    updateLocalStorage();
  }
};

const formatPrice = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// --- MỚI: HÀM THANH TOÁN (ĐÃ SỬA ĐỂ XÓA GIỎ HÀNG) ---
const thanhToan = () => {
  if (cartItems.value.length === 0) return
  router.push('/checkout')
};
</script>

<style scoped>
.cart-page {
  background: #f8f9fa;
  min-height: 80vh;
  padding: 60px 20px;
  font-family: 'Inter', sans-serif;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.page-title {
  color: #0b2c24;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 30px;
  text-transform: uppercase;
}

/* --- EMPTY STATE --- */
.empty-cart {
  text-align: center;
  padding: 50px;
  background: white;
  border-radius: 15px;
}
.empty-icon { width: 80px; opacity: 0.5; margin-bottom: 20px; }
.btn-back {
  display: inline-block;
  margin-top: 15px;
  text-decoration: none;
  color: #0b2c24;
  font-weight: bold;
  border-bottom: 2px solid #cefe05;
}

/* --- LAYOUT GIỎ HÀNG --- */
.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

/* CỘT TRÁI */
.cart-list {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
  overflow: hidden;
}
.cart-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 50px;
  padding: 15px 20px;
  background: #f1f3f5;
  font-weight: bold;
  color: #555;
  font-size: 0.9rem;
}
.cart-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 50px;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}
.item-info { display: flex; align-items: center; gap: 15px; }
.item-img { width: 70px; height: 90px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; }
.item-details h3 { font-size: 1rem; margin: 0 0 5px; color: #333; }
.item-price { color: #888; font-size: 0.9rem; }

.item-quantity {
  display: flex; align-items: center; justify-content: center;
  border: 1px solid #ddd; border-radius: 5px; width: fit-content; margin: 0 auto;
}
.item-quantity button {
  background: none; border: none; padding: 5px 10px; cursor: pointer; font-size: 1.1rem;
}
.item-quantity input {
  width: 40px; text-align: center; border: none; outline: none; font-weight: bold;
}

.item-total { font-weight: bold; color: #0b2c24; }
.item-remove button {
  background: none; border: none; color: #ff4d4d; font-size: 1.5rem; cursor: pointer;
}

/* CỘT PHẢI */
.cart-summary {
  background: white;
  padding: 30px;
  border-radius: 15px;
  height: fit-content;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
}
.cart-summary h2 { margin-top: 0; font-size: 1.2rem; color: #0b2c24; border-bottom: 2px solid #cefe05; display: inline-block; padding-bottom: 5px; margin-bottom: 20px;}
.summary-row { display: flex; justify-content: space-between; margin-bottom: 15px; color: #555; }
.divider { height: 1px; background: #eee; margin: 15px 0; }
.summary-row.total { font-size: 1.2rem; font-weight: 800; color: #0b2c24; }
.highlight { color: #d62828; }

.btn-checkout {
  width: 100%;
  padding: 15px;
  background: #0b2c24;
  color: #cefe05;
  border: none;
  font-weight: bold;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  transition: 0.3s;
}
.btn-checkout:hover { background: #061a15; box-shadow: 0 5px 15px rgba(11, 44, 36, 0.3); }

.link-continue {
  display: block; text-align: center; margin-top: 15px;
  text-decoration: none; color: #666; font-size: 0.9rem;
}
.link-continue:hover { text-decoration: underline; }

.text-center { text-align: center; }
.text-right { text-align: right; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .cart-content { grid-template-columns: 1fr; }
  .cart-header { display: none; }
  .cart-item {
    grid-template-columns: 1fr;
    gap: 15px;
    position: relative;
    padding-bottom: 40px;
  }
  .item-quantity { margin: 0; }
  .item-total { text-align: left; font-size: 1.1rem; }
  .item-remove { position: absolute; top: 15px; right: 15px; }
}
</style>