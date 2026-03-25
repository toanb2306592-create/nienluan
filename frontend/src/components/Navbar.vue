<template>
  <div class="navbar-wrapper">
    <div class="navbar-container">
      <button 
        class="nav-item" 
        :class="{ active: route.path === '/products' }" 
        @click="router.push('/products')"
      >
        <i class="fas fa-th-large"></i>
        <span>Tất cả sản phẩm</span>
      </button>

      <button
        v-for="item in menu"
        :key="item._id"
        @click="goCategory(item._id)"
        :class="['nav-item', { active: route.params.id == item._id }]"
      >
        <i class="fas fa-tag"></i>
        <span>{{ item.categoryName || item.name }}</span>
      </button>
    </div>
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
/* Import lại FontAwesome để đồng bộ icon với Header */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.navbar-wrapper {
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  position: sticky;
  top: 64px; /* Khớp với chiều cao Header của bạn */
  z-index: 999;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 40px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
}

/* Ẩn thanh cuộn Chrome/Safari */
.navbar-container::-webkit-scrollbar {
  display: none;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid transparent;
  color: #475569; /* Màu Slate nhẹ nhàng */
  padding: 8px 20px;
  border-radius: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.nav-item i {
  font-size: 13px;
  color: #94a3b8;
  transition: color 0.25s;
}

/* Hover: Nhẹ nhàng, chuyên nghiệp */
.nav-item:hover {
  background: #f1f5f9;
  color: #164668;
}

.nav-item:hover i {
  color: #164668;
}

/* Active: Đậm chất thương hiệu Moon Mart */
.nav-item.active {
  background: #164668;
  color: #ffffff;
  border-color: #164668;
  box-shadow: 0 4px 12px rgba(22, 70, 104, 0.2);
}

.nav-item.active i {
  color: #ffffff;
}

/* Hiệu ứng bấm */
.nav-item:active {
  transform: scale(0.96);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .navbar-wrapper {
    top: 0; /* Có thể điều chỉnh tùy layout mobile */
  }
  
  .navbar-container {
    padding: 10px 15px;
    gap: 8px;
  }

  .nav-item {
    padding: 7px 16px;
    font-size: 13px;
    border-radius: 10px;
    background: #f8fafc; /* Hiện rõ nút hơn trên mobile */
    border: 1px solid #e2e8f0;
  }
}
</style>