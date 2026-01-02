<template>
  <div class="container mt-4">
    <div class="card shadow-sm">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5 class="mb-0">📦 Product List</h5>

        <RouterLink
          to="/admin/products/create"
          class="btn btn-success"
        >
          + Add Product
        </RouterLink>
      </div>

      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th width="160">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="p in products" :key="p.id">
              <td>
                <img
                  v-if="p.imageUrl"
                  :src="`${apiBase}${p.imageUrl}`"
                  alt="product"
                  class="img-thumbnail"
                  style="width: 60px; height: 60px; object-fit: cover"
                />
                <span v-else class="text-muted">-</span>
              </td>

              <td>{{ p.name }}</td>

              <td class="fw-semibold">
                {{ formatPriceSafe(p.price) }}
              </td>

              <td>
                {{ p.description || "-" }}
              </td>

              <td>
                <RouterLink
                  :to="`/admin/products/edit/${p.id}`"
                  class="btn btn-sm btn-warning me-2"
                >
                  Edit
                </RouterLink>

                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteProduct(p.id)"
                >
                  Delete
                </button>
              </td>
            </tr>

            <tr v-if="products.length === 0">
              <td
                colspan="5"
                class="text-center text-muted py-3"
              >
                Không có sản phẩm
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/services/axios";

export default {
  name: "ProductList",

  data() {
    return {
      products: [],
      page: 1,
      size: 10,
      apiBase: import.meta.env.VITE_API_BASE_URL
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      try {
        const res = await api.get("/api/products", {
          params: {
            page: this.page,
            size: this.size
          }
        });

        console.log("API products:", res.data);

        this.products = Array.isArray(res.data)
          ? res.data
          : [];
      } catch (err) {
        console.error("Lỗi load sản phẩm:", err);
        this.products = [];
      }
    },

    async deleteProduct(id) {
      if (!confirm("Xóa sản phẩm này?")) return;

      try {
        await api.delete(`/api/products/${id}`);
        this.products = this.products.filter(p => p.id !== id);
      } catch (err) {
        console.error(err);
        alert("Không thể xóa sản phẩm");
      }
    },

    // ✅ CHỐNG CRASH
    formatPriceSafe(value) {
      const number = Number(value);
      if (Number.isNaN(number)) return "-";
      return number.toLocaleString("vi-VN") + " đ";
    }
  }
};
</script>
