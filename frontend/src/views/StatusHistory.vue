<template>
  <div class="history-container">
    <div class="header-section">
      <h2><i class="fas fa-check-double"></i> Lịch sử mua hàng</h2>
      
      <div class="filter-box">
        <div class="filter-group">
          <label>Từ ngày:</label>
          <input type="date" v-model="filter.startDate" class="date-input" />
        </div>
        <div class="filter-group">
          <label>Đến ngày:</label>
          <input type="date" v-model="filter.endDate" class="date-input" />
        </div>
        <button @click="resetFilter" class="btn-reset">Xóa lọc</button>
      </div>
    </div>

    <div v-if="filteredOrders.length === 0" class="empty-state">
      <div class="empty-icon">📂</div>
      <p>Không tìm thấy đơn hàng nào đã hoàn tất trong khoảng thời gian này.</p>
      <button @click="router.push('/')" class="btn-shop">Mua sắm ngay</button>
    </div>

    <div v-else class="history-list">
      <div v-for="order in filteredOrders" :key="order._id" class="history-card">
        
        <div class="card-header" @click="toggleExpand(order._id)">
          <div class="main-meta">
            <span class="order-id">#{{ order._id.slice(-8).toUpperCase() }}</span>
            <span class="order-product-name">
              {{ order.items[0]?.productId?.productName || 'Đơn hàng mới' }} 
              <small v-if="order.items.length > 1">và {{ order.items.length - 1 }} món khác</small>
            </span>
            <span class="order-date">{{ new Date(order.createdAt).toLocaleDateString('vi-VN') }}</span>
          </div>
          <div class="right-meta">
            <span class="order-total">{{ formatPrice(order.totalAmount) }}</span>
            <i :class="['fas', expandedId === order._id ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </div>
        </div>

        <transition name="slide">
          <div v-if="expandedId === order._id" class="card-details">
            <div class="divider"></div>
            
            <div class="items-list">
              <div v-for="item in order.items" :key="item._id" class="product-item">
                <img :src="getImageUrl(item.productId?.image)" :alt="item.productId?.productName" />
                
                <div class="p-info">
                  <span class="p-name">{{ item.productId?.productName }}</span>
                  <span class="p-qty">Số lượng: {{ item.quantity }}</span>
                </div>
                <span class="p-price">{{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>

            <div class="payment-summary">
              <div class="summary-line">
                <span>Trạng thái:</span>
                <b class="text-success">Giao hàng thành công</b>
              </div>
              <div class="summary-line">
                <span>Phương thức:</span>
                <span>Thanh toán khi nhận hàng (COD)</span>
              </div>
              <div class="summary-line grand-total">
                <span>Tổng cộng:</span>
                <b>{{ formatPrice(order.totalAmount) }}</b>
              </div>
            </div>

            <button class="btn-reorder" @click="reOrder(order)">
              <i class="fas fa-cart-plus"></i> Mua lại đơn này
            </button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import * as OrderService from "@/services/order";

const router = useRouter();
const orders = ref([]);
const expandedId = ref(null);
const filter = ref({
  startDate: "",
  endDate: ""
});

// Lấy dữ liệu từ Service
const fetchData = async () => {
  try {
    const res = await OrderService.getMyOrders();
    // Lọc lấy các đơn đã thành công (delivered hoặc completed)
    orders.value = res.data.filter(o => o.status === 'delivered' || o.status === 'completed');
  } catch (err) {
    console.error("Lỗi tải lịch sử đơn hàng:", err);
  }
};

// --- HÀM XỬ LÝ ẢNH CHUẨN LOCALHOST ---
const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/400x400';
  return path.startsWith('http') ? path : `http://localhost:3000/${path.replace(/\\/g, '/')}`;
};

// --- LOGIC LỌC NGÀY THÁNG ---
const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const orderDate = new Date(order.createdAt).setHours(0,0,0,0);
    const start = filter.value.startDate ? new Date(filter.value.startDate).setHours(0,0,0,0) : null;
    const end = filter.value.endDate ? new Date(filter.value.endDate).setHours(23,59,59,999) : null;

    if (start && orderDate < start) return false;
    if (end && orderDate > end) return false;
    return true;
  });
});

