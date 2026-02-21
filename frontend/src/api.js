// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
