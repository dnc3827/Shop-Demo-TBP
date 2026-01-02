<template>
  <section class="product-container">
    <div
      class="product-card"
      v-for="p in products"
      :key="p.id"
    >
      <img
        :src="`${apiBase}${p.imageUrl}`"
        alt="product"
      />

      <h3>{{ p.name }}</h3>

      <p class="price">
        {{ formatPrice(p.price) }}
      </p>

      <button class="btn-buy">
        Mua ngay
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "@/services/axios"

const products = ref([])
const apiBase = import.meta.env.VITE_API_BASE_URL

const loadProducts = async () => {
  const res = await api.get("/api/products", {
    params: { page: 1, size: 20 }
  })
  products.value = res.data.data ?? res.data
}

const formatPrice = (price) =>
  price.toLocaleString("vi-VN") + " đ"

onMounted(loadProducts)
</script>

<style scoped>
.product-container {
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
}

.product-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 6px 15px rgba(0,0,0,0.08);
}

.product-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.price {
  font-weight: bold;
  margin: 10px 0;
}
</style>
