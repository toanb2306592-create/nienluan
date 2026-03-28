<template>
  <div class="product-detail-layout">
    <Navbar />
    
    <div class="container" v-if="product">
      <nav class="breadcrumb">
        <router-link to="/">Trang chủ</router-link>
        <i class="fas fa-chevron-right chevron-divider"></i>
        <router-link to="/products">Sản phẩm</router-link>
        <i class="fas fa-chevron-right chevron-divider"></i>
        <span class="current">{{ product.productName }}</span>
      </nav>

      <div class="detail-card">
        <div class="grid">
          <div class="image-box" :class="{ 'sold-out-box': product.quantity <= 0 }">
            <img :src="getImageUrl(product.image)" :alt="product.productName" class="product-image" />
            <div v-if="product.isNew && product.quantity > 0" class="new-label">MỚI</div>
            <div v-if="product.quantity <= 0" class="sold-out-label">HẾT HÀNG</div>
          </div>

          <div class="content-box">
            <span class="category-name">{{ product.categoryId?.name || 'Sản phẩm' }}</span>
            <h1 class="title">{{ product.productName }}</h1>
            
            <div class="rating-row">
              <div class="stars">
                <i v-for="i in 5" :key="i" 
                   :class="i <= Math.round(avgData.avgRating) ? 'fas fa-star' : 'far fa-star'"></i>
              </div>
              <span class="count">({{ avgData.total || 0 }} đánh giá)</span>
            </div>

            <div class="price-row">
              <span class="price" :class="{ 'text-muted': product.quantity <= 0 }">
                {{ formatPrice(product.price) }}
              </span>
              <div class="stock-badge" :class="product.quantity > 0 ? 'in-stock' : 'out-of-stock'">
                <i class="fas" :class="product.quantity > 0 ? 'fa-check-circle' : 'fa-exclamation-triangle'"></i>
                {{ product.quantity > 0 ? `Còn lại ${product.quantity} sản phẩm` : 'Tạm hết hàng' }}
              </div>
            </div>

            <div class="divider"></div>
            <div class="description-container">
              <h3 class="section-title">Thông tin chi tiết</h3>
              <p class="description-text">{{ product.description || 'Sản phẩm hiện đang được cập nhật thông tin.' }}</p>
            </div>

            <div class="action-row">
              <div class="quantity-control" v-if="product.quantity > 0">
                <button @click="qty > 1 ? qty-- : null" class="qty-btn"><i class="fas fa-minus"></i></button>
                <input type="number" v-model.number="qty" readonly class="qty-input" />
                <button @click="qty < product.quantity ? qty++ : null" class="qty-btn"><i class="fas fa-plus"></i></button>
              </div>
              
              <button class="add-btn" :disabled="product.quantity <= 0" @click="handleAddToCart">
                <div class="btn-content">
                  <i class="fas fa-shopping-basket"></i>
                  <span>{{ product.quantity > 0 ? 'THÊM VÀO GIỎ HÀNG' : 'LIÊN HỆ ĐẶT HÀNG' }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="reviews-section">
        <div class="section-header">
          <h2><i class="fas fa-comments"></i> Đánh giá từ khách hàng</h2>
          <div class="rating-summary" v-if="avgData.total > 0">
            <div class="big-score">{{ avgData.avgRating.toFixed(1) }}</div>
            <div class="stars-info">
              <div class="stars">
                <i v-for="i in 5" :key="i" :class="i <= Math.round(avgData.avgRating) ? 'fas fa-star' : 'far fa-star'"></i>
              </div>
              <span>Dựa trên {{ avgData.total }} nhận xét</span>
            </div>
          </div>
        </div>

        <div class="reviews-list">
          <div v-if="reviews.length === 0" class="no-reviews">
            <i class="fas fa-comment-slash"></i>
            <p>Sản phẩm này chưa có đánh giá nào.</p>
          </div>
          
          <div v-for="(rev, index) in reviews" :key="rev._id" class="review-card">
            <div class="rev-header">
              <div class="user-avatar">K</div>
              
              <div class="user-meta">
                <span class="user-name">
                  Khách hàng ẩn danh {{ index + 1 }}
                </span>
                
                <div class="rev-stars">
                  <i v-for="i in 5" :key="i" :class="i <= rev.rating ? 'fas fa-star filled' : 'far fa-star'"></i>
                </div>
              </div>
              
              <span class="rev-date">{{ new Date(rev.createdAt).toLocaleDateString('vi-VN') }}</span>
            </div>
            
            <p class="rev-comment">{{ rev.comment || 'Khách hàng không để lại bình luận.' }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading-screen">
      <div class="spinner"></div>
      <p>Đang chuẩn bị dữ liệu...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getProductById, addToCart } from "@/services/product";
import { getReviewsByProduct, getAverageRating } from "@/services/review";
import Navbar from "@/components/Navbar.vue";

const route = useRoute();
const router = useRouter();
const product = ref(null);
const reviews = ref([]);
const avgData = ref({ avgRating: 0, total: 0 });
const qty = ref(1);

const loadData = async () => {
  try {
    const productId = route.params.id;
    const res = await getProductById(productId);
    product.value = res.data;

    const [revRes, avgRes] = await Promise.all([
      getReviewsByProduct(productId),
      getAverageRating(productId)
    ]);
    reviews.value = revRes.data;
    avgData.value = avgRes.data;
  } catch (err) {
    console.error(err);
    router.push("/products");
  }
};

onMounted(loadData);

const formatPrice = (p) => p ? Number(p).toLocaleString("vi-VN") + " đ" : "0 đ";
const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/600x600';
  return path.startsWith('http') ? path : `http://localhost:3000/${path.replace(/\\/g, '/')}`;
};

