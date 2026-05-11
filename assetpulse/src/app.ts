import express from "express";
import { tenantMiddleware } from "./middleware/tenant";
import { errorHandler } from "./middleware/errorHandler";
import buildingsRouter from "./routes/buildings";
import assetsRouter from "./routes/assets";

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/buildings", tenantMiddleware, buildingsRouter);
app.use("/api/assets", tenantMiddleware, assetsRouter);

app.use(errorHandler);

export default app;
