<template>
  <div class="admin">
    <div class="sidebar">
      <h2>ADMIN PANEL</h2>
      <ul>
        <li @click="active = 'dashboard'" :class="{ active: active === 'dashboard' }">Dashboard</li>
        <li @click="active = 'products'" :class="{ active: active === 'products' }">Sản phẩm</li>
        <li @click="active = 'categories'" :class="{ active: active === 'categories' }">Danh mục</li>
        <li @click="active = 'orders'" :class="{ active: active === 'orders' }">Đơn hàng</li>
        <li @click="active = 'users'" :class="{ active: active === 'users' }">Người dùng</li>
      </ul>
    </div>

    <div class="main">
      <div class="topbar">
        <span>Trang quản trị hệ thống</span>
        <div class="user-nav">
          <span>Xin chào, <b>{{ user?.name }}</b></span>
          <button class="btn logout-btn" @click="logout">⏻ Thoát</button>
        </div>
      </div>

      <div class="content">
        <div v-if="active === 'dashboard'">
          <h2>Tổng quan</h2>
          <div class="cards">
            <div class="card">🛒 Sản phẩm: {{ products.length }}</div>
            <div class="card">📦 Đơn hàng: {{ orders.length }}</div>
            <div class="card">👥 Người dùng: {{ users.length }}</div>
            <div class="card">📁 Danh mục: {{ categories.length }}</div>
          </div>
        </div>

        <div v-if="active === 'orders'" class="box">
          <h2>Quản lý đơn hàng</h2>
          <div class="filter-section">
            <div class="search-bar">
              <input v-model="orderSearchQuery" placeholder="🔍 Tìm mã đơn hoặc tên khách..." />
            </div>
            <div class="filter-roles">
              <span>Trạng thái: </span>
              <select v-model="orderStatusFilter" class="status-select">
                <option value="all">Tất cả</option>
                <option value="pending">Chờ duyệt</option>
                <option value="confirmed">Đã duyệt</option>
                <option value="shipping">Đang giao</option>
                <option value="completed">Hoàn tất</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>

          <div class="list">
            <div class="item" v-for="o in filteredOrders" :key="o._id">
              <div class="item-content-wrapper">
                <div class="item-info">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="item-title">Đơn #{{ o._id.slice(-6).toUpperCase() }}</span>
                    <span :class="['role-badge', 'status-' + o.status]">{{ translateStatus(o.status) }}</span>
                  </div>
                  <span class="item-desc">Khách: {{ o.shippingAddress?.fullName }} - {{ formatPrice(o.totalAmount) }}</span>
                </div>
              </div>
              <div class="action-btns">
                <button class="btn btn-info" @click="viewOrder(o)">Chi tiết</button>
                <button v-if="o.status === 'pending'" class="btn btn-primary" @click="handleUpdateOrderStatus(o._id, 'confirmed')">Duyệt</button>
                <button v-if="o.status === 'confirmed'" class="btn btn-warning" @click="handleUpdateOrderStatus(o._id, 'shipping')">Giao hàng</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="active === 'users'" class="box">
          <h2>Quản lý người dùng</h2>
          <div class="filter-section">
            <div class="search-bar">
              <input v-model="searchQuery" placeholder="🔍 Tìm kiếm tên người dùng..." />
            </div>
            <div class="filter-roles">
              <span>Phân loại: </span>
              <label><input type="radio" value="all" v-model="roleFilter" /> Tất cả</label>
              <label><input type="radio" value="admin" v-model="roleFilter" /> Admin</label>
              <label><input type="radio" value="user" v-model="roleFilter" /> User</label>
            </div>
          </div>
          <div class="list">
            <div class="item" v-for="u in filteredUsers" :key="u._id">
              <div class="item-content-wrapper">
                <div class="item-info">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="item-title">{{ u.name }}</span>
                    <span :class="['role-badge', u.role]">{{ u.role }}</span>
                  </div>
                  <span class="item-desc">{{ u.email }}</span>
                </div>
              </div>
              <div class="action-btns">
                <button class="btn btn-info" @click="viewUser(u)">Xem</button>
                <button class="btn btn-danger" @click="removeUser(u._id)">Xóa</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="active === 'products'" class="box">
          <h2>Quản lý sản phẩm</h2>
          <div class="grid-form">
            <div class="form-group">
              <label>Tên sản phẩm</label>
              <input v-model="newProduct.productName" placeholder="Nhập tên SP..." />
            </div>
            <div class="form-group">
              <label>Danh mục</label>
              <select v-model="newProduct.categoryId">
                <option disabled value="">Chọn danh mục</option>
                <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Giá (VNĐ)</label>
              <input v-model="newProduct.price" type="number" />
            </div>
            <div class="form-group">
              <label>Số lượng</label>
              <input v-model="newProduct.quantity" type="number" />
            </div>
            <div class="form-group full-width">
              <label>Ảnh sản phẩm</label>
              <input type="file" @change="handleFileUpload" ref="fileInput" />
            </div>
            <div class="full-width" style="text-align: right;">
              <button class="btn btn-primary" @click="addProduct">+ Thêm sản phẩm</button>
            </div>
          </div>
          <div class="list">
            <div class="item" v-for="p in products" :key="p._id">
              <div class="item-content-wrapper">
                <img :src="getImageUrl(p.image)" alt="Ảnh SP" class="item-image" />
                <div class="item-info">
                  <span class="item-title">{{ p.productName }}</span>
                  <span class="item-desc">Giá: {{ formatPrice(p.price) }} - Kho: {{ p.quantity }}</span>
                  <span class="item-desc" style="color: #00d1b2;">DM: {{ p.categoryId?.name || 'Chưa phân loại' }}</span>
                </div>
              </div>
              <div class="action-btns">
                <button class="btn btn-warning" @click="openEditProduct(p)">Sửa</button>
                <button class="btn btn-danger" @click="removeProduct(p._id)">Xóa</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="active === 'categories'" class="box">
          <h2>Quản lý danh mục</h2>
          <div class="grid-form single-col">
            <div style="display: flex; gap: 15px; align-items: flex-end;">
              <div class="form-group" style="flex: 1;">
                <label>Tên danh mục</label>
                <input v-model="newCategory.name" placeholder="Nhập tên danh mục..." />
              </div>
              <div class="form-group" style="flex: 2;">
                <label>Mô tả danh mục</label>
                <input v-model="newCategory.description" placeholder="Nhập mô tả..." />
              </div>
              <button class="btn btn-primary" style="height: 42px;" @click="handleAddCategory">+ Thêm mới</button>
            </div>
          </div>
          <div class="list">
            <div class="item" v-for="c in categories" :key="c._id">
              <div class="item-info">
                <span class="item-title">{{ c.name }}</span>
                <span class="item-desc">{{ c.description || 'Không có mô tả' }}</span>
              </div>
              <div class="action-btns">
                <button class="btn btn-warning" @click="openEditCategory(c)">Sửa</button>
                <button class="btn btn-danger" @click="handleRemoveCategory(c._id)">Xóa</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedOrder" class="modal-overlay" @click.self="selectedOrder = null">
      <div class="modal-content" style="max-width: 600px;">
        <h3>Chi tiết đơn hàng #{{ selectedOrder._id.slice(-6).toUpperCase() }}</h3>
        <div class="order-detail-info">
          <p><b>Khách hàng:</b> {{ selectedOrder.shippingAddress?.fullName }}</p>
          <p><b>Số điện thoại:</b> {{ selectedOrder.shippingAddress?.phone }}</p>
          <p><b>Địa chỉ:</b> {{ selectedOrder.shippingAddress?.address }}</p>
          <p><b>Ngày đặt:</b> {{ new Date(selectedOrder.createdAt).toLocaleString('vi-VN') }}</p>
          <hr style="margin: 15px 0; opacity: 0.1">
          <div v-for="item in selectedOrder.items" :key="item.productId" class="mini-order-item">
             <span>{{ item.productName }} x {{ item.quantity }}</span>
             <span>{{ formatPrice(item.price * item.quantity) }}</span>
          </div>
          <p style="text-align: right; margin-top: 10px; font-weight: bold;">Tổng: {{ formatPrice(selectedOrder.totalAmount) }}</p>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" @click="selectedOrder = null">Đóng</button></div>
      </div>
    </div>

    <div v-if="selectedUser" class="modal-overlay" @click.self="selectedUser = null">
      <div class="modal-content">
        <h3>Chi tiết người dùng</h3>
        <p><b>Tên:</b> {{ selectedUser.name }}</p>
        <p><b>Email:</b> {{ selectedUser.email }}</p>
        <p><b>Vai trò:</b> <span :class="['role-badge', selectedUser.role]">{{ selectedUser.role }}</span></p>
        <div class="modal-footer"><button class="btn btn-secondary" @click="selectedUser = null">Đóng</button></div>
      </div>
    </div>
    </div>
