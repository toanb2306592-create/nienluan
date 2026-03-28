import api from "./api"; // Giả định file api.js của bạn export default axios instance

export const createReview = (data) => api.post("/reviews", data);
export const getReviewsByProduct = (productId) => api.get(`/reviews/product/${productId}`);
export const getAverageRating = (productId) => api.get(`/reviews/average/${productId}`);