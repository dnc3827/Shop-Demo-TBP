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
                <label class="form-label fw-semibold">Ảnh sản phẩm</label>
                <div class="mb-2" v-if="!previewUrl && product.imageUrl">
                  <small class="text-muted d-block">Ảnh hiện tại:</small>
                  <img :src="product.imageUrl" class="img-thumbnail" style="max-height: 100px;">
                </div>
                <input
                  type="file"
                  class="form-control"
                  @change="onFileSelected"
                  accept="image/*"
                />
                <small class="text-muted">Để trống nếu không muốn thay đổi ảnh</small>
              </div>

              <div v-if="previewUrl" class="mt-2">
                <label class="form-label fw-semibold text-success">Xem trước ảnh mới:</label>
                <img 
                  :src="previewUrl" 
                  class="img-fluid d-block rounded shadow-sm" 
                  style="max-height: 200px; border: 2px solid #ffc107;"
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
        imageUrl: "", // Link ảnh cũ từ DB
        description: "",
        categoryId: null
      },
      selectedFile: null, // File mới người dùng chọn
      previewUrl: null,   // Link xem trước ảnh mới
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
        this.product = res.data;
      } catch (err) {
        console.error(err);
        alert("Không tải được sản phẩm");
      }
    },

    // Hàm xử lý chọn ảnh mới
    onFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.previewUrl = URL.createObjectURL(file);
      }
    },

    async updateProduct() {
      try {
        const id = this.$route.params.id;

        // Chuyển sang FormData để gửi kèm file
        const formData = new FormData();
        formData.append("Name", this.product.name);
        formData.append("Price", this.product.price);
        formData.append("CategoryId", this.product.categoryId);
        formData.append("Description", this.product.description || "");
        
        // Nếu có chọn ảnh mới, gửi kèm qua key 'imageFile'
        if (this.selectedFile) {
          formData.append("imageFile", this.selectedFile);
        }

        await api.put(`/api/products/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        alert("Cập nhật thành công!");
        this.$router.push("/admin/products");
      } catch (err) {
        console.error(err);
        alert("Cập nhật thất bại. Kiểm tra lại dữ liệu hoặc quyền Admin.");
      }
    }
  }

};
</script>