</template>

<script setup>
import "./Admin.css";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  getUsers, deleteUser,
  getProducts, createProduct, deleteProduct, updateProduct,
  getCategories, createCategory, deleteCategory, updateCategory,
  getAllOrders, updateOrderStatus // Giả sử bạn đã thêm 2 hàm này vào adminService.js
} from "@/services/adminService";

const active = ref("dashboard");
const user = ref(null);
const router = useRouter();
const fileInput = ref(null);

const users = ref([]);
const products = ref([]);
const categories = ref([]);
const orders = ref([]);

const newProduct = ref({ productName: "", price: 0, quantity: 0, categoryId: "" });
const selectedFile = ref(null);
const newCategory = ref({ name: "", description: "" });

const selectedUser = ref(null);
const selectedOrder = ref(null);
const editingProduct = ref(null);
const editFile = ref(null);
const editingCategory = ref(null);

const roleFilter = ref("all");
const searchQuery = ref("");
const orderSearchQuery = ref("");
const orderStatusFilter = ref("all");

// FILTER LOGIC
const filteredUsers = computed(() => {
  let result = users.value;
  if (roleFilter.value !== "all") result = result.filter(u => u.role === roleFilter.value);
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(u => u.name.toLowerCase().includes(q));
  }
  return result;
});

