import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.PROD ? "wss://"+import.meta.env.VITE_BACKEND_URL : "ws://"+import.meta.env.VITE_BACKEND_URL;

export const socket = io(URL);
