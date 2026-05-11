import { Router, Response } from "express";
import { TenantRequest } from "../middleware/tenant";
import { buildings, assets } from "../store";

const router = Router();

// GET /api/buildings — returns buildings for the authenticated tenant
router.get("/", (req, res: Response) => {
  const { tenantId } = req as unknown as TenantRequest;
  const result = buildings.filter((b) => b.tenantId === tenantId);
  res.json({ data: result });
});

// GET /api/buildings/:id/assets — returns assets for a building (optional)
router.get("/:id/assets", (req, res: Response) => {
  const { tenantId } = req as unknown as TenantRequest;
  const building = buildings.find((b) => b.id === req.params.id);

  if (!building) {
    res.status(404).json({ error: "Building not found" });
    return;
  }

  if (building.tenantId !== tenantId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const result = assets.filter((a) => a.buildingId === building.id);
  res.json({ data: result });
});

export default router;
