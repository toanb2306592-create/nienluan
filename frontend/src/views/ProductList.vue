<template>
  <div class="product-page-layout">
    <Navbar />

    <div class="product-page">
      <div class="container">
        <div class="page-header">
          <h2 class="title">TẤT CẢ SẢN PHẨM</h2>
          <p class="subtitle">Sản phẩm chất lượng, người người tin dùng</p>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải danh sách sản phẩm...</p>
        </div>

        <div v-else-if="products.length > 0" class="product-grid">
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
                <button class="view-detail-btn">
                  <i class="fas fa-search-plus"></i> Xem chi tiết
                </button>
              </div>
            </div>
            
            <div class="card-info">
              <h3 class="product-name">{{ p.productName }}</h3>
              
              <div class="rating-row">
                <div class="stars">
                  <i v-for="i in 5" :key="i" 
                     :class="[i <= Math.round(p.avgRating || 5) ? 'fas fa-star filled' : 'far fa-star']">
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
          <div class="empty-icon"><i class="fas fa-box-open"></i></div>
          <h3> Chẳng có gì ở đây cả</h3>
          <button class="btn-back" @click="loadProducts">Tải lại trang</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getProducts, addToCart as addCartAPI } from "@/services/product";
import { getAverageRating } from "@/services/review";
import Navbar from "@/components/Navbar.vue";

const router = useRouter();
const products = ref([]);
const loading = ref(true);

const loadProducts = async () => {
  loading.value = true;
  try {
    const res = await getProducts();
    const rawList = res.data;

    // Lấy thêm Rating cho mỗi sản phẩm
    products.value = await Promise.all(rawList.map(async (p) => {
      try {
        const ratingRes = await getAverageRating(p._id);
        return { 
          ...p, 
          avgRating: ratingRes.data.avgRating || 5, 
          reviewCount: ratingRes.data.total || 0 
        };
      } catch {
        return { ...p, avgRating: 5, reviewCount: 0 };
      }
    }));
  } catch (err) {
    console.error("Lỗi tải sản phẩm:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadProducts);

const goToDetail = (id) => router.push(`/product/${id}`);
const formatPrice = (p) => p ? Number(p).toLocaleString("vi-VN") + " đ" : "0 đ";
const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/400x400';
  return path.startsWith('http') ? path : `http://localhost:3000/${path.replace(/\\/g, '/')}`;
};

const quickAddToCart = async (product) => {
  const userData = localStorage.getItem("user");
  if (!userData) return alert("Vui lòng đăng nhập!");
  try {
    const user = JSON.parse(userData);
    await addCartAPI({ userId: user._id, productId: product._id, quantity: 1 });
    alert(`Đã thêm ${product.productName} vào giỏ hàng!`);
  } catch (err) { alert("Lỗi khi thêm!"); }
};
</script>

<style scoped>
.product-page-layout { background: #f8fafc; min-height: 100vh; }
.product-page { padding: 40px 0 80px; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

.page-header { text-align: center; margin-bottom: 50px; }
.title { color: #164668; font-size: 32px; font-weight: 800; }
.subtitle { color: #64748b; }

.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 30px; }
.product-card { background: white; border-radius: 24px; overflow: hidden; border: 1px solid #f1f5f9; transition: 0.4s; cursor: pointer; }
.product-card:hover { transform: translateY(-10px); box-shadow: 0 20px 30px rgba(0,0,0,0.08); }

.image-wrapper { height: 240px; position: relative; overflow: hidden; }
.image-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
.product-card:hover img { transform: scale(1.1); }

.card-overlay { position: absolute; inset: 0; background: rgba(22, 70, 104, 0.2); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
.product-card:hover .card-overlay { opacity: 1; }
.view-detail-btn { background: white; color: #164668; border: none; padding: 10px 20px; border-radius: 50px; font-weight: 700; cursor: pointer; }

.card-info { padding: 20px; }
.product-name { font-size: 17px; font-weight: 700; color: #1e293b; height: 48px; overflow: hidden; margin-bottom: 10px; }

.rating-row { display: flex; align-items: center; gap: 8px; margin-bottom: 15px; }
.stars { color: #ffb800; font-size: 11px; }
.review-count { color: #94a3b8; font-size: 12px; }

.price-row { display: flex; justify-content: space-between; align-items: center; }
.current-price { color: #164668; font-size: 20px; font-weight: 800; }
.quick-add-btn { width: 42px; height: 42px; border-radius: 14px; background: #f0f7ff; color: #164668; border: none; cursor: pointer; transition: 0.3s; }
.quick-add-btn:hover { background: #164668; color: white; transform: rotate(90deg); }

.loading-state { text-align: center; padding: 100px; }
.spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #164668; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>