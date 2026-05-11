import { Tenant, Building, Asset, AssetEvent } from "../models";

export const tenants: Tenant[] = [
  { id: "tenant-1", name: "Acme Corp" },
  { id: "tenant-2", name: "Globex Inc" },
];

export const buildings: Building[] = [
  {
    id: "building-1",
    tenantId: "tenant-1",
    name: "HQ Tower",
    address: "123 Main St",
  },
  {
    id: "building-2",
    tenantId: "tenant-1",
    name: "West Wing",
    address: "456 West Ave",
  },
  {
    id: "building-3",
    tenantId: "tenant-2",
    name: "Globex HQ",
    address: "789 Corp Blvd",
  },
];

export const assets: Asset[] = [
  {
    id: "asset-1",
    buildingId: "building-1",
    name: "HVAC Unit A",
    type: "HVAC",
    status: "ok",
  },
  {
    id: "asset-2",
    buildingId: "building-1",
    name: "Elevator 1",
    type: "elevator",
    status: "ok",
  },
  {
    id: "asset-3",
    buildingId: "building-2",
    name: "Sensor B",
    type: "sensor",
    status: "ok",
  },
  {
    id: "asset-4",
    buildingId: "building-3",
    name: "HVAC Unit X",
    type: "HVAC",
    status: "ok",
  },
];

export const events: AssetEvent[] = [];
