import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import { buildings } from "./store";

let io: SocketServer;

export function initSocket(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket: Socket) => {
    const tenantId = socket.handshake.query.tenantId as string;

    if (!tenantId) {
      socket.disconnect();
      return;
    }

    socket.on("subscribe", (buildingId: string) => {
      const building = buildings.find((b) => b.id === buildingId);

      if (!building || building.tenantId !== tenantId) {
        socket.emit(
          "error",
          "Forbidden: building does not belong to your tenant",
        );
        return;
      }

      socket.join(buildingId);
      socket.emit("subscribed", { buildingId });
      console.log(`Socket ${socket.id} subscribed to building ${buildingId}`);
    });
  });

  return io;
}

export function emitEvent(buildingId: string, event: object): void {
  if (io) {
    io.to(buildingId).emit("asset:event", event);
  }
}