const filteredOrders = computed(() => {
  let result = orders.value;
  if (orderStatusFilter.value !== "all") result = result.filter(o => o.status === orderStatusFilter.value);
  if (orderSearchQuery.value.trim()) {
    const q = orderSearchQuery.value.toLowerCase();
    result = result.filter(o => o._id.toLowerCase().includes(q) || o.shippingAddress?.fullName.toLowerCase().includes(q));
  }
  return result;
});

const loadData = async () => {
  try {
    const [pRes, cRes, oRes] = await Promise.all([getProducts(), getCategories(), getAllOrders()]);
    products.value = pRes.data;
    categories.value = cRes.data;
    orders.value = oRes.data;

    const uLocal = JSON.parse(localStorage.getItem("user"));
    if (uLocal?.role === "admin") {
      const uRes = await getUsers();
      users.value = uRes.data;
    }
  } catch (err) {
    console.error("Lỗi load dữ liệu:", err.response?.data || err.message);
  }
};

onMounted(() => {
  const u = localStorage.getItem("user");
  if (!u) return router.push("/");
  user.value = JSON.parse(u);
  if (user.value.role !== "admin") return router.push("/");
  loadData();
});

const logout = () => { localStorage.clear(); router.push("/"); };

// --- ORDERS ---
const viewOrder = (o) => selectedOrder.value = o;
const translateStatus = (s) => {
  const map = { pending: 'Chờ duyệt', confirmed: 'Đã duyệt', shipping: 'Đang giao', completed: 'Hoàn tất', cancelled: 'Đã hủy' };
  return map[s] || s;
};
const handleUpdateOrderStatus = async (id, status) => {
  if (confirm(`Xác nhận chuyển trạng thái sang ${translateStatus(status)}?`)) {
    try {
      await updateOrderStatus(id, { status });
      loadData();
    } catch (err) { alert("Lỗi cập nhật đơn hàng"); }
  }
};

// --- USER ---
const viewUser = (u) => selectedUser.value = u;
const removeUser = async (id) => { if (confirm("Xóa người dùng này?")) { await deleteUser(id); loadData(); } };

// --- PRODUCT ---
const handleFileUpload = (e) => selectedFile.value = e.target.files[0];
const handleEditFileUpload = (e) => editFile.value = e.target.files[0];
const addProduct = async () => {
  if (!newProduct.value.categoryId) return alert("Vui lòng chọn danh mục!");
  try {
    const fd = new FormData();
    fd.append("productName", newProduct.value.productName);
    fd.append("price", newProduct.value.price);
    fd.append("quantity", newProduct.value.quantity);
    fd.append("categoryId", newProduct.value.categoryId);
    if (selectedFile.value) fd.append("image", selectedFile.value);
    await createProduct(fd);
    newProduct.value = { productName: "", price: 0, quantity: 0, categoryId: "" };
    selectedFile.value = null;
    if (fileInput.value) fileInput.value.value = "";
    loadData();
    alert("Thêm thành công!");
  } catch (err) { alert("Lỗi thêm SP"); }
};
const removeProduct = async (id) => { if (confirm("Xóa SP?")) { await deleteProduct(id); loadData(); } };
const openEditProduct = (p) => editingProduct.value = { ...p, categoryId: p.categoryId?._id || p.categoryId };
const saveProductEdit = async () => {
  try {
    const fd = new FormData();
    fd.append("productName", editingProduct.value.productName);
    fd.append("price", editingProduct.value.price);
    fd.append("quantity", editingProduct.value.quantity);
    fd.append("categoryId", editingProduct.value.categoryId);
    if (editFile.value) fd.append("image", editFile.value);
    await updateProduct(editingProduct.value._id, fd);
    editingProduct.value = null; loadData(); alert("Cập nhật thành công!");
  } catch (err) { console.error(err); }
};

// --- CATEGORY ---
const handleAddCategory = async () => {
  if (!newCategory.value.name) return;
  await createCategory(newCategory.value);
  newCategory.value = { name: "", description: "" };
  loadData();
};
const handleRemoveCategory = async (id) => { if (confirm("Xóa DM?")) { await deleteCategory(id); loadData(); } };
const openEditCategory = (c) => editingCategory.value = { ...c };
const saveCategoryEdit = async () => {
  await updateCategory(editingCategory.value._id, editingCategory.value);
  editingCategory.value = null; loadData();
};

const formatPrice = (p) => Number(p).toLocaleString("vi-VN") + " đ";
const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/50";
  const cleanPath = path.replace(/\\/g, '/');
  return `http://localhost:3000/${cleanPath}`;
};
</script>