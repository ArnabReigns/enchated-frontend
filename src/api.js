import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://"
    : "http://" + import.meta.env.VITE_BACKEND_URL,
});

export default api;
