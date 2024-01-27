import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = "wss://enchated-v2-backend-production.up.railway.app";

export const socket = io(URL);
