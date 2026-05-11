import { useEffect, useState } from "react";
import { io } from "socket.io-client";
// import { getItems } from "../api/items";

const BUILDING_ID = "building-1";
const TENANT_ID = "tenant-1";
const API_BASE = "http://localhost:4000/api";

const socket = io("http://localhost:4000", {
  query: { tenantId: TENANT_ID },
});

export default function AssetDashboard() {
  const [assets, setAssets] = useState([]);
  const [lastEvents, setLastEvents] = useState({});

  useEffect(() => {
    // Fetch initial assets
    fetch(`${API_BASE}/buildings/${BUILDING_ID}/assets`, {
      headers: { "x-tenant-id": TENANT_ID },
    })
      .then((r) => r.json())
      .then((res) => setAssets(res.data));

    // Subscribe to building via WebSocket
    socket.emit("subscribe", BUILDING_ID);

    socket.on("asset:event", ({ event, asset }) => {
      // Update asset status in real-time
      setAssets((prev) =>
        prev.map((a) =>
          a.id === asset.id ? { ...a, status: asset.status } : a,
        ),
      );
      // Track last event per asset
      setLastEvents((prev) => ({ ...prev, [event.assetId]: event.timestamp }));
    });

    return () => {
      socket.off("asset:event");
    };
  }, []);

  const statusColor = (status) => {
    if (status === "critical") return "red";
    if (status === "warning") return "orange";
    return "green";
  };

  return (
    <div>
      <h1>AssetPulse — Building Dashboard</h1>
      <p>
        Building: <strong>{BUILDING_ID}</strong> | Tenant:{" "}
        <strong>{TENANT_ID}</strong>
      </p>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Type</th>
            <th>Status</th>
            <th>Last Event</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.name}</td>
              <td>{asset.type}</td>
              <td style={{ color: statusColor(asset.status) }}>
                {asset.status.toUpperCase()}
              </td>
              <td>
                {lastEvents[asset.id]
                  ? new Date(lastEvents[asset.id]).toLocaleTimeString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