const handleAddToCart = async () => {
  const userData = localStorage.getItem("user");
  if (!userData) return alert("Vui lòng đăng nhập!");
  try {
    const user = JSON.parse(userData);
    await addToCart({ userId: user._id, productId: product.value._id, quantity: qty.value });
    alert("Đã thêm vào giỏ hàng!");
  } catch (err) { alert("Lỗi khi thêm!"); }
};
</script>

<style scoped>
/* CSS Reset & Font */
.product-detail-layout {
  background: #f8fafc;
  min-height: 100vh;
  padding-bottom: 60px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #1e293b;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Breadcrumb - Tinh tế hơn */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}
.breadcrumb a {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}
.breadcrumb a:hover {
  color: #164668;
}
.chevron-divider {
  font-size: 10px;
  color: #cbd5e1;
}
.breadcrumb .current {
  color: #164668;
  font-weight: 700;
}

/* Detail Card - Hiện đại hơn */
.detail-card {
  background: white;
  border-radius: 30px;
  padding: 50px;
  box-shadow: 0 15px 50px rgba(0,0,0,0.03);
  border: 1px solid #f1f5f9;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 70px;
}

/* Image Box - Bo góc & Đổ bóng */
.image-box {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  background: #fcfcfc;
  border: 1px solid #f1f5f9;
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);
}
.product-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.33, 1, 0.68, 1);
}
.image-box:hover .product-image {
  transform: scale(1.05);
}
.new-label {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #10b981;
  color: white;
  padding: 6px 16px;
  border-radius: 50px;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.5px;
}
.sold-out-label {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 28px;
  letter-spacing: 2px;
  z-index: 2;
}

/* Content Box - Căn chỉnh lại khoảng cách */
.content-box {
  display: flex;
  flex-direction: column;
}
.category-name {
  color: #164668;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 1.5px;
  margin-bottom: 10px;
}
.title {
  font-size: 42px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 20px;
  line-height: 1.15;
  letter-spacing: -1px;
}

/* Rating Row */
.rating-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
}
.stars {
  color: #ffb800;
  font-size: 16px;
  letter-spacing: 2px;
}
.count {
  color: #64748b;
  font-size: 15px;
  font-weight: 500;
}

/* Price Row */
.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  background: #f8fafc;
  padding: 15px 25px;
  border-radius: 16px;
}
.price {
  font-size: 38px;
  font-weight: 900;
  color: #164668;
}
.price.text-muted {
  color: #94a3b8 !important;
  text-decoration: line-through;
}
.stock-badge {
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.in-stock {
  background: #ecfdf5;
  color: #059669;
}
.out-of-stock {
  background: #fef2f2;
  color: #dc2626;
}

.divider {
  height: 2px;
  background: #f1f5f9;
  margin-bottom: 30px;
}
.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 15px;
}
.description-text {
  color: #475569;
  line-height: 1.8;
  font-size: 15px;
  margin: 0;
}

