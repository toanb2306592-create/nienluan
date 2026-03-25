<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

const route = useRoute();
const router = useRouter();

// --- CẤU HÌNH ---
const timeout = ref(null);
const offlineTimeout = ref(null);
const INACTIVITY_TIME = 3 * 60 * 1000; // 3 phút
const OFFLINE_TIME = 3 * 60 * 1000;    // 3 phút offline

// --- HÀM ĐĂNG XUẤT ---
const logout = (message) => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  alert(message);
  router.push("/");
};

// --- HÀM TỰ ĐỘNG ĐĂNG XUẤT KHI KHÔNG THAO TÁC ---
const resetTimer = () => {
  if (timeout.value) clearTimeout(timeout.value);
  const user = localStorage.getItem("user");
  if (user) {
    timeout.value = setTimeout(() => logout("Phiên đăng nhập đã hết hạn do không có thao tác trong 3 phút."), INACTIVITY_TIME);
  }
};

// --- HÀM KIỂM TRA TRẠNG THÁI ONLINE ---
const handleOffline = () => {
  // Bắt đầu đếm thời gian offline
  if (offlineTimeout.value) clearTimeout(offlineTimeout.value);
  const user = localStorage.getItem("user");
  if (user) {
    offlineTimeout.value = setTimeout(() => logout("Bạn đã offline quá 3 phút, vui lòng đăng nhập lại."), OFFLINE_TIME);
  }
};

const handleOnline = () => {
  // Khi online trở lại, reset bộ đếm offline
  if (offlineTimeout.value) clearTimeout(offlineTimeout.value);
  resetTimer();
};

const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

onMounted(() => {
  // Lắng nghe thao tác người dùng
  events.forEach(event => window.addEventListener(event, resetTimer));
  resetTimer(); // Kích hoạt lần đầu

  // Lắng nghe trạng thái online/offline
  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);
});

onUnmounted(() => {
  // Dọn dẹp sự kiện
  events.forEach(event => window.removeEventListener(event, resetTimer));
  window.removeEventListener('offline', handleOffline);
  window.removeEventListener('online', handleOnline);
  
  if (timeout.value) clearTimeout(timeout.value);
  if (offlineTimeout.value) clearTimeout(offlineTimeout.value);
});
</script>

<template>
  <Header v-if="!route.path.startsWith('/admin')" />
  
  <router-view />

  <Footer v-if="!route.path.startsWith('/admin')" />
</template>

<style>
body {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
}

h1, h2, h3 {
  font-weight: 600;
}
</style>