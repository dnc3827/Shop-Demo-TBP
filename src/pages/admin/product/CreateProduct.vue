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
                <label class="form-label fw-semibold">Ảnh sản phẩm</label>
                <input
                  type="file"
                  class="form-control"
                  @change="onFileSelected"
                  accept="image/*"
                />
              </div>

              <div v-if="previewUrl" class="mt-2">
                <label class="form-label fw-semibold">Xem trước ảnh:</label>
                <img 
                  :src="previewUrl" 
                  alt="Product Image" 
                  class="img-fluid d-block rounded" 
                  style="max-height: 200px; border: 1px solid #ddd;"
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
        description: "",
        categoryId: null,
        // Bỏ imageUrl ở đây vì ta sẽ dùng file
      },
      selectedFile: null, // Thêm biến giữ file thực tế
      previewUrl: null,   // Thêm biến tạo link xem trước
      categories: []
    };
  },

  async mounted() {
    await this.loadCategories();
  },

  methods: {
    // 1. Giữ nguyên hàm này để lấy danh sách loại sản phẩm khi vào trang
    async loadCategories() {
      try {
        const res = await api.get("/api/categories");
        this.categories = res.data;
      } catch (err) {
        console.error(err);
        alert("Không tải được danh mục");
      }
    },

    // 2. Hàm mới để xử lý khi người dùng chọn file ảnh từ máy tính
    onFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.previewUrl = URL.createObjectURL(file); // Tạo link tạm để hiện ảnh lên màn hình
      }
    },

    // 3. Hàm tạo sản phẩm đã được nâng cấp để gửi File
    async createProduct() {
      if (!this.product.categoryId) {
        alert("Vui lòng chọn danh mục");
        return;
      }

      try {
        // Dùng FormData để gửi được File ảnh sang C#
        const formData = new FormData();
        formData.append("Name", this.product.name);
        formData.append("Price", this.product.price);
        formData.append("CategoryId", this.product.categoryId);
        formData.append("Description", this.product.description || "");
        
        // Gửi file thực tế với key 'imageFile' (phải khớp tham số bên C#)
        if (this.selectedFile) {
          formData.append("imageFile", this.selectedFile);
        }

        await api.post("/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        alert("✅ Tạo sản phẩm thành công và đã upload lên Cloudinary!");
        this.$router.push("/admin/products");
      } catch (err) {
        console.error(err);
        alert("❌ Lỗi: " + (err.response?.data?.message || "Không thể tạo sản phẩm"));
      }
    }
  }

};
</script>
