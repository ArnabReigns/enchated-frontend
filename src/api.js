import axios from "axios";

const api = axios.create({
  baseURL: "enchated-v2-backend",
});

export default api;
