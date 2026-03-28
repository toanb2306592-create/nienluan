<template>
  <div class="orders-container">
    <h2><i class="fas fa-box"></i> Đơn hàng hiện tại</h2>

    <div v-if="activeOrders.length === 0" class="empty-orders">
      <div class="empty-icon">📦</div>
      <p>Bạn không có đơn hàng nào đang xử lý.</p>
      <button class="btn-shop" @click="router.push('/')">Tiếp tục mua sắm</button>
    </div>

    <div v-else class="order-list">
      <div v-for="order in activeOrders" :key="order._id" class="order-card">
        <div class="order-main-info">
          <div class="top">
            <span class="order-id">Mã đơn: #{{ order._id.slice(-8).toUpperCase() }}</span>
            <span :class="['status-badge', order.status]">{{ formatStatus(order.status) }}</span>
          </div>
          
          <p class="order-date">📅 Ngày đặt: {{ new Date(order.createdAt).toLocaleString('vi-VN') }}</p>
          
          <p class="expected-date" v-if="order.status !== 'cancelled'">
            🚚 Dự kiến giao: <b>{{ getExpectedDate(order.createdAt) }}</b>
          </p>

          <p class="order-total">Tổng tiền: <b>{{ formatPrice(order.totalAmount) }}</b></p>
          
          <div class="order-actions">
            <button class="btn-history" @click="fetchStatusHistory(order._id)">
              <i class="fas fa-route"></i> Xem hành trình
            </button>

            <button 
              v-if="order.status === 'shipping'" 
              class="btn-confirm" 
              @click="handleConfirmReceived(order)"
            >
              <i class="fas fa-check-circle"></i> Đã nhận được hàng
            </button>
          </div>
        </div>

        <transition name="fade">
          <div v-if="selectedOrderId === order._id" class="status-history-section">
            <h4>Hành trình đơn hàng:</h4>
            <div v-if="currentStatusHistory.length" class="timeline">
              <div v-for="step in currentStatusHistory" :key="step._id" class="timeline-item">
                <div class="time-point"></div>
                <div class="history-content">
                  <span class="h-status">{{ formatStatus(step.status) }}</span>
                  <span class="h-date">{{ new Date(step.createdAt).toLocaleString('vi-VN') }}</span>
                  <p class="h-note" v-if="step.note">📝 {{ step.note }}</p>
                </div>
              </div>
            </div>
            <p v-else class="no-data">Chưa có thông tin hành trình.</p>
          </div>
        </transition>
      </div>
    </div>

    <div v-if="showReviewModal" class="modal-overlay">
      <div class="review-modal">
        <div class="modal-header">
          <h3><i class="fas fa-star text-warning"></i> Đánh giá sản phẩm</h3>
          <button class="close-btn" @click="showReviewModal = false">&times;</button>
        </div>
        
        <p class="modal-subtitle">Cảm ơn bạn! Hãy chia sẻ cảm nhận về sản phẩm nhé.</p>

        <div class="review-scroll-area">
          <div v-for="item in reviewData.items" :key="item.productId" class="review-item-card">
            <div class="item-info">
              <img 
                :src="item.image ? `http://localhost:3000${item.image}` : 'https://via.placeholder.com/50'" 
                class="item-thumb" 
                @error="(e) => e.target.src = 'https://via.placeholder.com/50'" 
              />
              <span class="item-name">{{ item.productName }}</span>
            </div>

            <div class="star-rating">
              <i v-for="star in 5" :key="star" 
                 class="fa-star" 
                 :class="star <= item.rating ? 'fas active' : 'far'"
                 @click="item.rating = star"></i>
              <span class="rating-text">{{ getRatingLabel(item.rating) }}</span>
            </div>

            <textarea 
              v-model="item.comment" 
              placeholder="Sản phẩm có tốt không? (Không bắt buộc)..."
            ></textarea>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-later" @click="showReviewModal = false">Để sau</button>
          <button class="btn-submit" @click="submitAllReviews" :disabled="isSubmitting">
            {{ isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import * as OrderService from "@/services/order"; 
import * as ReviewService from "@/services/review"; 

const router = useRouter();
const orders = ref([]);
const selectedOrderId = ref(null);
const currentStatusHistory = ref([]);

const showReviewModal = ref(false);
const isSubmitting = ref(false);
const reviewData = ref({ orderId: '', items: [] });

const fetchData = async () => {
  try {
    const res = await OrderService.getMyOrders();
    orders.value = res.data;
  } catch (err) { console.error(err); }
};

const activeOrders = computed(() => {
  return orders.value.filter(o => !['delivered', 'completed', 'cancelled'].includes(o.status));
});

const handleConfirmReceived = async (order) => {
  if (confirm("Xác nhận bạn đã nhận hàng thành công?")) {
    try {
      await OrderService.confirmReceived(order._id);
      
      reviewData.value = {
        orderId: order._id,
        items: order.items.map(item => ({
          // Đảm bảo lấy ID từ ._id nếu productId là object đã populate
          productId: item.productId._id || item.productId,
          productName: item.productName || "Sản phẩm",
          image: item.image,
          rating: 5,
          comment: ""
        }))
      };

      await fetchData(); 
      showReviewModal.value = true;
    } catch (err) { alert("Lỗi hệ thống"); }
  }
};

const submitAllReviews = async () => {
  isSubmitting.value = true;
  const userData = JSON.parse(localStorage.getItem("user"));
  
  if (!userData || !userData._id) {
    alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
    return;
  }

  try {
    for (const item of reviewData.value.items) {
      await ReviewService.createReview({
        productId: item.productId,
        orderId: reviewData.value.orderId,
        userId: userData._id,
        userName: userData.name || userData.username,
        rating: item.rating,
        comment: item.comment
      });
    }
    
    alert("Cảm ơn bạn đã đánh giá!");
    showReviewModal.value = false;
  } catch (err) {
    alert("Lỗi: " + (err.response?.data?.message || "Không thể gửi đánh giá"));
  } finally {
    isSubmitting.value = false;
  }
};

const getRatingLabel = (r) => {
  const labels = { 1: 'Tệ', 2: 'Không tốt', 3: 'Bình thường', 4: 'Tốt', 5: 'Tuyệt vời' };
  return labels[r];
};

const formatPrice = (p) => p ? p.toLocaleString("vi-VN") + " đ" : "0 đ";
const formatStatus = (s) => {
  const map = { pending: 'Chờ duyệt', confirmed: 'Đã xác nhận', shipping: 'Đang giao', delivered: 'Thành công', cancelled: 'Đã hủy' };
  return map[s] || s;
};

const getExpectedDate = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 3);
  return date.toLocaleDateString('vi-VN');
};

