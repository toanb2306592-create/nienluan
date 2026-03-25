<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="login-container">
      
      <button class="close-modal" @click="$emit('close')">✕</button>

      <div class="left">
        <div class="tabs">
          <span 
            :class="{ active: isLogin }" 
            @click="isLogin = true"
          >
            Đăng nhập
          </span>
          <span 
            :class="{ active: !isLogin }" 
            @click="isLogin = false"
          >
            Đăng ký
          </span>
        </div>

        <transition name="fade-slide" mode="out-in">
          <div :key="isLogin">
            <div v-if="isLogin">
              <div class="form-group">
                <label>Email</label>
                <input v-model="loginEmail" type="text" placeholder="Nhập email" />
              </div>

              <div class="form-group">
                <label>Mật khẩu</label>
                <input 
                  v-model="loginPassword" 
                  type="password" 
                  placeholder="Nhập mật khẩu" 
                  @keyup.enter="handleLogin" 
                />
              </div>

              <button class="main-btn" @click="handleLogin">
                Đăng nhập
              </button>
              <p v-if="error" class="error-text">
                {{ error }}
              </p>
            </div>

            <div v-else>
              <div class="form-group">
                <label>Tên</label>
                <input v-model="registerName" type="text" placeholder="Nhập tên" />
              </div>

              <div class="form-group">
                <label>Email</label>
                <input v-model="registerEmail" type="text" placeholder="Nhập email" />
              </div>

              <div class="form-group">
                <label>Mật khẩu</label>
                <input v-model="registerPassword" type="password" placeholder="Nhập mật khẩu" />
              </div>

              <button class="main-btn" @click="handleRegister">
                Đăng ký
              </button>
              <p v-if="error" class="error-text">
                {{ error }}
              </p>
            </div>
          </div>
        </transition>
      </div>

      <div class="right">
        <h2>{{ isLogin ? "Welcome 👋" : "Tham gia ngay 🚀" }}</h2>
        <p>
          {{ isLogin 
            ? "Đăng nhập để mua sắm dễ dàng" 
            : "Tạo tài khoản để trải nghiệm tốt hơn" }}
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login, register } from "@/services/auth";

// Định nghĩa sự kiện 'close' để component cha có thể đóng modal này
const emit = defineEmits(['close']);
const router = useRouter();

const isLogin = ref(true);
const loginEmail = ref("");
const loginPassword = ref("");
const registerName = ref("");
const registerEmail = ref("");
const registerPassword = ref("");
const error = ref("");

const handleLogin = async () => {
  error.value = "";
  try {
    const { user, token } = await login(loginEmail.value, loginPassword.value);
    localStorage.setItem("user", JSON.stringify(user));
    if(token) localStorage.setItem("token", token);

    // Thông báo thành công và đóng modal
    emit('close');
    
    if (user.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  } catch (e) {
    error.value = e.message || "Đăng nhập thất bại. Vui lòng thử lại.";
  }
};

const handleRegister = async () => {
  error.value = "";
  try {
    const { user, token } = await register({
      name: registerName.value,
      email: registerEmail.value,
      password: registerPassword.value,
      role: "user"
    });

    localStorage.setItem("user", JSON.stringify(user));
    if(token) localStorage.setItem("token", token);

    emit('close');
    router.push("/");
  } catch (e) {
    error.value = e.message || "Đăng ký thất bại. Vui lòng kiểm tra lại.";
  }
};
</script>

<style scoped>
/* LỚP PHỦ NỀN MỜ CỐ ĐỊNH */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Nền tối mờ che các phần bên dưới */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Đảm bảo luôn hiện lên trên cùng */
  padding: 20px;
}

/* KHUNG CHỨA FORM (Giữ nguyên style cũ của bạn nhưng bỏ bớt margin ngoài) */
.login-container {
  position: relative;
  width: 800px;
  max-width: 100%;
  background: #ffffff;
  border-radius: 12px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  animation: modal-appear 0.3s ease-out; /* Hiệu ứng hiện ra */
}

/* NÚT ĐÓNG (X) */
.close-modal {
  position: absolute;
  top: 15px;
  left: 15px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  z-index: 10;
}

.close-modal:hover {
  color: #333;
}

@keyframes modal-appear {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* CÁC STYLE CÒN LẠI GIỮ NGUYÊN TỪ CODE CỦA BẠN */
.left { flex: 1; padding: 40px 30px; min-height: 400px; }
.tabs { display: flex; justify-content: center; margin-bottom: 30px; gap: 30px; }
.tabs span { cursor: pointer; padding-bottom: 8px; font-size: 18px; color: #666; transition: all 0.3s ease; }
.tabs .active { color: #00d1b2; border-bottom: 3px solid #00d1b2; font-weight: 700; }
.form-group { width: 85%; margin: 15px auto; text-align: left; }
.form-group label { display: block; margin-bottom: 8px; color: #333; font-weight: 500; }
.form-group input { width: 100%; padding: 12px 15px; border: 1px solid #ccc; border-radius: 8px; font-size: 15px; box-sizing: border-box; }
.form-group input:focus { outline: none; border-color: #00d1b2; }
.main-btn { width: 85%; margin: 25px auto 10px auto; display: block; padding: 14px; background: #00d1b2; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; }
.main-btn:hover { background: #00b89c; }
.error-text { color: #e74c3c; text-align: center; margin-top: 15px; font-size: 14px; }
.right { flex: 1; background: linear-gradient(135deg, #00d1b2 0%, #00a88f 100%); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px; text-align: center; }
.right h2 { font-size: 32px; margin-bottom: 15px; }
.right p { font-size: 16px; line-height: 1.5; opacity: 0.9; }

/* TRANSITION */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }
.fade-slide-enter-from { opacity: 0; transform: translateX(30px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-30px); }

@media (max-width: 850px) {
  .login-container { width: 95%; flex-direction: column; }
  .right { display: none; }
}
</style>