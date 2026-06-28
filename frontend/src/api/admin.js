import api from "./axios";

export const getAdminStats = () => api.get("/admin/stats");
export const getAllUsers = () => api.get("/admin/users");
export const updateUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role });
export const updateUserStatus = (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
