import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:5000/api"
});

// Interceptor to attach Token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError = !error.response;
    
    if (isNetworkError) {
      toast.error("Network error. Please check your internet connection.");
    } else if (error.response?.status >= 500) {
      toast.error("Server is currently under maintenance. Please try again later.");
    } else if (error.response?.status === 401) {
      toast.warn("Session expired. Please login again.");
      localStorage.removeItem("token");
      // Optional: window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// -------------------- PROFILE APIs --------------------
export const getProfile = () => API.get("/profile").then(res => res.data);
export const updateProfile = (data) => API.put("/profile", data).then(res => res.data);

// -------------------- REVIEW APIs --------------------

// Public: Get approved reviews for a specific tour
export const getTourReviews = (tourId) => API.get(`/reviews/${tourId}`).then(res => res.data);

// Customer: Submit a new review
export const submitReview = (reviewData) => API.post("/reviews", reviewData).then(res => res.data);

// Admin: Get all reviews (including pending)
export const getAllReviewsAdmin = () => API.get("/admin/reviews").then(res => res.data);

// Admin: Approve/Hide a review
export const updateReviewStatus = (reviewId, status) => 
  API.put(`/admin/reviews/${reviewId}/approve`, { status }).then(res => res.data);

export default API;