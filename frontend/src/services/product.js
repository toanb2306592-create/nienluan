import api from "./api";

// Lấy tất cả sản phẩm
export const getProducts = () => {
  return api.get("/products");
};

// Lấy sản phẩm theo category
export const getProductsByCategory = (id) => {
  return api.get(`/products?categoryId=${id}`);
};

// Lấy CHI TIẾT 1 sản phẩm theo ID
export const getProductById = (id) => {
  return api.get(`/products/${id}`); 
};

// Thêm vào giỏ hàng
export const addToCart = (payload) => {
  const token = localStorage.getItem("token"); 
  
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