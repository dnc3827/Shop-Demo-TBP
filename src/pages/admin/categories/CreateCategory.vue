<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-6">

        <div class="card shadow-sm">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">➕ Thêm danh mục</h5>
          </div>

          <div class="card-body">
            <form @submit.prevent="createCategory">

              <div class="mb-3">
                <label class="form-label fw-semibold">Tên danh mục</label>
                <input v-model="form.name" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Slug</label>
                <input v-model="form.slug" class="form-control" required />
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-success">
                  Tạo mới
                </button>
                <RouterLink to="/admin/categories" class="btn btn-secondary">
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
  name: "CreateCategory",
  data() {
    return {
      form: {
        name: "",
        slug: ""
      }
    };
  },

  methods: {
    async createCategory() {
      try {
        await api.post("/api/categories", this.form);
        alert("Tạo danh mục thành công");
        this.$router.push("/admin/categories");
      } catch (err) {
        console.error(err);
        alert("Lỗi tạo danh mục");
      }
    }
  }
};
</script>
