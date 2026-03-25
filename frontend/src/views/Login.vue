<template>
  <div class="login-page">
    <div class="login-container">

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
                <input v-model="loginPassword" type="password" placeholder="Nhập mật khẩu" />
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
// Thay đổi import service sao cho đúng cấu trúc thư mục của bạn
import { login, register } from "@/services/auth";

const router = useRouter();

const isLogin = ref(true);

const loginEmail = ref("");
const loginPassword = ref("");

const registerName = ref("");
const registerEmail = ref("");
const registerPassword = ref("");

const error = ref("");

// XỬ LÝ ĐĂNG NHẬP
const handleLogin = async () => {
  error.value = "";
  try {
    const { user, token } = await login(
      loginEmail.value,
      loginPassword.value
    );

    // Lưu thông tin vào localStorage (nhớ lưu cả token nếu API có trả về)
    localStorage.setItem("user", JSON.stringify(user));
    if(token) localStorage.setItem("token", token);

    // Phân quyền điều hướng sau khi login thành công
    if (user.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  } catch (e) {
    error.value = e.message || "Đăng nhập thất bại. Vui lòng thử lại.";
  }
};

// XỬ LÝ ĐĂNG KÝ
const handleRegister = async () => {
  error.value = "";
  try {
    const { user, token } = await register({
      name: registerName.value,
      email: registerEmail.value,
      password: registerPassword.value,
      role: "user" // Mặc định người đăng ký mới là user
    });

    localStorage.setItem("user", JSON.stringify(user));
    if(token) localStorage.setItem("token", token);

    router.push("/");
  } catch (e) {
    error.value = e.message || "Đăng ký thất bại. Vui lòng kiểm tra lại.";
  }
};
</script>

<style scoped>
/* TRANG ĐĂNG NHẬP TỔNG THỂ */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh; /* Chiếm phần lớn chiều cao màn hình, để trống chỗ cho header/footer */
  background-color: #111; /* Màu nền tối đồng bộ toàn trang */
  padding: 20px;
}

/* KHUNG CHỨA FORM CHÍNH */
.login-container {
  width: 800px;
  background: #ffffff; /* Nền trắng cho form để dễ đọc */
  border-radius: 12px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); /* Đổ bóng mạnh tạo chiều sâu trên nền đen */
}

/* CỘT TRÁI (FORM) */
.left {
  flex: 1;
  padding: 40px 30px;
  min-height: 400px;
}

/* TABS ĐIỀU HƯỚNG */
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  gap: 30px;
}

.tabs span {
  cursor: pointer;
  padding-bottom: 8px;
  font-size: 18px;
  color: #666;
  transition: all 0.3s ease;
}

.tabs .active {
  color: #00d1b2;
  border-bottom: 3px solid #00d1b2;
  font-weight: 700;
}

/* CÁC TRƯỜNG NHẬP LIỆU */
.form-group {
  width: 85%;
  margin: 15px auto;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s;
  box-sizing: border-box; /* Tránh input bị tràn lề */
}

.form-group input:focus {
  outline: none;
  border-color: #00d1b2;
}

/* NÚT BẤM CHÍNH */
.main-btn {
  width: 85%;
  margin: 25px auto 10px auto;
  display: block;
  padding: 14px;
  background: #00d1b2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s;
}

.main-btn:hover {
  background: #00b89c;
}

.error-text {
  color: #e74c3c;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

/* CỘT PHẢI (CHÀO MỪNG) */
.right {
  flex: 1;
  background: linear-gradient(135deg, #00d1b2 0%, #00a88f 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: center;
}

.right h2 {
  font-size: 32px;
  margin-bottom: 15px;
}

.right p {
  font-size: 16px;
  line-height: 1.5;
  opacity: 0.9;
}

/* HIỆU ỨNG CHUYỂN ĐỔI FORM (VUE TRANSITION) */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* ĐÁP ỨNG TRÊN DI ĐỘNG (RESPONSIVE) */
@media (max-width: 850px) {
  .login-container {
    width: 95%;
    flex-direction: column;
  }

  .right {
    display: none; /* Ẩn phần chào mừng trên màn hình nhỏ để tiết kiệm không gian */
  }

  .left {
    padding: 30px 20px;
  }
}
</style>