<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-6">

        <div class="card shadow-sm">
          <div class="card-header bg-warning">
            <h5 class="mb-0">✏️ Sửa danh mục</h5>
          </div>

          <div class="card-body">
            <form @submit.prevent="updateCategory">

              <div class="mb-3">
                <label class="form-label fw-semibold">Tên danh mục</label>
                <input v-model="form.name" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Slug</label>
                <input v-model="form.slug" class="form-control" required />
              </div>

              <div class="form-check mb-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="form.isActive"
                />
                <label class="form-check-label">
                  Kích hoạt
                </label>
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-warning">
                  Cập nhật
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
  name: "EditCategory",
  data() {
    return {
      form: {
        name: "",
        slug: "",
        isActive: true
      }
    };
  },

  async mounted() {
    await this.loadCategory();
  },

  methods: {
    async loadCategory() {
      try {
        const id = this.$route.params.id;
        const res = await api.get(`/api/categories/${id}`);

        this.form = {
          name: res.data.name,
          slug: res.data.slug,
          isActive: res.data.isActive
        };
      } catch (err) {
        console.error(err);
        alert("Không tải được danh mục");
      }
    },

    async updateCategory() {
      try {
        const id = this.$route.params.id;
        await api.put(`/api/categories/${id}`, this.form);

        alert("Cập nhật thành công");
        this.$router.push("/admin/categories");
      } catch (err) {
        console.error(err);
        alert("Cập nhật thất bại");
      }
    }
  }
};
</script>
