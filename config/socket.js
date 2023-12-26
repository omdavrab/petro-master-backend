const socketIO = require("socket.io");
const Notification = require("../app/models/notification");

const connectedUsers = {}; // Object to keep track of connected sockets for each user

const configureSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*", // Replace "*" with your frontend URL or specific allowed origins
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // console.log("A user connected");

    // Event to associate a user with a socket
    socket.on("join", (userId) => {
      connectedUsers[userId] = socket;
      console.log(`User ${userId} connected`);
    });

    socket.on("disconnect", () => {
      // Remove the user's socket on disconnect
      const userId = Object.keys(connectedUsers).find(
        (key) => connectedUsers[key] === socket
      );
      if (userId) {
        delete connectedUsers[userId];
        console.log(`User ${userId} disconnected`);
      }
    });

    // Listen for new notifications for a specific user
    socket.on("newNotification", async ({ userId, recipientId, notification }) => {
      console.log(`Received new notification from user ${userId} for user ${recipientId}:`, notification);
      const recipientSocket = connectedUsers[recipientId];
      if (recipientSocket) {
        recipientSocket.emit("notification", notification);
      } else {
        console.log(`User ${recipientId} not connected`);
      }
    });
  });
};

module.exports = configureSocket;
