import axios from "axios";

const api = axios.create({
  baseURL: "https://" + import.meta.env.VITE_BACKEND_URL,
});

export default api;
