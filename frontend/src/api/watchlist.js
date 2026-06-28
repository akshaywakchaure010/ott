import api from "./axios";

export const getWatchlist = () => api.get("/watchlist");
export const addToWatchlist = (contentId) => api.post(`/watchlist/${contentId}`);
export const removeFromWatchlist = (contentId) => api.delete(`/watchlist/${contentId}`);

export const getContinueWatching = () => api.get("/watchlist/continue-watching");
export const updateContinueWatching = (contentId, data) =>
  api.post(`/watchlist/continue-watching/${contentId}`, data);
