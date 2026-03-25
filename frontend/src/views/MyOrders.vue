<template>
  <div class="orders-container">
    <h2>Đơn hàng của tôi</h2>
    <div v-if="orders.length === 0">Bạn chưa có đơn hàng nào.</div>
    
    <div v-for="order in orders" :key="order._id" class="order-card">
      <div class="order-header">
        <span>Mã đơn: {{ order._id }}</span>
        <span :class="'status-' + order.status">{{ translateStatus(order.status) }}</span>
      </div>
      
      <div class="order-items">
        <div v-for="item in order.items" :key="item.productId" class="item">
          <img :src="'http://localhost:3000/' + item.image" width="50">
          <span>{{ item.productName }} x {{ item.quantity }}</span>
        </div>
      </div>

      <div class="order-footer">
        <strong>Tổng tiền: {{ order.totalAmount.toLocaleString() }} đ</strong>
        
        <button v-if="order.status === 'shipping'" 
                @click="handleReceived(order._id)" 
                class="btn-received">
          Đã nhận được hàng
        </button>
        
        <button v-if="order.status === 'pending'" 
                @click="handleCancel(order._id)" 
                class="btn-cancel">
          Hủy đơn
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMyOrders, confirmReceived, cancelOrder } from '@/services/order';

const orders = ref([]);

const fetchOrders = async () => {
  const res = await getMyOrders();
  orders.value = res.data;
};

const handleReceived = async (id) => {
  if(confirm("Xác nhận bạn đã nhận được hàng?")) {
    await confirmReceived(id);
    fetchOrders(); // Load lại danh sách
  }
};

const handleCancel = async (id) => {
  if(confirm("Bạn muốn hủy đơn hàng này?")) {
    await cancelOrder(id);
    fetchOrders();
  }
};

const translateStatus = (status) => {
  const map = {
    pending: "Chờ duyệt",
    confirmed: "Đã duyệt",
    shipping: "Đang giao",
    completed: "Hoàn tất",
    cancelled: "Đã hủy"
  };
  return map[status] || status;
};

onMounted(fetchOrders);
</script>

<style scoped>
.order-card { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; border-radius: 8px; }
.order-header { display: flex; justify-content: space-between; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.status-pending { color: orange; }
.status-shipping { color: blue; }
.status-completed { color: green; }
.btn-received { background: #27ae60; color: white; border: none; padding: 8px 15px; cursor: pointer; border-radius: 4px; }
.btn-cancel { background: #e74c3c; color: white; border: none; padding: 8px 15px; margin-left: 10px; cursor: pointer; }
</style>