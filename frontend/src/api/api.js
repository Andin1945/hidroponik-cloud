import axios from "axios";

export const authAPI = axios.create({
  baseURL: "https://auth-service-bkozr376xq-et.a.run.app/api/auth",
});

export const monitoringAPI = axios.create({
  baseURL: "ISI_URL_MONITORING_SERVICE_KAMU/api",
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