import api from "./api";

const AddressService = {
  getAll: () => api.get("/address"),
  create: (data) => api.post("/address", data),
  update: (id, data) => api.put(`/address/${id}`, data),
  delete: (id) => api.delete(`/address/${id}`),
};

export default AddressService;