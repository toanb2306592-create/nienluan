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

      <div v-else class="user-menu-wrapper">
        <div class="user-info-trigger">
          <span class="greeting">👋 Chào, <b>{{ user.name }}</b></span>
          <i class="fas fa-chevron-down caret-icon"></i>
        </div>
        
        <div class="user-dropdown">
          <div class="dropdown-item" @click="router.push('/orders')">
            <i class="fas fa-box-open"></i>
            <span>Đơn hàng của tôi</span>
          </div>

          <div class="dropdown-item" @click="router.push('/status-history')">
            <i class="fas fa-history"></i>
            <span>Lịch sử mua hàng</span>
          </div>

          <div class="dropdown-item" @click="router.push('/profile')">
            <i class="fas fa-user-circle"></i>
            <span>Thông tin tài khoản</span>
          </div>

          <div class="dropdown-divider"></div>
          <div class="dropdown-item logout-item" @click="handleLogoutManual">
            <i class="fas fa-sign-out-alt"></i>
            <span>Đăng xuất</span>
          </div>
        </div>
      </div>

      <div class="cart-box" @click="handleCartClick">
        <div class="cart-icon-wrapper">
          <span class="icon">🛒</span>
          </div>
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

const checkUserStatus = () => {
  const u = localStorage.getItem("user");
  if (u) {
    user.value = JSON.parse(u);
    resetTimer(); 
  } else {
    user.value = null;
  }
};

const handleCloseModal = () => {
  showModal.value = false;
  checkUserStatus();
};

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

const handleLogoutManual = () => performLogout();

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
  checkUserStatus();
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
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  color: #333;
  padding: 12px 40px;
  box-shadow: 0 4px 15px rgba(22, 70, 104, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 900;
  color: #164668;
  cursor: pointer;
  letter-spacing: -0.5px;
}
.logo img { height: 38px; object-fit: contain; }

.search-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid #164668;
  border-radius: 50px;
  overflow: hidden;
  width: 420px;
  background: white;
  transition: box-shadow 0.3s;
}
.search-wrapper:focus-within {
  box-shadow: 0 0 0 4px rgba(22, 70, 104, 0.1);
}
.search { flex: 1; padding: 10px 18px; border: none; outline: none; font-size: 14px; }
.search-btn {
  background: #164668;
  color: white;
  border: none;
  padding: 10px 22px;
  font-weight: 700;
  cursor: pointer;
}

.right { display: flex; align-items: center; gap: 28px; }

.user-menu-wrapper { position: relative; padding: 10px 0; }
.user-info-trigger { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14.5px; color: #334155; }
.caret-icon { font-size: 10px; color: #94a3b8; transition: transform 0.3s; }

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 220px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  border: 1px solid #f1f5f9;
  padding: 8px;
  display: none;
  flex-direction: column;
  z-index: 1100;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.user-menu-wrapper:hover .user-dropdown { display: flex; }
.user-menu-wrapper:hover .caret-icon { transform: rotate(180deg); }

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 8px;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-item i { font-size: 16px; width: 20px; text-align: center; color: #64748b; }
.dropdown-item:hover { background: #f1f5f9; color: #164668; }
.dropdown-item:hover i { color: #164668; }

.dropdown-divider { height: 1px; background: #f1f5f9; margin: 6px 0; }
.logout-item { color: #ef4444 !important; }
.logout-item i { color: #ef4444 !important; }
.logout-item:hover { background: #fef2f2 !important; }

.cart-box { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.cart-info { display: flex; flex-direction: column; line-height: 1.2; }
.cart-info b { font-size: 14px; color: #1e293b; }
.cart-info small { font-size: 12px; color: #e53935; font-weight: 700; }

.action-btn { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 15px; }
.icon { font-size: 22px; }

@media (max-width: 850px) {
  .header { flex-direction: column; padding: 15px 20px; gap: 15px; }
  .search-wrapper { width: 100%; }
  .right { width: 100%; justify-content: space-around; }
}
</style>