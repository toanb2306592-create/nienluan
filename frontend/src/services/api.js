import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000, // Tăng lên 10s để tránh lỗi timeout khi server xử lý chậm
});

// INTERCEPTOR: Tự động đính kèm Token vào Header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Kiểm tra token hợp lệ trước khi gửi
  if (token && token !== "undefined" && token !== "null" && token !== "fake-token") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// INTERCEPTOR: Xử lý phản hồi từ Server
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu server báo 401 (Hết hạn phiên làm việc hoặc chưa đăng nhập)
    if (error.response && error.response.status === 401) {
      console.warn("Phiên làm việc hết hạn, vui lòng đăng nhập lại.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Bạn có thể redirect về trang login ở đây nếu cần:
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;