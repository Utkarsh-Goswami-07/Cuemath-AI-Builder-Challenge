import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
    timeout: 120000,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
    (r) => r.data,
    (err) => { throw new Error(err.response?.data?.error || err.message || "Something went wrong"); }
);

export const generateCreative = (data) => api.post("/generate/creative", data);
export const regenerateSlide = (data) => api.post("/generate/slide", data);
export const generateCaption = (data) => api.post("/generate/caption", data);
export const getHistory = () => api.get("/generate/history");
export const getCreative = (id) => api.get(`/generate/creative/${id}`);
export const updateCreative = (id, creative) => api.put(`/generate/creative/${id}`, { creative });
export const deleteCreative = (id) => api.delete(`/generate/creative/${id}`);
export const generateImage = (data) => api.post("/images/generate", data);
export const checkHealth = () => api.get("/health");

export default api;