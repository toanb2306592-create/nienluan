import api from "./api";

// lấy tất cả danh mục
export const getCategories = () => {
  return api.get("/categories");
};

// lấy 1 danh mục theo id
export const getCategoryById = (id) => {
  return api.get(`/categories/${id}`);
};