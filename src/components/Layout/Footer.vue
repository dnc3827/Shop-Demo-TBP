<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-col brand-info">
        <h3 class="logo-text">DEMO_SHOP</h3>
        <p class="footer-desc">
          Hệ thống quản lý bán hàng hiện đại tích hợp Google Sheets. 
          Giải pháp tối ưu cho doanh nghiệp bán lẻ.
        </p>
      </div>

      <div class="footer-col">
        <h4>Về chúng tôi</h4>
        <ul class="footer-links">
          <li><a href="#">Giới thiệu</a></li>
          <li><a href="#">Chính sách bảo mật</a></li>
          <li><a href="#">Điều khoản sử dụng</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Hỗ trợ khách hàng</h4>
        <ul class="footer-links">
          <li><a href="#">Trung tâm trợ giúp</a></li>
          <li><a href="#">Hướng dẫn mua hàng</a></li>
          <li><a href="#">Liên hệ hỗ trợ</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Kết nối với chúng tôi</h4>
        <a href="https://www.facebook.com/profile.php?id=61563628149354" target="_blank" class="fb-link">
          <div class="fb-box">
             <span class="fb-icon">f</span>
             <span>Theo dõi trên Facebook</span>
          </div>
        </a>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 DEMO_Shop Project - Powered by Vue.js & ASP.NET Core</p>
    </div>
  </footer>
</template>

<style scoped>
.footer { 
  background: #0b2c24; /* Màu xanh đậm đồng bộ với Header */
  color: white; 
  padding: 60px 10% 20px; 
  border-top: 1px solid rgba(255,255,255,0.1);
}

.footer-container { 
  display: grid; 
  grid-template-columns: 1.5fr 1fr 1fr 1.2fr; 
  gap: 40px; 
}

.logo-text { 
  color: #cefe05; /* Màu vàng chanh làm điểm nhấn */
  margin-bottom: 20px; 
  font-size: 1.5rem; 
  font-weight: bold;
}

.footer-desc { 
  color: #a0aec0; 
  line-height: 1.6; 
  font-size: 0.9rem; 
}

h4 { 
  margin-bottom: 25px; 
  color: #fff; 
  font-size: 1.1rem; 
  position: relative;
}

/* Gạch chân dưới tiêu đề cột */
h4::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 30px;
  height: 2px;
  background: #cefe05;
}

.footer-links { 
  list-style: none; 
  padding: 0; 
}

.footer-links li { 
  margin-bottom: 12px; 
}

.footer-links li a { 
  color: #a0aec0; 
  text-decoration: none; 
  transition: 0.3s; 
  font-size: 0.9rem;
}

.footer-links li a:hover { 
  color: #cefe05; 
  padding-left: 5px; 
}

/* Nút Facebook chuyên nghiệp */
.fb-link { 
  text-decoration: none; 
  color: white; 
}

.fb-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #1877F2; 
  padding: 12px 18px;
  border-radius: 8px;
  font-weight: 500;
  transition: 0.3s;
  width: fit-content;
  margin-top: 10px;
}

.fb-box:hover { 
  background: #166fe5; 
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(24, 119, 242, 0.3);
}

.fb-icon { 
  font-size: 1.2rem; 
  font-weight: bold; 
}

.footer-bottom {
  text-align: center;
  margin-top: 60px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.05);
  color: #718096;
  font-size: 0.85rem;
}

/* Responsive cho thiết bị di động */
@media (max-width: 1024px) {
  .footer-container { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 600px) {
  .footer-container { grid-template-columns: 1fr; }
  .footer { padding: 40px 5% 20px; }
}
</style>