const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const resetFilter = () => {
  filter.value.startDate = "";
  filter.value.endDate = "";
};

const formatPrice = (p) => p ? Number(p).toLocaleString("vi-VN") + " đ" : "0 đ";

const reOrder = (order) => {
  alert("Tính năng Mua lại: Đã thêm " + order.items.length + " món vào giỏ hàng!");
};

onMounted(fetchData);
</script>

<style scoped>
.history-container { max-width: 800px; margin: 40px auto; padding: 0 20px; font-family: 'Inter', sans-serif; }
.header-section { margin-bottom: 30px; }

/* Filter UI */
.filter-box { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; margin-top: 15px; }
.filter-group { display: flex; flex-direction: column; gap: 4px; }
.filter-group label { font-size: 12px; font-weight: 600; color: #64748b; }
.date-input { border: 1px solid #e2e8f0; padding: 8px; border-radius: 8px; outline: none; transition: 0.3s; }
.date-input:focus { border-color: #164668; box-shadow: 0 0 0 2px rgba(22, 70, 104, 0.1); }
.btn-reset { padding: 8px 15px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-size: 13px; transition: 0.3s; }
.btn-reset:hover { background: #f1f5f9; }

/* Order Cards */
.history-card { background: white; border: 1px solid #f1f5f9; border-radius: 16px; margin-bottom: 15px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.02); transition: 0.3s; }
.history-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

.card-header { padding: 18px 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.2s; }
.card-header:hover { background: #f8fafc; }

.main-meta { display: flex; flex-direction: column; gap: 4px; }
.order-id { font-weight: 800; color: #164668; font-size: 13px; opacity: 0.8; }
.order-product-name { font-weight: 700; color: #1e293b; font-size: 15px; }
.order-product-name small { font-weight: 400; color: #64748b; margin-left: 4px; }
.order-date { font-size: 12px; color: #94a3b8; }

.right-meta { display: flex; align-items: center; gap: 15px; }
.order-total { font-weight: 800; color: #1e293b; font-size: 16px; }

/* Details Section */
.card-details { padding: 0 20px 20px 20px; background: #fff; }
.divider { height: 1px; background: #f1f5f9; margin-bottom: 15px; }

.product-item { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
.product-item img { width: 60px; height: 60px; object-fit: cover; border-radius: 12px; background: #f8fafc; border: 1px solid #f1f5f9; }
.p-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.p-name { font-size: 14px; font-weight: 700; color: #1e293b; }
.p-qty { font-size: 12px; color: #64748b; }
.p-price { font-weight: 700; font-size: 14px; color: #164668; }

.payment-summary { background: #f8fafc; padding: 15px; border-radius: 12px; margin-top: 15px; border: 1px solid #f1f5f9; }
.summary-line { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; color: #475569; }
.grand-total { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #cbd5e1; font-size: 16px; color: #e53935; }
.grand-total b { font-size: 18px; }

.btn-reorder { width: 100%; margin-top: 15px; padding: 12px; background: #164668; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 700; transition: 0.3s; }
.btn-reorder:hover { background: #0f3049; transform: translateY(-2px); }

.text-success { color: #10b981; }

/* Empty State */
.empty-state { text-align: center; padding: 60px; color: #94a3b8; background: white; border-radius: 20px; border: 2px dashed #f1f5f9; }
.empty-icon { font-size: 50px; margin-bottom: 15px; }
.btn-shop { background: #164668; color: white; border: none; padding: 10px 25px; border-radius: 50px; margin-top: 15px; cursor: pointer; font-weight: 600; }

/* Slide Animation */
.slide-enter-active, .slide-leave-active { transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); max-height: 1000px; }
.slide-enter-from, .slide-leave-to { max-height: 0; opacity: 0; overflow: hidden; }
</style>