import { assets, events } from "../store";
import { EventType, AssetEvent } from "../models";

export function ingestEvent(
  assetId: string,
  type: EventType,
  payload: Record<string, unknown>,
): AssetEvent {
  const event: AssetEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    assetId,
    type,
    payload,
    timestamp: new Date(),
  };

  events.push(event);
  checkCriticalThreshold(assetId);

  return event;
}

export function checkCriticalThreshold(assetId: string): void {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const recentErrors = events.filter(
    (e) =>
      e.assetId === assetId &&
      e.type === "error" &&
      e.timestamp >= tenMinutesAgo,
  );

  if (recentErrors.length >= 3) {
    const asset = assets.find((a) => a.id === assetId);
    if (asset) {
      asset.status = "critical";
      console.warn(
        `[CRITICAL] Asset ${assetId} has ${recentErrors.length} errors in the last 10 minutes`,
      );
    }
  }
}
