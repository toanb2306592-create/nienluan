<template>
  <div class="profile-layout">
    <Navbar />
    
    <div class="container">
      <div class="profile-card">
        <div class="profile-sidebar">
          <div class="user-info-header">
            <div class="user-icon">
              <i class="fas fa-user-circle"></i>
            </div>
            <h3 class="user-name">{{ user.name }}</h3>
            <p class="user-role">Thành viên hệ thống</p>
          </div>
          
          <div class="profile-menu">
            <button class="menu-item active">
              <i class="fas fa-id-card"></i> Thông tin cá nhân
            </button>
            <button class="menu-item text-danger" @click="handleLogout">
              <i class="fas fa-sign-out-alt"></i> Đăng xuất
            </button>
          </div>
        </div>

        <div class="profile-content">
          <div class="content-header">
            <h2>Hồ sơ của tôi</h2>
            <p>Thông tin tài khoản đăng ký tại Moon Mart</p>
          </div>

          <div class="info-grid">
            <div class="info-group">
              <label>Họ và tên</label>
              <div class="info-value readonly">
                <i class="fas fa-user"></i>
                <input type="text" :value="user.name" disabled />
              </div>
            </div>

            <div class="info-group">
              <label>Email đăng nhập</label>
              <div class="info-value readonly">
                <i class="fas fa-envelope"></i>
                <input type="email" :value="user.email" disabled />
              </div>
            </div>

            <div class="info-group">
              <label>Số điện thoại liên lạc</label>
              <div class="info-value" :class="{ 'editing': isEditing }">
                <i class="fas fa-phone"></i>
                <input 
                  type="text" 
                  v-model="user.phone" 
                  :disabled="!isEditing" 
                  placeholder="Chưa cập nhật số điện thoại"
                />
              </div>
            </div>
          </div>

          <div class="action-section">
            <div v-if="!isEditing">
              <button class="btn-edit" @click="isEditing = true">
                <i class="fas fa-edit"></i> Cập nhật số điện thoại
              </button>
            </div>
            <div v-else class="edit-actions">
              <button class="btn-save" @click="saveProfile">Lưu thông tin</button>
              <button class="btn-cancel" @click="cancelEdit">Hủy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Navbar from "@/components/Navbar.vue";

const router = useRouter();
const user = ref({
  name: "",
  email: "",
  phone: ""
});
const isEditing = ref(false);
const originalPhone = ref("");

onMounted(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const parsedUser = JSON.parse(userData);
    user.value = { ...parsedUser };
    originalPhone.value = parsedUser.phone || "";
  } else {
    router.push("/login");
  }
});

const saveProfile = () => {
  // Cập nhật số điện thoại mới vào localStorage
  localStorage.setItem("user", JSON.stringify(user.value));
  originalPhone.value = user.value.phone;
  alert("Đã cập nhật số điện thoại thành công!");
  isEditing.value = false;
};

const cancelEdit = () => {
  user.value.phone = originalPhone.value;
  isEditing.value = false;
};

const handleLogout = () => {
  localStorage.clear();
  router.push("/");
  window.location.reload(); // Để Header cập nhật trạng thái đã đăng xuất
};
</script>

<style scoped>
/* Giữ nguyên phần Style cũ của mình, nó đã rất sạch rồi */
.action-section { margin-top: 30px; }
.profile-layout { background: #f4f7f6; min-height: 100vh; padding-bottom: 50px; }
.container { max-width: 900px; margin: 40px auto; padding: 0 20px; }
.profile-card { display: flex; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.profile-sidebar { width: 280px; background: #fdfdfd; padding: 40px 20px; border-right: 1px solid #eee; text-align: center; }
.user-icon { font-size: 80px; color: #164668; margin-bottom: 15px; }
.user-name { font-size: 18px; font-weight: 700; color: #1e293b; }
.profile-menu { width: 100%; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;}
.menu-item { width: 100%; padding: 12px; border: none; background: none; text-align: left; font-size: 14px; font-weight: 600; color: #475569; cursor: pointer; border-radius: 8px; }
.menu-item.active { background: #f0f7ff; color: #164668; }
.text-danger { color: #ef4444 !important; }
.profile-content { flex: 1; padding: 40px; }
.info-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
.info-group label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px; display: block; }
.info-value { display: flex; align-items: center; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0 15px; }
.info-value i { color: #cbd5e1; width: 25px; }
.info-value input { border: none; background: none; padding: 12px; width: 100%; outline: none; font-size: 15px; color: #1e293b; }
.info-value.editing { border-color: #164668; }
.readonly { background: #f8fafc; border-color: #f1f5f9; }
.readonly input { color: #94a3b8; cursor: not-allowed; }
.btn-edit { background: #164668; color: white; border: none; padding: 12px 25px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.edit-actions { display: flex; gap: 10px; }
.btn-save { background: #10b981; color: white; border: none; padding: 12px 25px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-cancel { background: #94a3b8; color: white; border: none; padding: 12px 25px; border-radius: 8px; font-weight: 600; cursor: pointer; }
</style>