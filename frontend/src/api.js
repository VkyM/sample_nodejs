import axios from "axios";

// Use a plain constant instead of process.env
const API_BASE_URL = "http://localhost:4000"; // backend exposed from Docker to host

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

