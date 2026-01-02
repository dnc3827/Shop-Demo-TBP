<template>
  <div class="blog-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải bài viết...</p>
    </div>

    <!-- Blog Content -->
    <div v-else-if="blog" class="blog-container">
      <!-- Back Button -->
      <button class="btn-back" @click="goBack">
        <span class="back-icon">←</span>
        <span>Quay lại</span>
      </button>

      <!-- Blog Article -->
      <article class="blog-article">
        <!-- Featured Image -->
        <div class="blog-featured-image">
          <img :src="blog.imageUrl" :alt="blog.title" />
        </div>

        <!-- Blog Header -->
        <div class="blog-header">
          <h1>{{ blog.title }}</h1>
          <div class="blog-meta">
            <span class="meta-item">
              <span class="icon">📅</span>
              <span>{{ formatDate(new Date()) }}</span>
            </span>
            <span class="meta-item">
              <span class="icon">👁️</span>
              <span>Đọc 3 phút</span>
            </span>
          </div>
        </div>

        <!-- Blog Content -->
        <div class="blog-content" v-html="formattedContent"></div>

        <!-- Share Section -->
        <div class="blog-share">
          <h3>Chia sẻ bài viết</h3>
          <div class="share-buttons">
            <button class="share-btn facebook" @click="shareToFacebook">
              <span>f</span> Facebook
            </button>
            <button class="share-btn twitter" @click="shareToTwitter">
              <span>🐦</span> Twitter
            </button>
            <button class="share-btn link" @click="copyLink">
              <span>🔗</span> Copy Link
            </button>
          </div>
        </div>
      </article>

      <!-- Related Blogs -->
      <section v-if="relatedBlogs.length > 0" class="related-section">
        <h2>Bài viết liên quan</h2>
        <p class="related-subtitle">Khám phá thêm các bài viết thú vị khác</p>
        
        <div class="related-grid">
          <div
            v-for="item in relatedBlogs"
            :key="item.blogId"
            class="related-card"
            @click="goToDetail(item.blogId)"
          >
            <div class="related-image">
              <img :src="item.imageUrl" :alt="item.title" />
            </div>
            <div class="related-info">
              <h3>{{ item.title }}</h3>
              <button class="btn-read-related">
                Đọc thêm →
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Back to Top Button -->
      <button 
        v-if="showBackToTop" 
        class="btn-back-to-top" 
        @click="scrollToTop"
      >
        ↑
      </button>
    </div>

    <!-- Error State -->
    <div v-else class="error-state">
      <div class="error-icon">😕</div>
      <h2>Không tìm thấy bài viết</h2>
      <p>Bài viết này có thể đã bị xóa hoặc không tồn tại.</p>
      <button @click="goBack" class="btn-back-error">Quay lại trang Blog</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/axios'

const route = useRoute()
const router = useRouter()

const blog = ref(null)
const relatedBlogs = ref([])
const loading = ref(true)
const showBackToTop = ref(false)

// Format content with line breaks
const formattedContent = computed(() => {
  if (!blog.value?.content) return ''
  
  // Replace line breaks with proper HTML
  let content = blog.value.content
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
  
  return `<p>${content}</p>`
})

// Format date
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('vi-VN', options)
}

// Load blog
const loadBlog = async () => {
  loading.value = true
  try {
    const id = route.params.id
    const res = await api.get(`/api/blogs/${id}`)
    blog.value = res.data

    // Load related blogs
    const allBlogs = await api.get('/api/blogs')
    relatedBlogs.value = allBlogs.data
      .filter(b => b.blogId !== blog.value.blogId)
      .slice(0, 3)
  } catch (err) {
    console.error(err)
    blog.value = null
  } finally {
    loading.value = false
  }
}

// Navigation
const goBack = () => {
  router.push('/blogs')
}

