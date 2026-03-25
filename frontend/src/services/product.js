import api from "./api";

// Lấy tất cả sản phẩm
export const getProducts = () => {
  return api.get("/products");
};

// Lấy sản phẩm theo category
export const getProductsByCategory = (id) => {
  return api.get(`/products?categoryId=${id}`);
};

// SỬA TẠI ĐÂY: Nhận 1 object chứa userId, productId, quantity
export const addToCart = (payload) => {
  const token = localStorage.getItem("token"); // Lấy token trực tiếp ở đây cho tiện
  
  return api.post(
    "/cart",
    { 
      userId: payload.userId, 
      productId: payload.productId, 
      quantity: payload.quantity 
    },
    { 
      headers: { Authorization: `Bearer ${token}` } 
    }
  );
};