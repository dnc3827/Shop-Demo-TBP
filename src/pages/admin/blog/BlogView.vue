<template>
  <div class="admin-blog-page">
    <div class="page-header">
      <h1>Quản Lý Blog</h1>
      <button class="btn-create" @click="showCreateForm">
        <span>+</span> Tạo Blog Mới
      </button>
    </div>

    <!-- Blog List -->
    <div class="blog-list">
      <div v-if="blogs.length === 0" class="empty-state">
        Chưa có blog nào
      </div>

      <div v-for="blog in blogs" :key="blog.blogId" class="blog-card">
        <img :src="blog.imageUrl" :alt="blog.title" class="blog-image" />
        
        <div class="blog-content">
          <div class="blog-header">
            <h3>{{ blog.title }}</h3>
            <span :class="['status-badge', blog.isActive ? 'active' : 'inactive']">
              {{ blog.isActive ? 'Đang hiển thị' : 'Đã ẩn' }}
            </span>
          </div>

          <div class="blog-actions">
            <button class="btn-edit" @click="editBlog(blog)">
              ✏️ Sửa
            </button>
            <button class="btn-delete" @click="deleteBlog(blog.blogId)">
              🗑️ Xóa
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ editMode ? 'Chỉnh Sửa Blog' : 'Tạo Blog Mới' }}</h2>
          <button class="btn-close" @click="closeModal">×</button>
        </div>

        <form @submit.prevent="submitForm" class="blog-form">
          <div class="form-group">
            <label>Tiêu đề</label>
            <input
              v-model="formData.title"
              type="text"
              placeholder="Nhập tiêu đề blog"
              required
            />
          </div>

          <div class="mb-3">
              <label class="form-label fw-semibold">Ảnh blog</label>
              <input
                type="file"
                class="form-control"
                @change="onFileSelected"
                accept="image/*"
              />
            </div>

          <div class="form-group">
            <label>Nội dung</label>
            <textarea
              v-model="formData.content"
              placeholder="Nhập nội dung blog..."
              rows="10"
              required
            ></textarea>
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="formData.isActive" />
              <span>Hiển thị blog này</span>
            </label>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeModal">
              Hủy
            </button>
            <button type="submit" class="btn-save">
              {{ editMode ? 'Cập Nhật' : 'Tạo Blog' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/axios'

const blogs = ref([])
const showModal = ref(false)
const editMode = ref(false)

const selectedImageFile = ref(null)

const formData = ref({
  blogId: null,
  title: '',
  content: '',
  isActive: true
})

// ====== FILE SELECT ======
const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (!file) return
  selectedImageFile.value = file
}

// ====== LOAD BLOGS ======
const loadBlogs = async () => {
  const res = await api.get('/api/blogs')
  blogs.value = res.data
}

// ====== CREATE ======
const showCreateForm = () => {
  editMode.value = false
  selectedImageFile.value = null
  formData.value = {
    blogId: null,
    title: '',
    content: '',
    isActive: true
  }
  showModal.value = true
}

// ====== EDIT ======
const editBlog = async (blog) => {
  const res = await api.get(`/api/blogs/admin/${blog.blogId}`)

  editMode.value = true
  selectedImageFile.value = null

  formData.value = {
    blogId: res.data.blogId,
    title: res.data.title,
    content: res.data.content || '',
    isActive: res.data.isActive
  }
  showModal.value = true
}

// ====== SUBMIT ======
const submitForm = async () => {
  try {
    const fd = new FormData()
    if (editMode.value && formData.value.blogId) {
      fd.append('BlogId', formData.value.blogId.toString())
    }
    fd.append('Title', formData.value.title)
    fd.append('Content', formData.value.content)
    fd.append('IsActive', formData.value.isActive ? 'true' : 'false')

    if (selectedImageFile.value) {
      fd.append('imageFile', selectedImageFile.value)
    }

    let response;
    if (editMode.value) {
      response = await api.put('/api/blogs/update', fd)
      alert('✅ Cập nhật blog thành công')
    } else {
      response = await api.post('/api/blogs/create', fd)
      alert('✅ Tạo blog thành công')
    }

    // response.data bây giờ chính là Object sạch { blogId, title, content, imageUrl... }
    console.log("Dữ liệu trả về từ BE:", response.data);

    closeModal()
    loadBlogs() // Load lại danh sách để cập nhật ảnh mới và nội dung mới
  } catch (err) {
    // Sửa cách hiển thị lỗi để dễ debug
    const errorMsg = err.response?.data?.message || err.response?.data || 'Có lỗi xảy ra'
    console.error('Submit blog error:', errorMsg)
    alert('❌ ' + errorMsg)
  }
}


// ====== DELETE ======
const deleteBlog = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa blog này?')) return
  await api.delete(`/api/blogs/${id}`)
  loadBlogs()
}

// ====== CLOSE ======
const closeModal = () => {
  showModal.value = false
}

onMounted(loadBlogs)
</script>


<style scoped>
.admin-blog-page {
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2rem;
  color: #0b2c24;
}

.btn-create {
  background: #4a7c59;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.3s;
}

.btn-create:hover {
  background: #3a6547;
  transform: translateY(-2px);
}

.btn-create span {
  font-size: 1.5rem;
}

/* Blog List */
.blog-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px;
  color: #999;
  font-size: 1.2rem;
}

.blog-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  transition: 0.3s;
}

.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.blog-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.blog-content {
  padding: 20px;
}

.blog-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 20px;
  gap: 10px;
}

.blog-header h3 {
  font-size: 1.2rem;
  color: #2d3748;
  line-height: 1.4;
  flex: 1;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  white-space: nowrap;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.blog-actions {
  display: flex;
  gap: 10px;
}

.btn-edit, .btn-delete {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.btn-edit {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-edit:hover {
  background: #bbdefb;
}

.btn-delete {
  background: #ffebee;
  color: #c62828;
}

.btn-delete:hover {
  background: #ffcdd2;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  font-size: 1.5rem;
  color: #0b2c24;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
  line-height: 1;
}

.btn-close:hover {
  color: #333;
}

/* Form */
.blog-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2d3748;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4a7c59;
  box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
}

.image-preview {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 10px;
  border: 1px solid #e0e0e0;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 0;
}

.checkbox-group input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 30px;
}

.btn-cancel, .btn-save {
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-save {
  background: #4a7c59;
  color: white;
}

.btn-save:hover {
  background: #3a6547;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .admin-blog-page {
    padding: 20px;
  }

  .blog-list {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }
}
</style>