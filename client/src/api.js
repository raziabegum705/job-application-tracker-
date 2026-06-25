
import axios from "axios";
 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
 
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("jobTrackerUser");
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed?.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});
 
export default api;
 