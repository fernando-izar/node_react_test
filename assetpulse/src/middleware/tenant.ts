import { Request, Response, NextFunction } from "express";

export interface TenantRequest extends Request {
  tenantId: string;
}

export function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const tenantId = req.headers["x-tenant-id"];

  if (!tenantId || typeof tenantId !== "string") {
    res.status(400).json({ error: "Missing x-tenant-id header" });
    return;
  }

  (req as TenantRequest).tenantId = tenantId;
  next();
}
