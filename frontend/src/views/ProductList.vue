<template>
  <div class="product-page">
    <h2>TẤT CẢ SẢN PHẨM</h2>

    <div v-if="products && products.length > 0" class="grid">
      <div class="card" v-for="p in products" :key="p._id" @click="openQuickView(p)">
        <div class="image-container">
          <img :src="getImageUrl(p.image)" :alt="p.productName" />
          <div class="category-tag">{{ p.categoryId?.name || 'Sản phẩm' }}</div>
        </div>
        
        <div class="card-content">
          <h3>{{ p.productName }}</h3>
          <div class="star-rating">
            <span v-for="i in 5" :key="i" :class="i <= (p.rating * 5) ? 'star-on' : 'star-off'">★</span>
            <span class="count">({{ p.reviewCount || 0 }})</span>
          </div>
          <p class="price">{{ formatPrice(p.price) }}</p>
        </div>
        <button class="hover-btn">CHI TIẾT</button>
      </div>
    </div>
    
    <div v-else style="text-align: center; padding: 50px;">
        <p>Đang tải sản phẩm hoặc dữ liệu trống...</p>
    </div>

    <div v-if="selectedProduct" class="modal-overlay" @click.self="selectedProduct = null">
      <div class="modal-card">
        <button class="close-btn" @click="selectedProduct = null">×</button>
        <div class="modal-grid">
          <div class="modal-img">
            <img :src="getImageUrl(selectedProduct.image)" />
          </div>
          <div class="modal-info">
            <span class="cate">{{ selectedProduct.categoryId?.name }}</span>
            <h2>{{ selectedProduct.productName }}</h2>
            <p class="m-price">{{ formatPrice(selectedProduct.price) }}</p>
            <div class="line"></div>
            <p class="desc">{{ selectedProduct.description || 'Mô tả đang cập nhật...' }}</p>
            
            <div class="action-row">
              <div class="qty-box">
                <button @click="tempQty > 1 ? tempQty-- : null">-</button>
                <input type="number" v-model.number="tempQty" min="1" />
                <button @click="tempQty++">+</button>
              </div>
              <button class="add-to-cart-btn" @click="handleAddToCart">THÊM VÀO GIỎ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getProducts, addToCart as addCartAPI } from "@/services/product";

const products = ref([]);
const selectedProduct = ref(null);
const tempQty = ref(1);

const loadProducts = async () => {
  try {
    const res = await getProducts();
    products.value = res.data;
  } catch (err) { 
    console.error("Lỗi khi gọi API products:", err); 
  }
};

onMounted(loadProducts);

const formatPrice = (p) => {
  return p ? Number(p).toLocaleString("vi-VN") + " đ" : "0 đ";
};

const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/300x300';
  return path.startsWith('http') ? path : `http://localhost:3000/${path.replace(/\\/g, '/')}`;
};

const openQuickView = (p) => {
  selectedProduct.value = p;
  tempQty.value = 1;
};

const handleAddToCart = async () => {
  const userData = localStorage.getItem("user");
  if (!userData) return alert("Vui lòng đăng nhập!");

  try {
    const user = JSON.parse(userData);
    
    // Tạo payload đúng cấu trúc Backend cần (userId, productId, quantity)
    const payload = {
      userId: user._id, 
      productId: selectedProduct.value._id,
      quantity: parseInt(tempQty.value) || 1
    };

    console.log("Payload gửi đi:", payload);

    // Gọi API - Lúc này payload sẽ được truyền vào hàm addToCart ở trên
    await addCartAPI(payload);
    
    alert("Đã thêm vào giỏ hàng thành công! 🛒");
    selectedProduct.value = null;
  } catch (err) { 
    console.error("Lỗi chi tiết:", err.response?.data);
    alert("Lỗi: " + (err.response?.data?.message || "Không thể thêm vào giỏ")); 
  }
};
</script>

<style scoped>
.product-page { padding: 40px; background: #0f0f0f; min-height: 100vh; color: white; }
h2 { text-align: center; color: #00d1b2; margin-bottom: 30px; letter-spacing: 2px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 25px; }
.card { background: #1a1a1a; border-radius: 12px; border: 1px solid #333; overflow: hidden; cursor: pointer; transition: 0.3s; display: flex; flex-direction: column; }
.card:hover { transform: translateY(-5px); border-color: #00d1b2; box-shadow: 0 10px 20px rgba(0, 209, 178, 0.1); }
.image-container { height: 200px; position: relative; overflow: hidden; }
.image-container img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
.card:hover .image-container img { transform: scale(1.1); }
.category-tag { position: absolute; top: 10px; left: 10px; background: #00d1b2; color: #000; padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
.card-content { padding: 15px; flex-grow: 1; }
.card-content h3 { font-size: 16px; margin-bottom: 10px; color: #eee; }
.star-rating { margin-bottom: 10px; font-size: 12px; }
.star-on { color: #ffdd57; }
.star-off { color: #444; }
.price { color: #00d1b2; font-weight: 800; font-size: 18px; }
.hover-btn { width: 100%; padding: 12px; background: #252525; border: none; color: #00d1b2; font-weight: bold; cursor: pointer; transition: 0.3s; border-top: 1px solid #333; }
.card:hover .hover-btn { background: #00d1b2; color: #000; }

/* MODAL STYLE */
.modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(5px); }
.modal-card { background: #161616; width: 850px; max-width: 95%; border-radius: 20px; border: 1px solid #333; position: relative; overflow: hidden; animation: zoomIn 0.3s ease; }
@keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
.close-btn { position: absolute; top: 15px; right: 20px; background: none; border: none; color: #666; font-size: 30px; cursor: pointer; z-index: 10; transition: 0.3s; }
.close-btn:hover { color: #00d1b2; }
.modal-grid { display: flex; flex-wrap: wrap; }
.modal-img { width: 45%; background: #000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-img img { max-width: 100%; max-height: 400px; border-radius: 10px; }
.modal-info { width: 55%; padding: 40px; text-align: left; }
.cate { color: #00d1b2; font-size: 12px; font-weight: bold; text-transform: uppercase; }
.modal-info h2 { text-align: left; margin: 10px 0; color: #fff; font-size: 28px; }
.m-price { font-size: 24px; color: #00d1b2; font-weight: bold; margin-bottom: 20px; }
.line { height: 1px; background: #333; margin: 20px 0; }
.desc { color: #aaa; line-height: 1.6; margin-bottom: 30px; font-size: 14px; }
.action-row { display: flex; gap: 20px; align-items: center; }
.qty-box { display: flex; border: 1px solid #444; border-radius: 8px; overflow: hidden; background: #222; }
.qty-box button { width: 40px; height: 40px; background: none; border: none; color: white; cursor: pointer; font-size: 18px; transition: 0.2s; }
.qty-box button:hover { background: #333; color: #00d1b2; }
.qty-box input { width: 50px; background: none; border: none; color: white; text-align: center; font-size: 16px; border-left: 1px solid #444; border-right: 1px solid #444; }
.add-to-cart-btn { flex: 1; height: 40px; background: #00d1b2; border: none; border-radius: 8px; color: #000; font-weight: 800; cursor: pointer; transition: 0.3s; }
.add-to-cart-btn:hover { background: #00b89c; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 209, 178, 0.3); }

@media (max-width: 768px) {
  .modal-grid { flex-direction: column; }
  .modal-img, .modal-info { width: 100%; }
  .modal-info { padding: 25px; }
}
</style>