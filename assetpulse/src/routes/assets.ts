import { Router, Response } from "express";
import { TenantRequest } from "../middleware/tenant";
import { assets, buildings } from "../store";
import { ingestEvent } from "../services/assetService";
import { EventType } from "../models";

const router = Router();

// POST /api/assets/:id/events — ingest a new status event for an asset
router.post("/:id/events", (req, res: Response) => {
  const { tenantId } = req as unknown as TenantRequest;
  const asset = assets.find((a) => a.id === req.params.id);

  if (!asset) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }

  const building = buildings.find((b) => b.id === asset.buildingId);

  if (!building || building.tenantId !== tenantId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const { type, payload } = req.body;

  if (!type || !["temperature", "error", "operational"].includes(type)) {
    res.status(400).json({ error: "Invalid or missing event type" });
    return;
  }

  if (!payload || typeof payload !== "object") {
    res.status(400).json({ error: "payload must be an object" });
    return;
  }

  const event = ingestEvent(asset.id, type as EventType, payload);
  res.status(201).json({ data: event });
});

export default router;
