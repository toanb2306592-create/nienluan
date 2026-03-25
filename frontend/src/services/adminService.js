import api from "./api";

// --- QUẢN LÝ NGƯỜI DÙNG ---
export const getUsers = () => api.get("/users");
export const deleteUser = (id) => api.delete(`/users/${id}`);

// --- QUẢN LÝ SẢN PHẨM ---
export const getProducts = () => api.get("/products");
export const deleteProduct = (id) => api.delete(`/products/${id}`);

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

// --- QUẢN LÝ ĐƠN HÀNG ---
export const getAllOrders = () => api.get('/order'); 

// Admin duyệt đơn
export const confirmOrder = (id) => api.put(`/order/confirm/${id}`);

// Admin xác nhận đang giao hàng
export const confirmShipping = (id) => api.put(`/order/shipping/${id}`);

// User xác nhận đã nhận hàng (Dùng cho trang User hoặc nút confirm của Admin nếu cần)
export const confirmReceived = (id) => api.put(`/order/received/${id}`);