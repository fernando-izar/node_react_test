# AssetPulse — Technical Assessment

Fullstack Engineer assessment — Node.js + React (Backend-Heavy)

---

## How to Run

### API (Node.js + Express)

```bash
cd assetpulse
yarn install
yarn dev
```

API runs on `http://localhost:4000`

### Frontend (React + Vite) — optional, Step 5

```bash
cd app
yarn install
yarn dev
```

Dashboard at `http://localhost:5173/dashboard`

---

## What Was Completed

| Step | Item | Status |
|------|------|--------|
| Step 1 | Data model — TypeScript interfaces (Tenant, Building, Asset, AssetEvent) | Done |
| Step 1 | In-memory seed data (2 tenants, 3 buildings, 4 assets) | Done |
| Step 2 | Tenant context via `x-tenant-id` header middleware | Done |
| Step 2 | `GET /api/buildings` — tenant-scoped | Done |
| Step 2 | `POST /api/assets/:id/events` — with tenant ownership check | Done |
| Step 2 | `GET /api/buildings/:id/assets` — optional endpoint | Done |
| Step 3 | `checkCriticalThreshold()` — business rule in service layer | Done |
| Step 4 | WebSocket via socket.io — tenant-safe building subscriptions | Done |
| Step 5 | React dashboard — real-time asset status via WebSocket | Done |

## What Was Skipped

- **Real database** — in-memory storage was used as allowed by the spec
- **Authentication** — tenant context is simulated via a plain header, not a real JWT
- **Automated tests** — no unit or integration tests written during the session

---

## Key Design Decisions

### 1. Tenant isolation via request header

Tenant context is extracted from the `x-tenant-id` header in a dedicated middleware (`src/middleware/tenant.ts`). Every route that reads or writes data receives the `tenantId` from this middleware and filters all queries by it.

In production this would come from a verified JWT claim — the header approach simulates that without requiring an auth stack, as the spec allows.

### 2. Tenant isolation at the query level

Every read operation filters by `tenantId` explicitly:

- `GET /buildings` → `buildings.filter(b => b.tenantId === tenantId)`
- `POST /assets/:id/events` → resolves asset → resolves building → checks `building.tenantId === tenantId` before writing

This means tenant A can never read or write data belonging to tenant B, even if they guess a valid ID.

### 3. Business logic in a named service function

The critical threshold rule (`checkCriticalThreshold`) lives in `src/services/assetService.ts`, not inline in the route handler. This keeps the controller thin and makes the business rule independently testable.

### 4. WebSocket tenant isolation

Clients pass `tenantId` as a socket handshake query param. On `subscribe(buildingId)`, the server verifies that the building belongs to that tenant before joining the socket to the room. Events are only emitted to the room matching the asset's building.

---

## One Thing I Would Do Differently With More Time

Replace in-memory storage with **PostgreSQL + Prisma**. The current store is a plain array — it resets on every restart and doesn't scale. With Prisma, tenant isolation would be enforced at the query level using a `where: { tenantId }` clause on every query, and a composite index on `(tenantId, id)` would make tenant-scoped lookups efficient. Row-level security in PostgreSQL could add a second layer of isolation as a safety net.

---

## API Reference

All endpoints require the `x-tenant-id` header.

```
GET  /api/health
GET  /api/buildings
GET  /api/buildings/:id/assets
POST /api/assets/:id/events
```

### POST /api/assets/:id/events — request body

```json
{
  "type": "error" | "temperature" | "operational",
  "payload": { "code": "E001" }
}
```

### WebSocket

Connect with `tenantId` as query param:

```js
const socket = io('http://localhost:4000', { query: { tenantId: 'tenant-1' } });
socket.emit('subscribe', 'building-1');
socket.on('asset:event', (data) => console.log(data));
```

---

## AI Usage

Claude (claude.ai/code) was used as a coding assistant throughout the session — for scaffolding boilerplate, generating TypeScript interfaces, and suggesting middleware patterns. All business logic decisions (tenant isolation strategy, service layer separation, critical threshold rule) were reviewed and validated manually. The final implementation was typed and tested by the candidate during the live session.
