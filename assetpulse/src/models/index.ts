export interface Tenant {
  id: string;
  name: string;
}

export interface Building {
  id: string;
  tenantId: string;
  name: string;
  address: string;
}

export interface Asset {
  id: string;
  buildingId: string;
  name: string;
  type: "HVAC" | "elevator" | "sensor";
  status: "ok" | "warning" | "critical";
}

export type EventType = "temperature" | "error" | "operational";

export interface AssetEvent {
  id: string;
  assetId: string;
  type: EventType;
  payload: Record<string, unknown>;
  timestamp: Date;
}
