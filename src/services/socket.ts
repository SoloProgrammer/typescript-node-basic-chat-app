import { Server } from "socket.io";
import { ServerType, userType } from "../types/types.js";

export function connectToSocket(server: ServerType) {
  const io = new Server(server);

  var activeUsers: userType[] = [];

  io.on("connection", (socket) => {
    console.log(`new client is connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`client with socket id disconneted: ${socket.id}`);
      io.emit(
        "active-users",
        activeUsers.filter((u) => u.socketId !== socket.id)
      );
    });

    socket.on("setup", (user: userType) => {
      user.socketId = socket.id;
      !activeUsers.some((u) => u.id === user?.id) && activeUsers.push(user);
      io.emit("active-users", activeUsers);
    });

    socket.on("new-message", (message, user) => {
      message = { message, user };
      io.emit("new-message", message);
    });

    socket.on("typing", (user) => {
      io.emit("typing", user);
    });

    socket.on("stop-typing", (user) => {
      io.emit("stop-typing", user);
    });
  });
}
