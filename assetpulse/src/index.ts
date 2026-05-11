import http from "http";
import app from "./app";
import { initSocket } from "./socket";

const PORT = process.env.PORT || 4000;

const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`AssetPulse API running on http://localhost:${PORT}`);
});
