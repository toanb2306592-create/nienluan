<template>
  <div class="navbar">
    <button 
      class="nav-item" 
      :class="{ active: route.path === '/products' }" 
      @click="router.push('/products')"
    >
      Tất cả sản phẩm
    </button>

    <button
      v-for="item in menu"
      :key="item._id"
      @click="goCategory(item._id)"
      :class="['nav-item', { active: route.params.id == item._id }]"
    >
      {{ item.categoryName || item.name }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getCategories } from "@/services/category";

const menu = ref([]);
const router = useRouter();
const route = useRoute();

const goCategory = (id) => {
  router.push(`/category/${id}`);
};

onMounted(async () => {
  try {
    const res = await getCategories();
    menu.value = res.data;
  } catch (err) {
    console.error("Lỗi load categories:", err);
  }
});
</script>

<style scoped>
.navbar {
  background: #ffffff;
  padding: 15px 40px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  /* Đã đổi: Đường viền dưới hơi xanh nhẹ để hài hòa */
  border-bottom: 1px solid rgba(22, 70, 104, 0.1); 
  box-shadow: 0 4px 12px rgba(22, 70, 104, 0.04);
  position: sticky;
  top: 70px; /* Tùy chỉnh theo chiều cao Header của bạn để nó dính dưới Header */
  z-index: 99;
}

.nav-item {
  background: #f8fafc; /* Màu nền xám xanh rất nhạt */
  border: 1px solid #e2e8f0;
  color: #64748b; /* Màu chữ slate xám chuyên nghiệp */
  padding: 8px 22px;
  border-radius: 50px; 
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 500;
  outline: none;
}

/* Hiệu ứng khi đưa chuột vào (Hover) */
.nav-item:hover {
  background: rgba(22, 70, 104, 0.05); /* Nền xanh nhạt */
  border-color: #164668; /* Viền màu chủ đạo */
  color: #164668; /* Chữ màu chủ đạo */
  transform: translateY(-2px);
}

/* Hiệu ứng khi đang chọn (Active) */
.nav-item.active {
  background: #164668; /* ĐÃ ĐỔI: Màu chủ đạo */
  color: #ffffff;
  border-color: #164668;
  font-weight: 600;
  box-shadow: 0 6px 15px rgba(22, 70, 104, 0.25);
}

/* Hiệu ứng nhấn (Active state của trình duyệt) */
.nav-item:active {
  transform: scale(0.95);
}

/* Responsive cho điện thoại */
@media (max-width: 768px) {
  .navbar {
    padding: 12px 15px;
    gap: 8px;
    justify-content: flex-start; /* Cho phép cuộn ngang nếu quá nhiều danh mục */
    overflow-x: auto;
    white-space: nowrap;
    -ms-overflow-style: none;  /* Ẩn thanh cuộn IE */
    scrollbar-width: none;  /* Ẩn thanh cuộn Firefox */
  }
  
  .navbar::-webkit-scrollbar {
    display: none; /* Ẩn thanh cuộn Chrome */
  }

  .nav-item {
    padding: 6px 18px;
    font-size: 13px;
    flex-shrink: 0; /* Đảm bảo nút không bị co lại trên mobile */
  }
}
</style>