const goToDetail = (id) => {
  router.push(`/blogs/${id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
  loadBlog()
}

// Share functions
const shareToFacebook = () => {
  const url = encodeURIComponent(window.location.href)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
}

const shareToTwitter = () => {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(blog.value.title)
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert('✅ Đã sao chép link!')
  } catch (err) {
    console.error(err)
    alert('❌ Không thể sao chép link')
  }
}

// Scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Handle scroll event for back to top button
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 500
}

onMounted(() => {
  loadBlog()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.blog-detail-page {
  min-height: 100vh;
  background: #fcfcfc;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f0f0f0;
  border-top-color: #4a7c59;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #666;
  font-size: 1.1rem;
}

/* Blog Container */
.blog-container {
  max-width: 97%;
  margin: 0 auto;
  padding: 60px 20px 100px;
  position: relative;
}

/* Back Button */
.btn-back {
  background: white;
  border: 2px solid #0b2c24;
  color: #0b2c24;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  margin-bottom: 40px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.btn-back:hover {
  background: #0b2c24;
  color: white;
  transform: translateX(-5px);
}

.back-icon {
  font-size: 1.3rem;
  transition: 0.3s;
}

.btn-back:hover .back-icon {
  transform: translateX(-3px);
}

/* Blog Article */
.blog-article {
  background: white;
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  overflow: hidden;
}

.blog-featured-image {
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.blog-featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Blog Header */
.blog-header {
  padding: 50px 60px 30px;
}

.blog-header h1 {
  font-size: 3rem;
  color: #0b2c24;
  line-height: 1.3;
  margin-bottom: 25px;
  font-weight: 700;
}

.blog-meta {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 1rem;
}

.meta-item .icon {
  font-size: 1.2rem;
}

/* Blog Content */
.blog-content {
  padding: 30px 60px 50px;
  font-size: 1.15rem;
  line-height: 1.9;
  color: #2d3748;
}

.blog-content::v-deep(p) {
  margin-bottom: 1.5em;
}

.blog-content::v-deep(br) {
  display: block;
  margin-bottom: 0.5em;
}

/* Share Section */
.blog-share {
  padding: 40px 60px 50px;
  border-top: 2px solid #f0f0f0;
}

.blog-share h3 {
  font-size: 1.5rem;
  color: #0b2c24;
  margin-bottom: 20px;
  font-weight: 600;
}

.share-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.share-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.share-btn span {
  font-size: 1.2rem;
}

.share-btn.facebook {
  background: #1877f2;
  color: white;
}

.share-btn.facebook:hover {
  background: #0d65d9;
  transform: translateY(-2px);
}

.share-btn.twitter {
  background: #1da1f2;
  color: white;
}

.share-btn.twitter:hover {
  background: #0c8cd6;
  transform: translateY(-2px);
}

.share-btn.link {
  background: #4a7c59;
  color: white;
}

.share-btn.link:hover {
  background: #3a6547;
  transform: translateY(-2px);
}

/* Related Section */
.related-section {
  margin-top: 80px;
}

.related-section h2 {
  font-size: 2.5rem;
  color: #0b2c24;
  margin-bottom: 10px;
  font-weight: 700;
}

.related-subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 40px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.related-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.4s;
  border: 1px solid #f0f0f0;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.related-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 35px rgba(0,0,0,0.12);
}

.related-image {
  height: 200px;
  overflow: hidden;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.6s;
}

.related-card:hover .related-image img {
  transform: scale(1.1);
}

.related-info {
  padding: 25px;
}

.related-info h3 {
  font-size: 1.15rem;
  color: #2d3748;
  line-height: 1.5;
  margin-bottom: 15px;
  height: 70px;
  overflow: hidden;
  display: -webkit-box;
-webkit-line-clamp: 3; 
line-clamp: 3;
  -webkit-box-orient: vertical;
  font-weight: 600;
}

.btn-read-related {
  background: transparent;
  border: 2px solid #0b2c24;
  color: #0b2c24;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  font-size: 0.9rem;
}

.btn-read-related:hover {
  background: #0b2c24;
  color: white;
}

/* Back to Top Button */
.btn-back-to-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 50px;
  height: 50px;
  background: #4a7c59;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  z-index: 100;
}

.btn-back-to-top:hover {
  background: #3a6547;
  transform: translateY(-5px);
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  gap: 20px;
  padding: 40px;
  text-align: center;
}

.error-icon {
  font-size: 5rem;
  margin-bottom: 10px;
}

.error-state h2 {
  font-size: 2rem;
  color: #0b2c24;
  margin-bottom: 10px;
}

.error-state p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.btn-back-error {
  background: #4a7c59;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  font-size: 1rem;
}

.btn-back-error:hover {
  background: #3a6547;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

/* Responsive */
@media (max-width: 1024px) {
  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .blog-container {
    padding: 40px 15px 80px;
  }

  .blog-article {
    border-radius: 12px;
  }

  .blog-featured-image {
    height: 300px;
  }

  .blog-header {
    padding: 40px 30px 20px;
  }

  .blog-header h1 {
    font-size: 2rem;
  }

  .blog-content {
    padding: 20px 30px 40px;
    font-size: 1.05rem;
  }

  .blog-share {
    padding: 30px 30px 40px;
  }

  .share-buttons {
    flex-direction: column;
  }

  .share-btn {
    width: 100%;
    justify-content: center;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }

  .related-section h2 {
    font-size: 2rem;
  }

  .btn-back-to-top {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
  }
}

@media (max-width: 480px) {
  .blog-header h1 {
    font-size: 1.6rem;
  }

  .blog-meta {
    flex-direction: column;
    gap: 10px;
  }

  .related-info h3 {
    height: auto;
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
}
</style>