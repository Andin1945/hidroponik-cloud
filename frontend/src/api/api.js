import axios from "axios";

export const authAPI = axios.create({
  baseURL: "https://auth-service-bkozr376xq-et.a.run.app/api/auth",
});

export const monitoringAPI = axios.create({
  baseURL: "https://monitoring-service-239722545710.asia-southeast2.run.app/api",
});

authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

monitoringAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});