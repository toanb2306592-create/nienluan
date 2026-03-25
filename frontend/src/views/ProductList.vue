<template>
  <div class="product-page-layout">
    <Navbar />

    <div class="product-page">
      <div class="container">
        <div class="page-header">
          <h2 class="title">{{ categoryName }}</h2>
          <p class="subtitle">Sản phẩm chất lượng, người người tin dùng</p>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải danh sách sản phẩm...</p>
        </div>

        <div v-else-if="products && products.length > 0" class="product-grid">
          <div 
            class="product-card" 
            v-for="p in products" 
            :key="p._id" 
            @click="goToDetail(p._id)"
          >
            <div class="image-wrapper">
              <img :src="getImageUrl(p.image)" :alt="p.productName" loading="lazy" />
              <div class="category-badge">{{ p.categoryId?.name || 'Sản phẩm' }}</div>
              
              <div class="card-overlay">
                <button class="view-detail-btn" @click.stop="goToDetail(p._id)">
                  <i class="fas fa-search-plus"></i> Xem chi tiết
                </button>
              </div>
            </div>
            
            <div class="card-info">
              <h3 class="product-name">{{ p.productName }}</h3>
              
              <div class="rating-row">
                <div class="stars">
                  <i v-for="i in 5" :key="i" 
                     :class="[i <= Math.round(p.rating || 5) ? 'fas fa-star filled' : 'far fa-star']">
                  </i>
                </div>
                <span class="review-count">({{ p.reviewCount || 0 }})</span>
              </div>

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
          <div class="empty-icon">
            <i class="fas fa-box-open"></i>
          </div>
          <h3>Ối! Chẳng có gì ở đây cả</h3>
          <p>Danh mục này hiện chưa có sản phẩm. Vui lòng quay lại sau nhé!</p>
          <button class="btn-back" @click="router.push('/products')">Xem tất cả sản phẩm</button>
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

// Tên danh mục hiển thị động
const categoryName = computed(() => {
  if (route.params.id && products.value.length > 0) {
    return products.value[0].categoryId?.name.toUpperCase();
  }
  return "TẤT CẢ SẢN PHẨM";
});

// Hàm lấy dữ liệu từ API
const loadProducts = async () => {
  loading.value = true;
  try {
    const res = await getProducts();
    const categoryId = route.params.id;

    if (categoryId) {
      // Lọc sản phẩm theo Category ID từ URL
      products.value = res.data.filter(p => p.categoryId?._id === categoryId);
    } else {
      products.value = res.data;
    }
  } catch (err) { 
    console.error("Lỗi tải danh sách sản phẩm:", err); 
  } finally {
    loading.value = false;
  }
};

// Chuyển hướng sang trang chi tiết
const goToDetail = (id) => {
  router.push(`/product/${id}`);
};

// Thêm nhanh vào giỏ hàng
const quickAddToCart = async (product) => {
  const userData = localStorage.getItem("user");
  if (!userData) return alert("Bạn cần đăng nhập để mua hàng!");

  try {
    const user = JSON.parse(userData);
    await addCartAPI({
      userId: user._id,
      productId: product._id,
      quantity: 1
    });
    alert(`Đã thêm ${product.productName} vào giỏ hàng!`);
  } catch (err) {
    alert("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
  }
};

// Theo dõi sự thay đổi của danh mục trên Navbar
watch(() => route.params.id, () => {
  loadProducts();
});

onMounted(loadProducts);

// Helper functions
const formatPrice = (p) => p ? Number(p).toLocaleString("vi-VN") + " đ" : "0 đ";
const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/400x400';
  return path.startsWith('http') ? path : `http://localhost:3000/${path.replace(/\\/g, '/')}`;
};
</script>

<style scoped>
.product-page-layout {
  background: #f8fafc;
  min-height: 100vh;
}

.product-page {
  padding: 40px 0 80px;
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* Header */
.page-header { text-align: center; margin-bottom: 50px; }
.title { color: #164668; font-size: 32px; font-weight: 800; margin-bottom: 12px; position: relative; display: inline-block; }
.title::after { content: ''; display: block; width: 60px; height: 4px; background: #164668; margin: 8px auto 0; border-radius: 2px; }
.subtitle { color: #64748b; font-size: 16px; }

/* Grid */
.product-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); 
  gap: 30px; 
}

/* Card Style */
.product-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 30px rgba(22, 70, 104, 0.08);
  border-color: #164668;
}

.image-wrapper {
  height: 240px;
  position: relative;
  background: #f8fafc;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.6s;
}

.product-card:hover .image-wrapper img { transform: scale(1.1); }

.category-badge {
  position: absolute; top: 15px; left: 15px;
  background: rgba(255, 255, 255, 0.95);
  color: #164668;
  padding: 5px 12px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.card-overlay {
  position: absolute; inset: 0;
  background: rgba(22, 70, 104, 0.2);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: 0.3s;
}

.product-card:hover .card-overlay { opacity: 1; }

.view-detail-btn {
  background: white; color: #164668; border: none;
  padding: 12px 24px; border-radius: 50px;
  font-weight: 700; font-size: 14px; cursor: pointer;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

/* Card Info */
.card-info { padding: 20px; }
.product-name {
  font-size: 17px; font-weight: 700; color: #1e293b;
  margin-bottom: 10px; line-height: 1.4;
  height: 48px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.rating-row { display: flex; align-items: center; gap: 8px; margin-bottom: 15px; }
.stars { color: #ffb800; font-size: 12px; }
.review-count { color: #94a3b8; font-size: 13px; }

.price-row { display: flex; justify-content: space-between; align-items: center; }
.current-price { color: #164668; font-size: 20px; font-weight: 800; }

.quick-add-btn {
  width: 42px; height: 42px; border-radius: 14px;
  background: #f0f7ff; color: #164668; border: none;
  cursor: pointer; transition: 0.3s;
}

.quick-add-btn:hover { 
  background: #164668; color: white; 
  transform: rotate(90deg);
}

/* States */
.loading-state { text-align: center; padding: 120px 0; }
.spinner { width: 45px; height: 45px; border: 4px solid #e2e8f0; border-top-color: #164668; border-radius: 50%; animation: spin 1s infinite linear; margin: 0 auto 20px; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state {
  text-align: center; padding: 80px 40px;
  background: white; border-radius: 30px;
  border: 2px dashed #e2e8f0;
}
.empty-icon { font-size: 60px; color: #cbd5e1; margin-bottom: 20px; }
.empty-state h3 { color: #1e293b; font-weight: 800; margin-bottom: 10px; }
.empty-state p { color: #64748b; margin-bottom: 30px; }
.btn-back {
  background: #164668; color: white; border: none;
  padding: 12px 30px; border-radius: 50px; font-weight: 700; cursor: pointer;
}

@media (max-width: 640px) {
  .product-grid { grid-template-columns: 1fr 1fr; gap: 15px; }
  .card-info { padding: 12px; }
  .product-name { font-size: 14px; height: 40px; }
  .current-price { font-size: 16px; }
}
</style>