import api from "./axios";

export const getContentList = (params = {}) => api.get("/content", { params });
export const getHomeRows = () => api.get("/content/categories");
export const getContentById = (id) => api.get(`/content/${id}`);
export const incrementView = (id) => api.post(`/content/${id}/view`);

// Admin-only
export const createContent = (data) => api.post("/content", data);
export const updateContent = (id, data) => api.put(`/content/${id}`, data);
export const deleteContent = (id) => api.delete(`/content/${id}`);
