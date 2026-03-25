<template>
  <div class="product-page-layout">
    <Navbar />

    <div class="product-page">
      <div class="container">
        <div class="page-header">
          <h2 class="title">{{ categoryName }}</h2>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
        </div>

        <div v-else-if="products.length > 0" class="product-grid">
          <div 
            class="product-card" 
            v-for="p in products" 
            :key="p._id" 
            @click="goToDetail(p._id)"
          >
            <div class="image-wrapper">
              <img :src="getImageUrl(p.image)" :alt="p.productName" />
              
              <div class="card-overlay">
                <button class="view-detail-btn">Xem chi tiết</button>
              </div>
            </div>
            
            <div class="card-info">
              <h3 class="product-name">{{ p.productName }}</h3>
              
              <div class="price-row">
                <span class="current-price">{{ formatPrice(p.price) }}</span>
                <button class="quick-add-btn" @click.stop="quickAddToCart(p)">
                  <i class="fas fa-shopping-basket"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <i class="fas fa-box-open empty-icon"></i>
          <p>Danh mục này hiện chưa có sản phẩm.</p>
          <button class="btn-back" @click="router.push('/')">Quay lại</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getProducts, addToCart as addCartAPI } from "@/services/product";
import Navbar from "@/components/Navbar.vue";

const route = useRoute();
const router = useRouter();
const products = ref([]);
const loading = ref(true);

// Hiển thị tên danh mục lấy từ dữ liệu trả về
const categoryName = computed(() => {
  return products.value.length > 0 ? products.value[0].categoryId?.name : "DANH MỤC";
});

const loadProducts = async () => {
  loading.value = true;
  try {
    const res = await getProducts();
    const categoryId = route.params.id;
    // Lọc đúng sản phẩm của danh mục này
    products.value = res.data.filter(p => p.categoryId?._id === categoryId);
  } catch (err) {
    console.error("Lỗi:", err);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/400x400';
  return path.startsWith('http') ? path : `http://localhost:3000/${path.replace(/\\/g, '/')}`;
};

const formatPrice = (p) => p ? Number(p).toLocaleString("vi-VN") + " đ" : "0 đ";

const goToDetail = (id) => router.push(`/product/${id}`);

const quickAddToCart = async (product) => {
  const userData = localStorage.getItem("user");
  if (!userData) return alert("Vui lòng đăng nhập!");
  try {
    const user = JSON.parse(userData);
    await addCartAPI({ userId: user._id, productId: product._id, quantity: 1 });
    alert(`Đã thêm ${product.productName} vào giỏ!`);
  } catch (err) {
    alert("Lỗi thêm vào giỏ hàng!");
  }
};

watch(() => route.params.id, loadProducts);
onMounted(loadProducts);
</script>

<style scoped>
.product-page-layout { background: #f8fafc; min-height: 100vh; }
.product-page { padding: 40px 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

.page-header { text-align: center; margin-bottom: 40px; }
.title { color: #164668; font-size: 28px; font-weight: 800; text-transform: uppercase; }

.product-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); 
  gap: 25px; 
}

.product-card {
  background: white; border-radius: 20px; overflow: hidden;
  border: 1px solid #f1f5f9; transition: 0.3s; cursor: pointer;
}
.product-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.05); }

.image-wrapper { height: 220px; position: relative; overflow: hidden; background: #f8fafc; }
.image-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
.product-card:hover .image-wrapper img { transform: scale(1.08); }

.card-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.1);
  display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s;
}
.product-card:hover .card-overlay { opacity: 1; }

.view-detail-btn {
  background: white; color: #164668; border: none; padding: 10px 20px;
  border-radius: 50px; font-weight: 700; font-size: 13px;
}

.card-info { padding: 15px; }
.product-name {
  font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 12px;
  height: 40px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.price-row { display: flex; justify-content: space-between; align-items: center; }
.current-price { color: #164668; font-size: 18px; font-weight: 800; }

.quick-add-btn {
  width: 38px; height: 38px; border-radius: 12px; background: #f0f7ff; color: #164668; border: none; transition: 0.3s;
}
.quick-add-btn:hover { background: #164668; color: white; }

.loading-state { text-align: center; padding: 100px; }
.spinner { width: 40px; height: 40px; border: 3px solid #ddd; border-top-color: #164668; border-radius: 50%; animation: spin 1s infinite linear; margin: auto; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state { text-align: center; padding: 60px; color: #94a3b8; }
.empty-icon { font-size: 50px; margin-bottom: 15px; }
.btn-back { background: #164668; color: white; border: none; padding: 10px 25px; border-radius: 8px; cursor: pointer; margin-top: 15px; }
</style>