const express = require("express");
const cors = require("cors");
const itemsRouter = require("./routes/items");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/items", itemsRouter);

app.use(errorHandler);

module.exports = app;
