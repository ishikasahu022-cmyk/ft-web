import axios from "axios";

// Create instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
 const token = localStorage.getItem("token");
// 🔐 REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
   

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ⚠️ RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    // Example: auto logout on 401
    if (error.response?.status === 401 && token) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error.response);
  }
);

export default axiosInstance;