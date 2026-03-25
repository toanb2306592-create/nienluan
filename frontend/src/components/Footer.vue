<template>
  <footer class="footer">
    <div class="footer-content">

      <div class="logo" @click="$router.push('/')">
        <img src="@/assets/images/logos/moon.png" alt="logo" />
        <span>MOON MART</span>
      </div>

      <div class="menu">
        <h3>Điều hướng</h3>
        <p @click="$router.push('/')">Trang chủ</p>
        <p @click="$router.push('/products')">Sản phẩm</p>
        <p @click="$router.push('/cart')">Giỏ hàng</p>
      </div>

      <div class="contact">
        <h3>Liên hệ</h3>
        <p>📍 123 Đường Số 1, TP. HCM</p>
        <p>📧 support@moonmart.com</p>
        <p>📞 Hotline: 1900 1234</p>
      </div>

    </div>

    <div class="copyright">
      © 2026 <b>MOON MART</b> - Hệ thống mua sắm trực tuyến tin cậy
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #ffffff;
  color: #333;
  margin-top: 60px;
  /* Đã đổi: Thanh kẻ trên cùng dùng màu chủ đạo */
  border-top: 4px solid #164668;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 40px 10%;
  gap: 30px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 800;
  /* Đã đổi: Màu chủ đạo */
  color: #164668;
  cursor: pointer;
}

.logo img {
  height: 45px;
  filter: drop-shadow(0 2px 4px rgba(22, 70, 104, 0.2));
}

.footer h3 {
  /* Đã đổi: Tiêu đề cột dùng màu chủ đạo */
  color: #164668;
  margin-bottom: 18px;
  font-size: 18px;
  position: relative;
  font-weight: 700;
}

.footer h3::after {
  content: "";
  display: block;
  width: 35px;
  height: 3px;
  /* Đã đổi: Gạch chân tiêu đề */
  background: #164668;
  margin-top: 5px;
}

.footer p {
  margin: 10px 0;
  cursor: pointer;
  font-size: 15px;
  color: #555;
  transition: all 0.3s ease;
}

.footer p:hover {
  /* Đã đổi: Hover ra màu chủ đạo và đẩy nhẹ sang phải */
  color: #164668;
  padding-left: 8px;
  font-weight: 500;
}

.copyright {
  text-align: center;
  padding: 20px;
  /* Đã đổi: Nền copyright xanh đậm, chữ trắng cho sang trọng */
  background: #164668;
  font-size: 14px;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.copyright b {
  color: #ffffff;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
    align-items: center;
    padding: 30px 20px;
  }
  .footer h3::after { 
    margin: 5px auto; 
  }
}
</style>