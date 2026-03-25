<template>
  <div class="orders-container">
    <h2><i class="fas fa-box"></i> Đơn hàng hiện tại</h2>

    <div v-if="activeOrders.length === 0" class="empty-orders">
      <p>Bạn không có đơn hàng nào đang trong quá trình xử lý.</p>
      <button @click="router.push('/')">Tiếp tục mua sắm</button>
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
              @click="handleConfirmReceived(order._id)"
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import * as OrderService from "@/services/order"; 

const router = useRouter();
const orders = ref([]);
const selectedOrderId = ref(null);
const currentStatusHistory = ref([]);

const fetchData = async () => {
  try {
    const res = await OrderService.getMyOrders();
    orders.value = res.data;
  } catch (err) { console.error(err); }
};

const activeOrders = computed(() => {
  // Chỉ hiện đơn hàng chưa hoàn thành và chưa hủy
  return orders.value.filter(o => o.status !== 'delivered' && o.status !== 'completed' && o.status !== 'cancelled');
});

const getExpectedDate = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 3);
  return date.toLocaleDateString('vi-VN');
};

const fetchStatusHistory = async (id) => {
  if (selectedOrderId.value === id) {
    selectedOrderId.value = null;
    return;
  }
  try {
    const res = await OrderService.getOrderDetails(id); 
    currentStatusHistory.value = res.data.status_history || []; 
    selectedOrderId.value = id;
  } catch (err) { alert("Lỗi tải hành trình"); }
};

const handleConfirmReceived = async (id) => {
  if (confirm("Xác nhận bạn đã nhận hàng và hài lòng với sản phẩm?")) {
    try {
      await OrderService.confirmReceived(id);
      alert("Cập nhật thành công!");
      fetchData();
    } catch (err) { alert("Lỗi hệ thống"); }
  }
};

const formatPrice = (p) => p ? p.toLocaleString("vi-VN") + " đ" : "0 đ";
const formatStatus = (s) => {
  const map = { pending: 'Chờ duyệt', confirmed: 'Đã xác nhận', shipping: 'Đang giao', delivered: 'Thành công', cancelled: 'Đã hủy' };
  return map[s] || s;
};

onMounted(fetchData);
</script>

<style scoped>
.orders-container { max-width: 800px; margin: 40px auto; padding: 0 20px; }
.order-card { background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
.top { display: flex; justify-content: space-between; margin-bottom: 10px; }
.status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
.status-badge.pending { background: #fff7ed; color: #c2410c; }
.status-badge.shipping { background: #eff6ff; color: #1d4ed8; }
.status-badge.confirmed { background: #f0fdf4; color: #166534; }

.expected-date { font-size: 14px; color: #64748b; margin: 8px 0; }
.order-actions { display: flex; gap: 12px; margin-top: 15px; }

.btn-history { background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 8px; cursor: pointer; }
.btn-confirm { background: #164668; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; }

.status-history-section { margin-top: 20px; padding: 20px; background: #fafafa; border-radius: 12px; }
.timeline { border-left: 2px solid #e2e8f0; margin-left: 10px; padding-left: 20px; }
.timeline-item { position: relative; margin-bottom: 15px; }
.time-point { position: absolute; left: -27px; top: 4px; width: 12px; height: 12px; background: #164668; border-radius: 50%; border: 2px solid #fff; }
.h-status { font-weight: 700; display: block; font-size: 14px; }
.h-date { font-size: 12px; color: #94a3b8; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>