<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-10">

        <div class="card shadow-sm">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0">✏️ Sửa sản phẩm</h5>
          </div>

          <div class="card-body">
            <form @submit.prevent="updateProduct">

              <!-- NAME -->
              <div class="mb-3">
                <label class="form-label fw-semibold">
                  Tên sản phẩm
                </label>
                <input
                  v-model="product.name"
                  class="form-control"
                  required
                />
              </div>

              <!-- PRICE -->
              <div class="mb-3">
                <label class="form-label fw-semibold">
                  Giá
                </label>
                <input
                  v-model.number="product.price"
                  type="number"
                  min="1"
                  class="form-control"
                  required
                />
              </div>

              <!-- CATEGORY -->
              <div class="mb-3">
                <label class="form-label fw-semibold">
                  Danh mục
                </label>
                <select
                  v-model.number="product.categoryId"
                  class="form-select"
                  required
                >
                  <option value="" disabled>
                    -- Chọn danh mục --
                  </option>
                  <option
                    v-for="c in categories"
                    :key="c.id"
                    :value="c.id"
                  >
                    {{ c.name }}
                  </option>
                </select>
              </div>

              <!-- DESCRIPTION -->
              <div class="mb-3">
                <label class="form-label fw-semibold">
                  Mô tả sản phẩm
                </label>
                <textarea
                  v-model="product.description"
                  class="form-control"
                  rows="4"
                ></textarea>
              </div>

              <!-- IMAGE -->
              <div class="mb-3">
                <label class="form-label fw-semibold">
                  Image URL
                </label>
                <input
                  v-model="product.imageUrl"
                  class="form-control"
                />
              </div>

              <!-- ACTION -->
              <div class="d-flex gap-2 mt-4">
                <button type="submit" class="btn btn-warning px-4">
                  Cập nhật
                </button>

                <RouterLink
                  to="/admin/products"
                  class="btn btn-secondary px-4"
                >
                  Quay lại
                </RouterLink>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import api from "@/services/axios";

export default {
  name: "EditProduct",

  data() {
    return {
      product: {
        name: "",
        price: null,
        imageUrl: "",
        description: "",
        categoryId: null
      },
      categories: []
    };
  },

  async mounted() {
    await Promise.all([
      this.loadCategories(),
      this.loadProduct()
    ]);
  },

  methods: {
    async loadCategories() {
      try {
        const res = await api.get("/api/categories");
        this.categories = res.data;
      } catch (err) {
        console.error(err);
        alert("Không tải được danh mục");
      }
    },

    async loadProduct() {
      try {
        const id = this.$route.params.id;
        const res = await api.get(`/api/products/${id}`);

        this.product = {
          name: res.data.name,
          price: res.data.price,
          imageUrl: res.data.imageUrl,
          description: res.data.description,
          categoryId: res.data.categoryId
        };
      } catch (err) {
        console.error(err);
        alert("Không tải được sản phẩm");
      }
    },

    async updateProduct() {
      try {
        const id = this.$route.params.id;
        await api.put(`/api/products/${id}`, this.product);

        alert("Cập nhật thành công");
        this.$router.push("/admin/products");
      } catch (err) {
        console.error(err);
        alert("Bạn chưa đăng nhập Admin hoặc lỗi dữ liệu");
      }
    }
  }
};
</script>
