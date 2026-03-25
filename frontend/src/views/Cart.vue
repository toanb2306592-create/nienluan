<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="title">Xác nhận đơn hàng</h1>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Đang xử lý dữ liệu...</p>
      </div>

      <div v-else class="cart-grid">
        <div class="left-col">
          
          <div class="checkout-box">
            <div class="section-header">
              <h3><i class="fas fa-user-circle"></i> Thông tin liên hệ</h3>
            </div>
            <div class="user-contact-info">
              <div class="info-item">
                <span class="label">Người nhận:</span>
                <span class="value">{{ currentUser?.name || 'Chưa cập nhật' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Số điện thoại:</span>
                <span v-if="currentUser?.phone" class="value">{{ currentUser.phone }}</span>
                <span v-else class="value text-danger">Chưa có số điện thoại</span>
              </div>
              <button class="btn-edit-contact" @click="handleUpdatePhone">
                <i class="fas fa-edit"></i> {{ currentUser?.phone ? 'Thay đổi SĐT' : '+ Thêm SĐT liên hệ' }}
              </button>
            </div>
          </div>

          <div class="checkout-box">
            <div class="section-header">
              <h3><i class="fas fa-map-marker-alt"></i> Địa chỉ nhận hàng</h3>
              <button :class="['btn-toggle-add', { 'btn-close': showAddForm }]" @click="showAddForm = !showAddForm">
                {{ showAddForm ? '✕ Đóng' : '+ Thêm địa chỉ mới' }}
              </button>
            </div>

            <div v-if="!showAddForm" class="address-selector">
              <div 
                v-for="addr in addresses" 
                :key="addr._id" 
                :class="['address-card', { active: selectedAddressId === addr._id }]"
                @click="selectedAddressId = addr._id"
              >
                <div class="addr-content">
                  <div class="addr-main">
                    <span class="addr-text">{{ addr.address }}</span>
                    <span v-if="addr.isDefault" class="badge-default">Mặc định</span>
                  </div>
                </div>
                <div class="addr-radio">
                  <div class="radio-circle"></div>
                </div>
              </div>
              
              <div v-if="addresses.length === 0" class="no-addr-msg">
                <i class="fas fa-map-marked-alt"></i>
                <p>Vui lòng thêm địa chỉ để chúng mình giao hàng nhé!</p>
              </div>
            </div>

            <transition name="slide">
              <div v-if="showAddForm" class="quick-add-address">
                <div class="form-group">
                  <label><i class="fas fa-keyboard"></i> Địa chỉ chi tiết</label>
                  <textarea 
                    v-model="newAddrText" 
                    placeholder="VD: 123 Đường ABC, Quận X, TP. Y"
                  ></textarea>
                </div>
                <div class="form-group checkbox-wrapper">
                  <label class="custom-checkbox">
                    <input type="checkbox" v-model="isDefaultAddr" />
                    <span class="checkmark"></span>
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
                <button class="btn-save-addr" @click="handleCreateAddress">
                  LƯU ĐỊA CHỈ NÀY
                </button>
              </div>
            </transition>
          </div>

          <div class="cart-items-box">
            <div class="section-header item-header">
              <h3><i class="fas fa-box-open"></i> Kiểm tra sản phẩm ({{ cart?.items?.length || 0 }})</h3>
              <div v-if="cart?.items?.length > 0" class="select-all-wrapper">
                 <label class="custom-checkbox mini">
                    <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
                    <span class="checkmark"></span>
                    Chọn tất cả
                  </label>
              </div>
            </div>
            
            <div v-if="cart?.items?.length > 0" class="items-list">
              <div v-for="item in cart.items" :key="item.productId?._id" class="item-row">
                <template v-if="item.productId">
                  <div class="item-checkbox">
                    <label class="custom-checkbox mini">
                      <input type="checkbox" :value="item.productId._id" v-model="selectedProductIds" />
                      <span class="checkmark"></span>
                    </label>
                  </div>
                  <img :src="getImageUrl(item.productId.image)" class="item-img" alt="product">
                  <div class="item-details">
                    <span class="category-tag">{{ item.productId.categoryId?.name || 'Sản phẩm' }}</span>
                    <h3 class="product-name">{{ item.productId.productName }}</h3>
                    <p class="price-unit">{{ formatPrice(item.productId.price) }}</p>
                    
                    <div class="qty-control">
                      <button class="qty-btn" @click="updateQty(item.productId._id, item.quantity - 1)">-</button>
                      <span class="qty-num">{{ item.quantity }}</span>
                      <button class="qty-btn" @click="updateQty(item.productId._id, item.quantity + 1)">+</button>
                    </div>
                  </div>
                  <div class="item-right">
                    <p class="subtotal">{{ formatPrice(item.productId.price * item.quantity) }}</p>
                    <button @click="removeItem(item.productId._id)" class="btn-del">
                      <i class="far fa-trash-alt"></i> Xóa
                    </button>
                  </div>
                </template>
              </div>
            </div>

            <div v-else class="inner-empty-state">
              <div class="empty-icon">🛒</div>
              <p class="empty-text">Giỏ hàng của bạn đang trống</p>
              <button class="btn-shop-now-small" @click="$router.push('/')">Khám phá sản phẩm ngay</button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-box">
            <h3>Hóa đơn thanh toán</h3>
            <div class="summary-row">
              <span>Sản phẩm đã chọn</span>
              <span>{{ selectedProductIds.length }} món</span>
            </div>
            <div class="summary-row">
              <span>Tạm tính</span>
              <span>{{ formatPrice(totalPrice) }}</span>
            </div>
            <div class="summary-row">
              <span>Phí vận chuyển</span>
              <span class="free-ship">Miễn phí</span>
            </div>
            <hr class="divider" />
            <div class="summary-row total">
              <span>TỔNG CỘNG</span>
              <strong class="total-price">{{ formatPrice(totalPrice) }}</strong>
            </div>
            
            <button 
              @click="handleCheckout" 
              class="btn-checkout" 
              :disabled="!selectedAddressId || !currentUser?.phone || selectedProductIds.length === 0"
            >
              🚀 ĐẶT HÀNG NGAY
            </button>

            <div class="validation-notices">
              <p v-if="!currentUser?.phone" class="warn-text">⚠️ Cần cập nhật Số điện thoại</p>
              <p v-if="!selectedAddressId" class="warn-text">⚠️ Cần chọn địa chỉ giao hàng</p>
              <p v-if="selectedProductIds.length === 0" class="warn-text">⚠️ Bạn chưa chọn món nào</p>
            </div>

            <p class="secure-note"><i class="fas fa-shield-alt"></i> Thanh toán an toàn & bảo mật</p>
          </div>
          
          <button class="btn-back-link" @click="$router.push('/')">
            <i class="fas fa-arrow-left"></i> Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/services/api"; 
import AddressService from "@/services/address";
import { useRouter } from "vue-router";

// State
const cart = ref({ items: [] });
const loading = ref(true);
const router = useRouter();
const currentUser = ref(null);
const addresses = ref([]);
const selectedAddressId = ref(null);
const selectedProductIds = ref([]); 
const showAddForm = ref(false);
const newAddrText = ref("");
const isDefaultAddr = ref(false);

// Methods
const getUserId = () => {
  const userLocal = localStorage.getItem("user");
  if (!userLocal) return null;
  const userData = JSON.parse(userLocal);
  return userData._id || userData.id;
};

const fetchData = async () => {
  const userId = getUserId();
  if (!userId) return router.push('/login');

  loading.value = true;
  try {
    const [userRes, cartRes, addrRes] = await Promise.all([
      api.get(`/users/me`),
      api.get(`/cart/${userId}`),
      AddressService.getAll(userId)
    ]);

    currentUser.value = userRes.data;
    cart.value = cartRes.data || { items: [] };
    addresses.value = addrRes.data || [];

    const def = addresses.value.find(a => a.isDefault);
    if (def) selectedAddressId.value = def._id;
    else if (addresses.value.length > 0) selectedAddressId.value = addresses.value[0]._id;

    if (cart.value?.items?.length > 0) {
      selectedProductIds.value = cart.value.items
        .filter(i => i.productId)
        .map(item => item.productId._id);
    }
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
    if (err.response?.status === 401) router.push('/login');
  } finally {
    loading.value = false;
  }
};

const totalPrice = computed(() => {
  if (!cart.value?.items) return 0;
  return cart.value.items
    .filter(item => item.productId && selectedProductIds.value.includes(item.productId._id))
    .reduce((sum, item) => sum + (item.productId.price || 0) * item.quantity, 0);
});

const isAllSelected = computed(() => {
  const validItems = cart.value?.items?.filter(i => i.productId) || [];
  return validItems.length > 0 && selectedProductIds.value.length === validItems.length;
});

const toggleSelectAll = (e) => {
  if (e.target.checked) {
    selectedProductIds.value = cart.value.items
      .filter(i => i.productId)
      .map(item => item.productId._id);
  } else {
    selectedProductIds.value = [];
  }
};

const handleCheckout = async () => {
  const itemsToShip = cart.value.items
    .filter(item => item.productId && selectedProductIds.value.includes(item.productId._id))
    .map(item => ({
      productId: String(item.productId._id),
      quantity: Number(item.quantity)
    }));

  try {
    loading.value = true;
    await api.post("/order/checkout", {
      addressId: String(selectedAddressId.value),
      selectedItems: itemsToShip 
    });
    alert("🎉 Đặt hàng thành công!");
    router.push("/orders");
  } catch (err) {
    alert("❌ Thất bại: " + (err.response?.data?.message || "Lỗi giao dịch"));
  } finally {
    loading.value = false;
  }
};

const handleUpdatePhone = async () => {
  const newPhone = prompt("Nhập số điện thoại liên hệ:", currentUser.value?.phone || "");
  if (newPhone && newPhone.trim()) {
    try {
      await api.put(`/users/${currentUser.value._id}`, { phone: newPhone.trim() });
      currentUser.value.phone = newPhone;
    } catch (err) { alert("Lỗi cập nhật!"); }
  }
};

const handleCreateAddress = async () => {
  if (!newAddrText.value.trim()) return alert("Vui lòng nhập địa chỉ!");
  try {
    const res = await AddressService.create({ 
      userId: currentUser.value._id,
      address: newAddrText.value, 
      isDefault: isDefaultAddr.value,
      fullName: currentUser.value.name, 
      phone: currentUser.value.phone 
    });
    addresses.value.push(res.data);
    selectedAddressId.value = res.data._id;
    showAddForm.value = false;
    newAddrText.value = "";
    isDefaultAddr.value = false;
  } catch (err) { alert("Lỗi thêm địa chỉ!"); }
};

const updateQty = async (productId, quantity) => {
  if (quantity < 1) return;
  try {
    await api.put("/cart", { userId: getUserId(), productId, quantity });
    const item = cart.value.items.find(i => i.productId?._id === productId);
    if (item) item.quantity = quantity;
  } catch (err) { console.error(err); }
};

const removeItem = async (productId) => {
  if (!confirm("Xóa sản phẩm này khỏi giỏ hàng?")) return;
  try {
    await api.delete(`/cart/${getUserId()}/${productId}`);
    cart.value.items = cart.value.items.filter(i => i.productId?._id !== productId);
    selectedProductIds.value = selectedProductIds.value.filter(id => id !== productId);
  } catch (err) { console.error(err); }
};

const formatPrice = (p) => p ? Number(p).toLocaleString("vi-VN") + " đ" : "0 đ";
const getImageUrl = (p) => p ? (p.startsWith('http') ? p : `http://localhost:3000/${p.replace(/\\/g, '/')}`) : 'https://placehold.co/100';

onMounted(fetchData);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* --- General Layout --- */
.cart-page { 
  background-color: #f8fafc; 
  min-height: 100vh; 
  padding: 40px 15px; 
  font-family: 'Plus Jakarta Sans', sans-serif; 
  color: #1e293b;
}

.container { max-width: 1100px; margin: auto; }

.title { 
  font-weight: 800; 
  color: #0f172a; 
  margin-bottom: 30px; 
  font-size: 32px;
  letter-spacing: -1px;
}

.cart-grid { 
  display: grid; 
  grid-template-columns: 1fr 380px; 
  gap: 30px; 
  align-items: start; 
}

/* --- Card Styling --- */
.checkout-box, .cart-items-box { 
  background: #ffffff; 
  padding: 30px; 
  border-radius: 24px; 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  margin-bottom: 24px; 
  border: 1px solid #f1f5f9;
}

.section-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 24px; 
}

.section-header h3 { 
  font-size: 18px; 
  color: #0f172a; 
  margin: 0; 
  font-weight: 700; 
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-header h3 i { color: #3b82f6; }

/* --- Contact Info --- */
.user-contact-info { 
  background: #f8fafc; 
  border: 2px dashed #e2e8f0; 
  padding: 24px; 
  border-radius: 16px; 
}

.info-item { margin-bottom: 12px; font-size: 15px; display: flex; align-items: center;}
.info-item .label { color: #64748b; width: 130px; font-weight: 500; }
.info-item .value { font-weight: 700; color: #0f172a; }

.btn-edit-contact { 
  background: white; 
  border: 1px solid #e2e8f0; 
  color: #334155; 
  padding: 10px 18px; 
  border-radius: 10px; 
  font-size: 13px; 
  font-weight: 700;
  cursor: pointer; 
  transition: all 0.2s; 
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-edit-contact:hover { 
  background: #f1f5f9; 
  border-color: #cbd5e1;
}

/* --- Address Section --- */
.address-card { 
  border: 2px solid #f1f5f9; 
  border-radius: 16px; 
  padding: 20px; 
  margin-top: 14px; 
  cursor: pointer; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.address-card:hover { border-color: #3b82f6; background: #f0f7ff; }
.address-card.active { 
  border-color: #3b82f6; 
  background: #eff6ff; 
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.addr-text { font-size: 15px; color: #334155; font-weight: 600; line-height: 1.5; }

.badge-default { 
  background: #dcfce7; 
  color: #15803d; 
  padding: 4px 12px; 
  border-radius: 20px; 
  font-size: 11px; 
  font-weight: 800;
  margin-left: 10px;
  text-transform: uppercase;
}

.radio-circle {
  width: 22px;
  height: 22px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  position: relative;
  transition: 0.2s;
}

.address-card.active .radio-circle {
  border-color: #3b82f6;
  background: #3b82f6;
}

.address-card.active .radio-circle::after {
  content: '';
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* --- Quick Add Address Form --- */
.quick-add-address {
  background: #f1f5f9;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  margin-top: 15px;
}

.form-group label { display: block; margin-bottom: 10px; font-weight: 700; font-size: 14px; color: #475569; }
.form-group textarea {
  width: 100%; border: 2px solid #e2e8f0; border-radius: 12px; padding: 15px;
  min-height: 100px; font-family: inherit; transition: 0.2s; font-size: 15px;
}
.form-group textarea:focus { outline: none; border-color: #3b82f6; background: white; }

.btn-save-addr {
  width: 100%; 
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
  color: white; border: none; padding: 16px;
  border-radius: 12px; font-weight: 700; cursor: pointer; margin-top: 10px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); transition: 0.3s;
}

.btn-save-addr:hover { transform: translateY(-2px); filter: brightness(1.1); }

.btn-toggle-add { 
  background: #eff6ff; color: #2563eb; border: none; padding: 8px 16px; 
  border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s;
}
.btn-toggle-add.btn-close { background: #fee2e2; color: #ef4444; }

/* --- Custom Checkbox --- */
.custom-checkbox {
  display: flex; align-items: center; position: relative; padding-left: 30px;
  cursor: pointer; font-size: 14px; font-weight: 600; color: #334155; user-select: none;
}
.custom-checkbox input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
.checkmark {
  position: absolute; top: 0; left: 0; height: 20px; width: 20px;
  background-color: #e2e8f0; border-radius: 6px; transition: 0.2s;
}
.custom-checkbox:hover input ~ .checkmark { background-color: #cbd5e1; }
.custom-checkbox input:checked ~ .checkmark { background-color: #3b82f6; }
.checkmark:after {
  content: ""; position: absolute; display: none;
  left: 7px; top: 3px; width: 5px; height: 10px;
  border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg);
}
.custom-checkbox input:checked ~ .checkmark:after { display: block; }
.mini .checkmark { height: 18px; width: 18px; }

/* --- Items List --- */
.item-row { display: flex; align-items: center; padding: 24px 0; border-bottom: 1px solid #f1f5f9; }
.item-img { width: 90px; height: 90px; object-fit: cover; border-radius: 16px; margin-left: 15px; background: #f8fafc; }
.item-details { flex: 1; padding: 0 20px; }
.product-name { font-size: 17px; font-weight: 700; color: #0f172a; margin: 4px 0; }
.price-unit { color: #64748b; font-weight: 600; font-size: 14px; }
.category-tag { font-size: 10px; color: #3b82f6; font-weight: 800; text-transform: uppercase; background: #eff6ff; padding: 3px 10px; border-radius: 6px; }

.qty-control { display: flex; align-items: center; background: #f1f5f9; width: fit-content; padding: 5px; border-radius: 10px; margin-top: 12px; }
.qty-btn { width: 30px; height: 30px; border: none; background: white; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.qty-num { font-weight: 800; padding: 0 15px; font-size: 14px; }

.item-right { text-align: right; }
.subtotal { font-weight: 800; color: #0f172a; font-size: 17px; margin-bottom: 8px; }
.btn-del { color: #94a3b8; background: none; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: 0.2s; }
.btn-del:hover { color: #ef4444; }

/* --- Summary Box --- */
.summary-box { 
  background: #ffffff; padding: 32px; border-radius: 28px; 
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05); 
  position: sticky; top: 30px; border: 1px solid #f1f5f9;
}
.summary-box h3 { font-size: 20px; margin-bottom: 24px; font-weight: 800; letter-spacing: -0.5px; }
.summary-row { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 15px; color: #64748b; font-weight: 500; }
.free-ship { color: #10b981; font-weight: 800; }
.divider { border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0; }
.total { color: #0f172a !important; }
.total-price { color: #2563eb; font-size: 26px; font-weight: 800; }

.btn-checkout { 
  width: 100%; padding: 18px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); 
  color: #ffffff; border: none; border-radius: 16px; font-weight: 800; font-size: 16px; 
  cursor: pointer; margin-top: 24px; transition: 0.3s; box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.2);
}
.btn-checkout:hover:not(:disabled) { transform: translateY(-2px); filter: contrast(1.2); }
.btn-checkout:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; box-shadow: none; }

.warn-text { background: #fff7ed; color: #c2410c; font-size: 12px; padding: 10px; border-radius: 10px; margin-top: 8px; font-weight: 700; border-left: 4px solid #f97316; }

/* --- Utilities --- */
.loading-state { text-align: center; padding: 100px 0; color: #64748b; font-weight: 600; }
.spinner { width: 45px; height: 45px; border: 5px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s infinite linear; margin: 0 auto 20px; }
@keyframes spin { to { transform: rotate(360deg); } }

.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }

@media (max-width: 992px) {
  .cart-grid { grid-template-columns: 1fr; }
  .summary-box { position: static; margin-top: 20px; }
  .title { font-size: 26px; text-align: center; }
}
</style>