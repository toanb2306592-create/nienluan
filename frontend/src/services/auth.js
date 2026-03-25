import api from "./api";

export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });

  // ✅ Lưu Token thật từ phản hồi của Backend
  // Giả sử backend trả về cấu trúc: { token: "...", user: {...} }
  if (res.data && res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
};

export const register = async (data) => {
  const res = await api.post("/users", data);
  return res.data;
};