const fetchStatusHistory = async (id) => {
  if (selectedOrderId.value === id) { selectedOrderId.value = null; return; }
  try {
    const res = await OrderService.getOrderDetails(id); 
    currentStatusHistory.value = res.data.status_history || []; 
    selectedOrderId.value = id;
  } catch (err) { alert("Lỗi tải hành trình"); }
};

onMounted(fetchData);
</script>

<style scoped>
.orders-container { max-width: 850px; margin: 40px auto; padding: 0 20px; }
.order-card { background: white; border-radius: 16px; padding: 25px; margin-bottom: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.status-badge { padding: 6px 14px; border-radius: 50px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
.status-badge.pending { background: #fff7ed; color: #c2410c; }
.status-badge.shipping { background: #eff6ff; color: #1d4ed8; }
.status-badge.confirmed { background: #f0fdf4; color: #166534; }
.order-actions { display: flex; gap: 12px; margin-top: 20px; }
.btn-history { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-weight: 600; }
.btn-confirm { background: #164668; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-weight: 600; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(4px); }
.review-modal { background: white; width: 95%; max-width: 550px; padding: 30px; border-radius: 24px; animation: slideUp 0.3s ease-out; }
@keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.review-scroll-area { max-height: 400px; overflow-y: auto; padding-right: 10px; margin: 15px 0; }
.review-item-card { padding: 20px; border: 1px solid #f1f5f9; border-radius: 16px; margin-bottom: 15px; background: #fdfdfd; }
.item-info { display: flex; align-items: center; gap: 15px; margin-bottom: 10px; }
.item-thumb { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; }
.star-rating { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.star-rating i { font-size: 24px; cursor: pointer; color: #e2e8f0; }
.star-rating i.active { color: #ffc107; }
textarea { width: 100%; height: 80px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 12px; resize: none; font-size: 14px; }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
.btn-later { background: #f1f5f9; border: none; padding: 10px 25px; border-radius: 12px; cursor: pointer; }
.btn-submit { background: #164668; color: white; border: none; padding: 10px 25px; border-radius: 12px; font-weight: 700; cursor: pointer; }
.empty-orders { text-align: center; padding: 50px; background: white; border-radius: 20px; }
.close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #94a3b8; }
.modal-header { display: flex; justify-content: space-between; align-items: center; }
</style>