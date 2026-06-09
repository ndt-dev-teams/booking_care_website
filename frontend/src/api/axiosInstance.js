import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },

  // MOCK INTERCEPTOR
  adapter: (config) => {
    console.log("[MOCK API] Đã chặn request:", config.method.toUpperCase(), config.url);
    return Promise.resolve({
      data: { content: [], data: [], items: [] }, 
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      request: {}
    });
  }
});

export default axiosInstance;
