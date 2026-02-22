import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:5000/api"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Check if it's a true Server Down/Network error (no response from server)
    const isNetworkError = !error.response;
    // 2. Check if it's a 500 error on a CRITICAL path (you can add more here)
    const isCriticalPath = error.config.url.includes("/tours");

    if (isNetworkError || (error.response.status >= 500 && isCriticalPath)) {
      if (window.location.pathname !== "/maintenance") {
        window.location.href = "/maintenance";
      }
    }

    // For non-critical errors (401, 404, or non-critical 500s), 
    // just reject so the specific component can show a message
    return Promise.reject(error);
  }
);
// Get profile
export const getProfile = async () => {
  const res = await API.get("/profile");
  return res.data;
};

// Update profile
export const updateProfile = async (data) => {
  const res = await API.put("/profile", data);
  return res.data;
};

export default API;