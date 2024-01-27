import axios from "axios";

const api = axios.create({
  baseURL: "https://enchated-v2-backend-production.up.railway.app",
});

export default api;
