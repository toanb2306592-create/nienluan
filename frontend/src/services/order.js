import api from "./api";

export const checkout = (payload) => api.post("/order/checkout", payload);
export const getMyOrders = () => api.get("/order/my-orders");
export const getOrderDetails = (id) => api.get(`/order/${id}`);
export const confirmReceived = (id) => api.put(`/order/received/${id}`);
export const cancelOrder = (id) => api.put(`/order/cancel/${id}`);

// Cho Admin
export const getAllOrders = () => api.get("/order");
export const confirmOrder = (id) => api.put(`/order/confirm/${id}`);
export const confirmShipping = (id) => api.put(`/order/shipping/${id}`);