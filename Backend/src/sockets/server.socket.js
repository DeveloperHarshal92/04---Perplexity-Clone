import { Server } from "socket.io";

let io;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://perplexus.onrender.com",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  console.log("Socket.io server is running...")

  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);
  });
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
