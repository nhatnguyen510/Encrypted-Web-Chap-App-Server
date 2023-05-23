import { Server } from "socket.io";
import User from "../models/UserModel.js";
import { getUserFriendIds } from "../controllers/userController.js";

const OnlineUsers = new Map();

const socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const userId = socket.handshake.auth.userId;

    const isUserIdExist = await User.findById(userId);

    if (!isUserIdExist) {
      return next(new Error("Invalid user"));
    }

    socket.userId = userId;
    next();
  });

  // On connection
  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.userId}`);

    OnlineUsers.set(socket.userId, socket.id);

    const friends = await getUserFriendIds(socket.userId);

    const friendsOnline = friends.filter((friendId) =>
      OnlineUsers.has(friendId)
    );

    io.to(socket.id).emit("friendsOnline", friendsOnline);

    //notify friends
    const notifyFriends = async (userId, event, status) => {
      friendsOnline.forEach((friendOnlineId) => {
        io.to(OnlineUsers.get(friendOnlineId)).emit(event, {
          userId,
          status,
        });
      });
    };

    await notifyFriends(socket.userId, "userOnline", "Online");

    // On send message
    socket.on("sendMessage", (data) => {
      const receiverSocketId = OnlineUsers.get(data.receiver_id);

      if (receiverSocketId) {
        io.to(`${receiverSocketId}`).emit("receiveMessage", {
          conversation_id: data.conversation_id,
          senderId: data.sender_id,
          message: data.message,
        });
      }
    });

    // On disconnection
    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${socket.userId}`);
      OnlineUsers.delete(socket.userId);
      await notifyFriends(socket.userId, "userOffline", "Offline");
    });
  });

  return io;
};

export default socket;
