<template>
  <div class="container mt-4">
    <div class="card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">📂 Category List</h5>
        <RouterLink to="/admin/categories/create" class="btn btn-success">
          + Add Category
        </RouterLink>
      </div>

      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th width="160">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="c in categories" :key="c.id">
              <td>{{ c.id }}</td>
              <td>{{ c.name }}</td>
              <td>{{ c.slug }}</td>
              <td>
                <span
                  class="badge"
                  :class="c.isActive ? 'bg-success' : 'bg-secondary'"
                >
                  {{ c.isActive ? "Active" : "Inactive" }}
                </span>
              </td>
              <td>
                <RouterLink
                  :to="`/admin/categories/edit/${c.id}`"
                  class="btn btn-sm btn-warning me-2"
                >
                  Edit
                </RouterLink>
                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteCategory(c.id)"
                >
                  Delete
                </button>
              </td>
            </tr>

            <tr v-if="categories.length === 0">
              <td colspan="5" class="text-center text-muted py-3">
                Không có danh mục
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
  name: "CategoryList",
  data() {
    return {
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
        this.categories = Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.error(err);
        alert("Không tải được danh mục");
      }
    },

    async deleteCategory(id) {
      if (!confirm("Xóa danh mục này?")) return;

      try {
        await api.delete(`/api/categories/${id}`);
        this.categories = this.categories.filter(c => c.id !== id);
      } catch (err) {
        console.error(err);
        alert("Không thể xóa danh mục (có thể đang chứa sản phẩm)");
      }
    }
  }
};
</script>
