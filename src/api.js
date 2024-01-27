import axios from "axios";

console.log(import.meta.env.VITE_BACKEND_URL);
const api = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://" + import.meta.env.VITE_BACKEND_URL
    : "http://" + import.meta.env.VITE_BACKEND_URL,
});

export default api;
