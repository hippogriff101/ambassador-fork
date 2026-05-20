import type { ShirtStockBySize } from "@/lib/shop";

export type CachedWarehouseStats = {
  expenditure: {
    contents: number;
    labor: number;
    postage: number;
    total: number;
  };
  sentOrders: number;
  stockBySize: ShirtStockBySize;
};

let cached: { data: CachedWarehouseStats; expiresAt: number } | null = null;

export function getCachedWarehouseStats() {
  if (cached === null || Date.now() >= cached.expiresAt) {
    return null;
  }

  return cached.data;
}

export function setCachedWarehouseStats(data: CachedWarehouseStats, ttlMs = 5 * 60 * 1000) {
  cached = {
    data,
    expiresAt: Date.now() + ttlMs,
  };
}

export function clearCachedWarehouseStats() {
  cached = null;
}
