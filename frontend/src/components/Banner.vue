<template>
  <div class="banner-slider" @mouseenter="pauseSlide" @mouseleave="startSlide">
    
    <div
      v-for="(banner, index) in banners"
      :key="banner.id"
      class="banner"
      :class="{ active: index === currentIndex }"
      :style="{ backgroundImage: `linear-gradient(rgba(22, 70, 104, 0.5), rgba(0, 0, 0, 0.7)), url(${banner.image})` }"
    >
      <div class="banner-content">
        <h1>{{ banner.title }}</h1>
        <p>{{ banner.subtitle }}</p>
        <button class="nav-btn" @click="router.push(banner.link)">
          {{ banner.btnText }}
        </button>
      </div>
    </div>

    <button class="arrow left-arrow" @click="prevSlide">❮</button>
    <button class="arrow right-arrow" @click="nextSlide">❯</button>

    <div class="dots">
      <span
        v-for="(banner, index) in banners"
        :key="'dot-' + banner.id"
        class="dot"
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
      ></span>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentIndex = ref(0);
let slideInterval = null;

const banners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80",
    title: "MOON OCEAN MART",
    subtitle: "Trải nghiệm mua sắm thông minh & Sản phẩm chất lượng cao cho mọi gia đình.",
    btnText: "🛒 KHÁM PHÁ NGAY",
    link: "/products"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1920&q=80",
    title: "THỰC PHẨM SẠCH MỖI NGÀY",
    subtitle: "Chúng tôi cam kết nguồn gốc rõ ràng, an toàn vệ sinh thực phẩm hàng đầu.",
    btnText: "🛒 XEM GIỎ HÀNG",
    link: "/products"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1920&q=80",
    title: "ƯU ĐÃI ĐỘC QUYỀN",
    subtitle: "Đăng ký thành viên để nhận ngay voucher giảm giá và tích điểm đổi quà.",
    btnText: "🛒 MUA NGAY KẺO LỠ",
    link: "/products"
  }
];

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % banners.length;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + banners.length) % banners.length;
};

const goToSlide = (index) => {
  currentIndex.value = index;
};

const startSlide = () => {
  slideInterval = setInterval(nextSlide, 5000);
};

const pauseSlide = () => {
  clearInterval(slideInterval);
};

onMounted(() => {
  startSlide();
});

onUnmounted(() => {
  pauseSlide();
});
</script>

<style scoped>
.banner-slider {
  position: relative;
  height: 500px;
  overflow: hidden;
  background-color: #164668; 
}

.banner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 20px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.8s ease-in-out, visibility 0.8s ease-in-out;
  z-index: 0;
}

.banner.active {
  opacity: 1;
  visibility: visible;
  z-index: 1;
}

.banner-content {
  max-width: 900px;
  transform: translateY(30px);
  transition: transform 0.8s ease-out;
}

.banner.active .banner-content {
  transform: translateY(0);
}

.banner h1 {
  color: #ffffff;
  font-size: 60px;
  font-weight: 800;
  margin-bottom: 20px;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.banner p {
  color: #f1f1f1;
  font-size: 22px;
  margin-bottom: 35px;
  font-weight: 300;
}

/* NÚT BẤM CHÍNH - MÀU #164668 */
.nav-btn {
  padding: 16px 40px;
  font-size: 18px;
  font-weight: 700;
  background: #164668; /* MÀU CHỦ ĐẠO */
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.nav-btn:hover {
  background: #ffffff;
  color: #164668; /* Đổi màu chữ sang xanh khi hover trắng */
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

/* MŨI TÊN */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 24px;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
  border-radius: 50%;
  backdrop-filter: blur(5px);
}

.arrow:hover {
  background: #164668;
  border-color: #164668;
}

.left-arrow { left: 30px; }
.right-arrow { right: 30px; }

/* DẤU CHẤM ĐIỀU HƯỚNG */
.dots {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 2;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.4s ease;
}

.dot.active {
  background: #ffffff;
  width: 35px; /* Hiệu ứng gạch ngang dài khi active */
}

@media (max-width: 768px) {
  .banner-slider { height: 400px; }
  .banner h1 { font-size: 32px; }
  .banner p { font-size: 16px; }
  .arrow { display: none; } /* Ẩn mũi tên trên mobile cho gọn */
}
</style>