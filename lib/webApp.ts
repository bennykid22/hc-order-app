import { WEBAPP_URL } from "./config";
import { toDateKey } from "./dates";

function buildUrl(params: Record<string, string | number>): string {
  const query = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return `${WEBAPP_URL}?${query}`;
}

export interface DuplicateResult {
  isDuplicate: boolean;
  timestamp?: string;
  items?: string;
}

/**
 * Checks if an order already exists for this shop + delivery date
 */
export async function checkDuplicate(
  shopName: string,
  deliveryDate: Date
): Promise<DuplicateResult> {
  try {
    const url = buildUrl({
      action: "checkDuplicate",
      shop: shopName,
      date: toDateKey(deliveryDate),
    });
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== "ok") return { isDuplicate: false };
    return {
      isDuplicate: data.duplicate,
      timestamp: data.timestamp,
      items: data.items,
    };
  } catch {
    // Fail open — don't block order if Web App is unreachable
    return { isDuplicate: false };
  }
}

export interface LogOrderParams {
  shopName: string;
  deliveryDate: Date;
  dateStr: string;
  items: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

/**
 * Logs a confirmed order to the Orders Log via the Web App
 */
export async function logOrder(params: LogOrderParams): Promise<void> {
  try {
    const url = buildUrl({
      action: "logOrder",
      shop: params.shopName,
      date: toDateKey(params.deliveryDate),
      dateStr: params.dateStr,
      items: params.items,
      subtotal: params.subtotal,
      delivery: params.deliveryFee,
      total: params.total,
    });
    await fetch(url);
  } catch {
    // Silently fail — email already sent so order isn't lost
  }
}
