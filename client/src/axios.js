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
  const adminToken = sessionStorage.getItem("adminData");
  const userToken = sessionStorage.getItem("userData");
  config.headers.Authorization = adminToken
    ? `Bearer ${adminToken}`
    : userToken
    ? `Bearer ${userToken}`
    : "";
  return config;
});

export default instance;
