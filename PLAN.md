# AssetPulse — Implementation Plan

## Overview

Backend-heavy fullstack assessment. **Steps 1–3 are required. Steps 4–5 are stretch goals.**
TypeScript throughout. Express + in-memory storage. No database required.

---

## Project Structure (target)

```
assetpulse/
  src/
    models/          # TypeScript interfaces (domain model)
    store/           # In-memory storage (arrays/maps)
    services/        # Business logic (named functions)
    routes/          # Express route handlers (controllers)
    middleware/      # Tenant context extraction, error handler
  index.ts           # Entry point
  package.json
  tsconfig.json
  README.md
```

---

## Step 1 — Data Model & Project Setup (0–15 min)

### 1.1 Init project

```bash
mkdir assetpulse && cd assetpulse
yarn init -y
yarn add express
yarn add -D typescript ts-node @types/node @types/express nodemon
npx tsc --init
```

### 1.2 Create `src/models/index.ts`

Define these TypeScript interfaces:

```ts
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
  type: 'HVAC' | 'elevator' | 'sensor' | string;
  status: 'ok' | 'warning' | 'critical';
}

export type EventType = 'temperature' | 'error' | 'operational';

export interface AssetEvent {
  id: string;
  assetId: string;
  type: EventType;
  payload: Record<string, unknown>;
  timestamp: Date;
}
```

> **Design decision to explain:** Tenant isolation is enforced at the query level — every read filters by `tenantId`. Building owns `tenantId`; Asset owns `buildingId`. To get assets for a tenant you always join through Buildings.

### 1.3 Create `src/store/index.ts`

Seed data with 2 tenants, 2 buildings each, 2 assets per building, empty events array.

---

## Step 2 — REST API (15–35 min)

### 2.1 Tenant context middleware — `src/middleware/tenant.ts`

Read `x-tenant-id` header from the request and attach it to `req.tenantId`.
Return `400` if missing.

```ts
// req.tenantId is set here — no real auth needed
```

> **Design decision to explain:** Using a request header (`x-tenant-id`) simulates what a JWT claim would provide in production. In a real system this would come from a verified token, not a plain header.

### 2.2 `GET /api/buildings`

- Filter in-memory buildings where `building.tenantId === req.tenantId`
- Return `{ data: Building[] }`

### 2.3 `POST /api/assets/:id/events`

- Find the asset by `:id`
- Find the building for that asset
- Verify `building.tenantId === req.tenantId` → `403` if not
- Validate body: `type` (required), `payload` (required object)
- Create and store the `AssetEvent`
- **Call the business logic rule (Step 3)**
- Return `201` with the created event

### 2.4 (Optional) `GET /api/buildings/:id/assets`

- Find building by `:id`
- Verify `building.tenantId === req.tenantId` → `403` if not
- Return assets where `asset.buildingId === building.id`

---

## Step 3 — Business Logic (35–55 min)

### Rule: `checkCriticalThreshold(assetId)` in `src/services/assetService.ts`

```ts
export function checkCriticalThreshold(assetId: string): void
```

Logic:
1. Get all events for `assetId` where `type === 'error'`
2. Filter to events within the last 10 minutes (`timestamp >= now - 10min`)
3. If count >= 3:
   - Set `asset.status = 'critical'` in the store
   - `console.warn(`[CRITICAL] Asset ${assetId} has ${count} errors in the last 10 minutes`)`

Call this function inside the `POST /api/assets/:id/events` handler, after saving the event.

> **Key point:** Logic lives in the service layer, not in the route handler. Route just calls the service.

---

## Step 4 — Real-Time Layer (stretch, 55–75 min)

### Add `socket.io` or `ws`

```bash
yarn add socket.io
yarn add -D @types/socket.io
```

- On connect, client sends `{ action: 'subscribe', buildingId }`
- Server validates that `buildingId` belongs to the client's tenant (pass `tenantId` on handshake via query param or header)
- Store a map: `buildingId → Set<Socket>`
- In `POST /api/assets/:id/events`, after saving, emit the event to all sockets subscribed to that building

---

## Step 5 — Minimal React View (stretch, 75–90 min)

### `AssetDashboard` component in the `app/` Vite project

- Hardcode `buildingId = 'building-1'`
- On mount: `GET /api/buildings/building-1/assets`
- Poll every 10 seconds with `setInterval`
- Display a table: Asset name | Status | Last event timestamp
- If Step 4 is done: connect via socket instead of polling

---

## Consistent Response Shape

Always return:

```ts
// Success
{ data: T }

// Error
{ error: string }
```

Use HTTP status codes correctly:
- `200` OK, `201` Created, `400` Bad Request, `403` Forbidden, `404` Not Found, `500` Internal Server Error

---

## README Checklist (required in final ZIP)

- [ ] How to run: `yarn dev` or `ts-node src/index.ts`
- [ ] What was completed and what was skipped
- [ ] Design decision: tenant isolation via header + query-level filtering
- [ ] One thing to do differently: add Prisma + PostgreSQL with row-level security for real tenant isolation

---

## Delivery

```bash
# zip from parent directory
zip -r assetpulse.zip assetpulse/ --exclude "*/node_modules/*"
```

Send to: `i.pukhov@velvetech.dev`
