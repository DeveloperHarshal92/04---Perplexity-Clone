import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.DEV
    ? "http://localhost:3000"
    : typeof window !== "undefined"
      ? window.location.origin
      : "https://perplexus.onrender.com");

export const initializeSocketConnection = () => {
  const socket = io(SOCKET_URL, {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });
};
