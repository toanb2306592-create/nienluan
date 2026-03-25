import api from "./api"; // Hoặc axios từ file cấu hình của bạn

// --- QUẢN LÝ NGƯỜI DÙNG ---
export const getUsers = () => api.get("/users");
export const deleteUser = (id) => api.delete(`/users/${id}`);

// --- QUẢN LÝ SẢN PHẨM ---
export const getProducts = () => api.get("/products");
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Khi tạo/sửa sản phẩm có ảnh, ta gửi FormData
export const createProduct = (formData) => {
  return api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateProduct = (id, formData) => {
  return api.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// --- QUẢN LÝ DANH MỤC ---
export const getCategories = () => api.get("/categories");
export const createCategory = (data) => api.post("/categories", data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
// Lấy tất cả đơn hàng
export const getAllOrders = () => {
    return axios.get('/admin/orders'); // Thay đổi URL theo backend của bạn
};

// Cập nhật trạng thái (Duyệt/Giao hàng/Hủy)
export const updateOrderStatus = (orderId, data) => {
    return axios.put(`/admin/orders/${orderId}`, data);
};