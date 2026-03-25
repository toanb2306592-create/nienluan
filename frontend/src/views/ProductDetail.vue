<template>
  <div class="product-detail-layout">
    <Navbar />
    
    <div class="container" v-if="product">
      <nav class="breadcrumb">
        <router-link to="/">Trang chủ</router-link>
        <i class="fas fa-chevron-right"></i>
        <router-link to="/products">Sản phẩm</router-link>
        <i class="fas fa-chevron-right"></i>
        <span class="current">{{ product.productName }}</span>
      </nav>

      <div class="detail-card">
        <div class="grid">
          <div class="image-box" :class="{ 'sold-out-box': product.quantity <= 0 }">
            <img :src="getImageUrl(product.image)" :alt="product.productName" />
            <div v-if="product.isNew && product.quantity > 0" class="new-label">MỚI</div>
            <div v-if="product.quantity <= 0" class="sold-out-label">HẾT HÀNG</div>
          </div>

          <div class="content-box">
            <span class="category-name">{{ product.categoryId?.name || 'Sản phẩm' }}</span>
            <h1 class="title">{{ product.productName }}</h1>
            
            <div class="rating-row">
              <div class="stars">
                <i v-for="i in 5" :key="i" 
                   :class="i <= (product.rating || 5) ? 'fas fa-star' : 'far fa-star'"></i>
              </div>
              <span class="count">({{ product.reviewCount || 0 }} đánh giá)</span>
            </div>

            <div class="price-row">
              <span class="price" :class="{ 'text-muted': product.quantity <= 0 }">
                {{ formatPrice(product.price) }}
              </span>
              <span v-if="product.oldPrice" class="old-price">{{ formatPrice(product.oldPrice) }}</span>
              
              <div class="stock-badge" :class="product.quantity > 0 ? 'in-stock' : 'out-of-stock'">
                <i class="fas" :class="product.quantity > 0 ? 'fa-check-circle' : 'fa-exclamation-triangle'"></i>
                {{ product.quantity > 0 ? `Còn lại ${product.quantity} sản phẩm` : 'Tạm hết hàng' }}
              </div>
            </div>

            <div class="divider"></div>

            <div class="description-container">
              <h3 class="section-title">Thông tin chi tiết</h3>
              <p class="description-text">
                {{ product.description || 'Sản phẩm hiện đang được cập nhật thông tin mô tả chi tiết.' }}
              </p>
            </div>

            <div class="action-row">
              <div class="quantity-control" v-if="product.quantity > 0">
                <button @click="qty > 1 ? qty-- : null"><i class="fas fa-minus"></i></button>
                <input type="number" v-model.number="qty" min="1" :max="product.quantity" />
                <button @click="qty < product.quantity ? qty++ : null"><i class="fas fa-plus"></i></button>
              </div>
              
              <button 
                class="add-btn" 
                :class="{ 'btn-sold-out': product.quantity <= 0 }"
                @click="handleAddToCart" 
                :disabled="product.quantity <= 0"
              >
                <i class="fas" :class="product.quantity > 0 ? 'fa-shopping-basket' : 'fa-clock'"></i> 
                {{ product.quantity > 0 ? 'THÊM VÀO GIỎ' : 'LIÊN HỆ KHI CÓ HÀNG' }}
              </button>
            </div>

            <div class="guarantee">
              <div class="item"><i class="fas fa-truck"></i><span>Giao hàng nhanh 2h</span></div>
              <div class="item"><i class="fas fa-check-double"></i><span>Kiểm định an toàn</span></div>
              <div class="item"><i class="fas fa-undo"></i><span>Đổi trả miễn phí</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading-screen">
      <div class="loader"></div>
      <p>Đang chuẩn bị dữ liệu sản phẩm...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getProductById, addToCart } from "@/services/product";
import Navbar from "@/components/Navbar.vue";

const route = useRoute();
const router = useRouter();
const product = ref(null);
const qty = ref(1);

watch(qty, (newVal) => {
  if (product.value && newVal > product.value.quantity) qty.value = product.value.quantity;
  if (newVal < 1) qty.value = 1;
});

const loadData = async () => {
  try {
    const res = await getProductById(route.params.id);
    product.value = res.data;
  } catch (err) {
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
  } catch (err) {
    alert("Lỗi khi thêm vào giỏ hàng.");
  }
};
</script>

<style scoped>
.product-detail-layout { background: #f8fafc; min-height: 100vh; padding-bottom: 50px; }
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }

/* Breadcrumb */
.breadcrumb { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; font-size: 14px; color: #64748b; }
.breadcrumb .current { color: #164668; font-weight: 700; }

/* Card & Grid */
.detail-card { background: white; border-radius: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.03); padding: 40px; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }

/* Image Style */
.image-box { position: relative; background: #f1f5f9; border-radius: 20px; overflow: hidden; }
.image-box img { width: 100%; height: 500px; object-fit: cover; transition: 0.5s; }
.sold-out-box img { filter: grayscale(0.8); opacity: 0.6; }

.new-label { position: absolute; top: 20px; right: 20px; background: #164668; color: white; padding: 5px 15px; border-radius: 50px; font-size: 12px; font-weight: 800; }
.sold-out-label { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg); background: rgba(239, 68, 68, 0.9); color: white; padding: 10px 30px; border: 3px solid white; font-size: 24px; font-weight: 900; z-index: 2; border-radius: 10px; }

/* Info Style */
.category-name { color: #3b82f6; font-weight: 800; font-size: 13px; text-transform: uppercase; }
.title { font-size: 40px; color: #1e293b; margin: 10px 0; font-weight: 800; }
.text-muted { color: #94a3b8 !important; }

/* Stock Badge */
.stock-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px; border-radius: 50px; font-size: 14px; font-weight: 700; margin-top: 10px; }
.in-stock { background: #ecfdf5; color: #10b981; }
.out-of-stock { background: #fef2f2; color: #ef4444; }

.price-row { margin-bottom: 30px; display: flex; flex-direction: column; }
.price { font-size: 36px; font-weight: 800; color: #164668; }

.divider { height: 1px; background: #f1f5f9; margin: 30px 0; }
.description-text { color: #64748b; line-height: 1.8; white-space: pre-line; }

/* Action Row */
.action-row { display: flex; gap: 20px; margin-bottom: 40px; }
.quantity-control { display: flex; background: #f1f5f9; padding: 5px; border-radius: 12px; }
.quantity-control button { width: 45px; height: 45px; border: none; background: white; border-radius: 10px; cursor: pointer; color: #164668; }
.quantity-control input { width: 60px; border: none; text-align: center; font-weight: 800; color: #1e293b; background: transparent; }

/* Buttons */
.add-btn { flex: 1; background: #164668; color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; }
.add-btn:hover:not(:disabled) { background: #0f3047; transform: translateY(-3px); }
.btn-sold-out { background: #cbd5e1 !important; color: #64748b !important; cursor: not-allowed !important; }

.guarantee { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; border-top: 1px solid #f1f5f9; padding-top: 30px; }
.item { text-align: center; font-size: 12px; font-weight: 600; color: #475569; }
.item i { display: block; font-size: 20px; color: #10b981; margin-bottom: 8px; }

@media (max-width: 992px) { .grid { grid-template-columns: 1fr; } }
</style>