/* Action Buttons - Đẹp hơn */
.action-row {
  display: flex;
  gap: 20px;
  margin-top: auto;
  padding-top: 40px;
}
.quantity-control {
  display: flex;
  align-items: center;
  border: 2px solid #e2e8f0;
  border-radius: 18px;
  overflow: hidden;
  background: #f8fafc;
}
.qty-btn {
  width: 55px;
  height: 55px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #164668;
  font-size: 16px;
  transition: background 0.2s;
}
.qty-btn:hover {
  background: #e2e8f0;
}
.qty-input {
  width: 60px;
  border: none;
  text-align: center;
  font-weight: 800;
  background: transparent;
  font-size: 18px;
  color: #1e293b;
  outline: none;
}
/* Bỏ mũi tên tăng giảm mặc định */
.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.add-btn { 
  flex: 1; 
  background: #164668; 
  color: white; 
  border: none; 
  border-radius: 18px; 
  font-weight: 700; 
  font-size: 16px;
  cursor: pointer; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(22, 70, 104, 0.2);
}
.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.add-btn:hover:not(:disabled) {
  background: #0f314a;
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(22, 70, 104, 0.35);
}
.add-btn:active {
  transform: translateY(-1px);
}
.add-btn:disabled {
  background: #cbd5e1;
  color: #64748b;
  cursor: not-allowed;
  box-shadow: none;
}

/* --- REVIEWS SECTION - STYLE MỚI CHO ĐẸP HƠN --- */
.reviews-section {
  margin-top: 50px;
  background: white;
  border-radius: 30px;
  padding: 50px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 15px 50px rgba(0,0,0,0.03);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 30px;
  margin-bottom: 30px;
}
.section-header h2 {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0;
}
.section-header h2 i {
  color: #164668;
}

/* Rating Summary */
.rating-summary {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #f8fafc;
  padding: 15px 25px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}
.big-score {
  font-size: 56px;
  font-weight: 900;
  color: #164668;
  line-height: 1;
}
.stars-info .stars {
  font-size: 14px;
  margin-bottom: 4px;
}
.stars-info span {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* Review Card - Thẻ đánh giá */
.review-card {
  padding: 30px;
  border-radius: 20px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}
.review-card:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
  transform: translateX(5px);
}
.review-card:last-child {
  border-bottom: 1px solid transparent; /* Ghi đè để đẹp hơn trong list mới */
  margin-bottom: 0;
}

.rev-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 15px;
  position: relative;
}

/* Avatar đẹp hơn với Gradient */
.user-avatar { 
  width: 55px; 
  height: 55px; 
  background: linear-gradient(135deg, #164668, #2a6a96); 
  color: white; 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-weight: 800; 
  font-size: 22px;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(22, 70, 104, 0.2);
  border: 3px solid white;
}

/* Meta dữ liệu User */
.user-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.user-name {
  font-weight: 700;
  color: #1e293b;
  font-size: 16px;
  display: block;
}
.rev-stars {
  color: #ffb800;
  font-size: 11px;
  letter-spacing: 1px;
}
.rev-stars .filled {
  color: #ffb800;
}

/* Ngày tháng - Đẩy sang phải */
.rev-date {
  margin-left: auto;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 50px;
}

/* Nội dung bình luận - Căn chỉnh đẹp hơn */
.rev-comment {
  padding-left: 73px; /* Căn thẳng với phần Tên (55px avatar + 18px gap) */
  color: #475569;
  line-height: 1.7;
  font-size: 15px;
  margin: 0;
  white-space: pre-line; /* Giữ xuống dòng */
}

/* Trạng thái trống */
.no-reviews {
  text-align: center;
  color: #94a3b8;
  padding: 60px 0;
  background: #f8fafc;
  border-radius: 20px;
  border: 2px dashed #e2e8f0;
}
.no-reviews i {
  font-size: 40px;
  margin-bottom: 15px;
  color: #cbd5e1;
}
.no-reviews p {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
}

/* Loading */
.loading-screen {
  text-align: center;
  padding: 120px 0;
  color: #64748b;
}
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #e2e8f0;
  border-top: 5px solid #164668;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 992px) { 
  .grid {
    grid-template-columns: 1fr;
    gap: 40px;
  } 
  .detail-card {
    padding: 30px;
  }
  .image-box img {
    height: 400px;
  }
  .title {
    font-size: 32px;
  }
  .action-row {
    flex-direction: column-reverse;
  }
  .quantity-control {
    width: 100%;
    justify-content: space-between;
  }
  .add-btn {
    width: 100%;
    height: 55px;
  }
  
  /* Reviews responsive */
  .reviews-section {
    padding: 30px;
  }
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .rev-header {
    position: relative;
    padding-top: 25px; /* Chừa chỗ cho ngày */
  }
  .rev-date {
    position: absolute;
    top: 0;
    left: 73px; /* Căn thẳng với tên */
    margin-left: 0;
  }
  .rev-comment {
    padding-left: 0;
    margin-top: 15px;
  }
}
</style>