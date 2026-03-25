<template>
  <div class="header">
    <div class="logo" @click="router.push('/')">
      <img src="@/assets/images/logos/moon.png" alt="logo" />
      <span>MOON MART</span>
    </div>

    <div class="search-wrapper">
      <input class="search" placeholder="🔍 Tìm kiếm rau củ, thịt cá, đồ gia dụng..." />
      <button class="search-btn">Tìm</button>
    </div>

    <div class="right">
      <div v-if="!user" class="action-btn" @click="showModal = true">
        <span class="icon">👤</span> 
        <b>Đăng nhập</b>
      </div>

      <div v-else class="user-box">
        <span class="greeting">👋 Chào, <b>{{ user.name }}</b></span>
        <button class="logout-btn" @click="handleLogoutManual">Thoát</button>
      </div>

      <div class="cart-box" @click="handleCartClick">
        <span class="icon">🛒</span>
        <div class="cart-info">
          <b>Giỏ hàng</b>
          <small>0 đ</small>
        </div>
      </div>
    </div>
  </div>

  <LoginModal 
    v-if="showModal" 
    @close="handleCloseModal"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import LoginModal from "./LoginModal.vue";

const showModal = ref(false);
const user = ref(null);
const router = useRouter();
const route = useRoute();

// --- ĐỒNG BỘ TRẠNG THÁI ---

// Hàm này cập nhật biến user từ localStorage
const checkUserStatus = () => {
  const u = localStorage.getItem("user");
  if (u) {
    user.value = JSON.parse(u);
    resetTimer(); // Kích hoạt lại bộ đếm thời gian khi có user
  } else {
    user.value = null;
  }
};

// Khi Modal đóng, Header cập nhật lại thông tin user ngay lập tức
const handleCloseModal = () => {
  showModal.value = false;
  checkUserStatus();
};

// --- CẤU HÌNH TỰ ĐỘNG ĐĂNG XUẤT (GIỮ NGUYÊN) ---
const timeout = ref(null);
const INACTIVITY_TIME = 3 * 60 * 1000; 
const OFFLINE_TIME = 3 * 60 * 1000;    

const offlineStartTime = ref(null);
let offlineInterval = null;

const performLogout = (message) => {
  user.value = null;
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  if (message) alert(message);
  router.push("/");
};

const handleLogoutManual = () => {
  performLogout(); 
};

const resetTimer = () => {
  if (!navigator.onLine) return;
  if (timeout.value) clearTimeout(timeout.value);
  if (user.value) {
    timeout.value = setTimeout(() => {
      performLogout("Phiên đăng nhập đã hết hạn do không có thao tác trong 3 phút.");
    }, INACTIVITY_TIME);
  }
};

const handleOffline = () => {
  offlineStartTime.value = Date.now();
  if (offlineInterval) clearInterval(offlineInterval);
  offlineInterval = setInterval(() => {
    if (!user.value) {
      clearInterval(offlineInterval);
      return;
    }
    const timeOffline = Date.now() - offlineStartTime.value;
    if (timeOffline >= OFFLINE_TIME) {
      clearInterval(offlineInterval);
      performLogout("Bạn đã offline quá 3 phút, hệ thống tự động đăng xuất để bảo mật.");
    }
  }, 1000);
};

const handleOnline = () => {
  offlineStartTime.value = null;
  if (offlineInterval) clearInterval(offlineInterval);
  resetTimer(); 
};

const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

onMounted(() => {
  checkUserStatus(); // Kiểm tra khi vừa load trang

  events.forEach(event => window.addEventListener(event, resetTimer));
  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);

  if (!navigator.onLine) handleOffline();
});

onUnmounted(() => {
  events.forEach(event => window.removeEventListener(event, resetTimer));
  window.removeEventListener('offline', handleOffline);
  window.removeEventListener('online', handleOnline);
  if (timeout.value) clearTimeout(timeout.value);
  if (offlineInterval) clearInterval(offlineInterval);
});

const handleCartClick = () => {
  if (!user.value) {
    showModal.value = true;
  } else {
    router.push("/cart");
  }
};
</script>

<style scoped>
/* CSS GIỮ NGUYÊN THEO STYLE CỦA BẠN */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  color: #333;
  padding: 15px 40px;
  box-shadow: 0 4px 12px rgba(22, 70, 104, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 800;
  color: #164668;
  cursor: pointer;
}

.logo img { height: 40px; object-fit: contain; }

.search-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid #164668;
  border-radius: 50px;
  overflow: hidden;
  width: 450px;
  background: white;
}

.search { flex: 1; padding: 10px 20px; border: none; outline: none; font-size: 15px; }

.search-btn {
  background: #164668;
  color: white;
  border: none;
  padding: 10px 25px;
  font-weight: bold;
  cursor: pointer;
}

.right { display: flex; align-items: center; gap: 25px; }

.action-btn, .cart-box {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.icon { font-size: 24px; }

.cart-info { display: flex; flex-direction: column; line-height: 1.2; }

.cart-info small { font-size: 13px; color: #e53935; font-weight: 600; }

.user-box { display: flex; align-items: center; gap: 15px; }

.logout-btn {
  padding: 6px 14px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  color: #555;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
}

.logout-btn:hover {
  background: #eef2f5;
  color: #164668;
  border-color: #164668;
}

@media (max-width: 768px) {
  .header { flex-direction: column; padding: 15px 20px; gap: 15px; }
  .search-wrapper { width: 100%; }
}
</style>