<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-10">

        <div class="card shadow-sm">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">➕ Thêm sản phẩm</h5>
          </div>

          <div class="card-body">
            <form @submit.prevent="createProduct">

              <!-- NAME -->
              <div class="mb-3">
                <label class="form-label fw-semibold">
                  Tên sản phẩm
                </label>
                <input
                  v-model="product.name"
                  class="form-control"
                  placeholder="Nhập tên sản phẩm"
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
                  placeholder="Nhập giá"
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
                  placeholder="Nhập mô tả sản phẩm..."
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
                  placeholder="/images/"
                />
              </div>

              <!-- IMAGE PREVIEW -->
              <div v-if="product.imageUrl" class="mt-2">
                <label class="form-label fw-semibold">Preview:</label>
                <img 
                  :src="product.imageUrl" 
                  alt="Product Image" 
                  class="img-fluid" 
                  style="max-height: 200px;"
                />
              </div>

              <!-- ACTION -->
              <div class="d-flex gap-2 mt-4">
                <button type="submit" class="btn btn-success px-4">
                  Lưu
                </button>

                <RouterLink
                  to="/admin/products"
                  class="btn btn-secondary px-4"
                >
                  Hủy
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
  name: "CreateProduct",

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
    await this.loadCategories();
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

    async createProduct() {
      if (!this.product.categoryId) {
        alert("Vui lòng chọn danh mục");
        return;
      }

      try {
        await api.post("/api/products", this.product);
        alert("Tạo sản phẩm thành công");
        this.$router.push("/admin/products");
      } catch (err) {
        console.error(err);
        alert("Bạn chưa đăng nhập Admin hoặc lỗi dữ liệu");
      }
    }
  }
};
</script>
