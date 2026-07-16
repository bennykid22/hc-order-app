import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { BEN_EMAIL } from "../../lib/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    shopName,
    dateStr,
    notes,
    lines,
    subtotal,
    discount,
    deliveryFee,
    total,
    totalUnits,
  } = req.body;

  if (!shopName || !dateStr || !lines) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const itemLines = lines
    .map(
      (l: { name: string; qty: number; price: number; lineTotal: string }) =>
        `  • ${l.name}  ×${l.qty}  ($${l.price.toFixed(2)} each)  =  $${l.lineTotal}`
    )
    .join("\n");

  const body = [
    "Hi Ben,",
    "",
    `New wholesale order from ${shopName}.`,
    "",
    `Requested delivery: ${dateStr}`,
    notes ? `Notes: ${notes}` : null,
    "",
    "─────────────────────────────",
    itemLines,
    "─────────────────────────────",
    "",
    `Subtotal:    $${Number(subtotal).toFixed(2)}`,
    discount < 0
      ? `Discount:    -$${Math.abs(Number(discount)).toFixed(2)}  (10% volume discount — ${totalUnits} units)`
      : null,
    `Delivery:    ${Number(deliveryFee) > 0 ? "$" + Number(deliveryFee).toFixed(2) : "Free"}`,
    "",
    `ORDER TOTAL: $${Number(total).toFixed(2)} inc. GST`,
    "",
    "—",
    shopName,
  ]
    .filter((l) => l !== null)
    .join("\n");

  try {
    await resend.emails.send({
      from: "HC Wholesale <orders@homecroissanterie.com.au>",
      to: BEN_EMAIL,
      subject: `Wholesale order — ${shopName} — ${dateStr}`,
      text: body,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
