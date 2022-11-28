import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    timeout: 1000,
    //  Authorization: `<Your Auth Token>`,
  },
  // .. other options
});

instance.interceptors.request.use(function (config) {
  const token = sessionStorage.getItem("adminData" || "userData");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export default instance;
