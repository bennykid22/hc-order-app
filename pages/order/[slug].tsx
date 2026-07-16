import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useState, useCallback, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";

import {
  MENU_ITEMS,
  CUSTOMERS,
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  VOLUME_DISCOUNT_THRESHOLD,
  VOLUME_DISCOUNT_RATE,
} from "../../lib/config";
import {
  getEarliestDeliveryDate,
  getDisabledDays,
  getEarliestLabel,
  isValidDeliveryDate,
  toDateStr,
} from "../../lib/dates";
import { checkDuplicate, logOrder } from "../../lib/webApp";
import styles from "./[slug].module.css";

interface Props {
  slug: string;
  shopName: string;
}

type Step = "form" | "confirm" | "submitting" | "success";

interface OrderLine {
  name: string;
  qty: number;
  price: number;
  lineTotal: string;
}

export default function OrderPage({ slug, shopName }: Props) {
  const [qtys, setQtys] = useState<number[]>(MENU_ITEMS.map(() => 0));
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [submitting, setSubmitting] = useState(false);
  const [earliestLabel, setEarliestLabel] = useState("");
  const [dupInfo, setDupInfo] = useState<{ timestamp: string; items: string } | null>(null);

  useEffect(() => {
    const update = () => setEarliestLabel(getEarliestLabel());
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  // ── Calculations ───────────────────────────────────────────────────────────
  const totalUnits = qtys.reduce((s, q) => s + q, 0);
  const subtotal = MENU_ITEMS.reduce((s, item, i) => s + item.price * qtys[i], 0);
  const discountRate = totalUnits >= VOLUME_DISCOUNT_THRESHOLD ? VOLUME_DISCOUNT_RATE : 0;
  const discountAmount = subtotal * discountRate;
  const delivery = subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
  const total = subtotal - discountAmount + delivery;
  const progressPct = Math.min(100, (totalUnits / VOLUME_DISCOUNT_THRESHOLD) * 100);

  const orderedLines: OrderLine[] = MENU_ITEMS
    .map((item, i) => ({
      name: item.name,
      qty: qtys[i],
      price: item.price,
      lineTotal: (item.price * qtys[i]).toFixed(2),
    }))
    .filter((l) => l.qty > 0);

  // ── Qty controls ───────────────────────────────────────────────────────────
  const changeQty = useCallback((index: number, delta: number) => {
    setQtys((prev) => {
      const next = [...prev];
      next[index] = Math.max(0, next[index] + delta);
      return next;
    });
  }, []);

  // ── Date hint ──────────────────────────────────────────────────────────────
  const dateHint = () => {
    if (!deliveryDate) return { text: `Earliest available: ${earliestLabel}`, type: "neutral" };
    if (!isValidDeliveryDate(deliveryDate))
      return { text: `Too soon — earliest available is ${earliestLabel}`, type: "invalid" };
    return { text: "✓ Valid delivery date", type: "valid" };
  };
  const hint = dateHint();

  const canSubmit =
    totalUnits > 0 &&
    deliveryDate !== undefined &&
    isValidDeliveryDate(deliveryDate);

  // ── Submit click ───────────────────────────────────────────────────────────
  const handleSubmitClick = async () => {
    if (!canSubmit || !deliveryDate) return;
    const dup = await checkDuplicate(shopName, deliveryDate);
    setDupInfo(dup.isDuplicate && dup.timestamp ? { timestamp: dup.timestamp, items: dup.items ?? "" } : null);
    setStep("confirm");
  };

  // ── Confirm ────────────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!deliveryDate) return;
    setSubmitting(true);
    const dateStr = toDateStr(deliveryDate);
    const itemSummary = orderedLines.map((l) => `${l.name} ×${l.qty}`).join(", ");

    try {
      await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopName, dateStr, notes, lines: orderedLines,
          subtotal, discount: -discountAmount,
          deliveryFee: delivery, total, totalUnits,
        }),
      });

      await logOrder({
        shopName, deliveryDate, dateStr,
        items: itemSummary, subtotal,
        deliveryFee: delivery, total,
      });

      setStep("success");
    } catch {
      alert("Something went wrong. Please email ben@homecroissanterie.com.au directly.");
      setStep("form");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success ────────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <>
        <Head><title>Order Placed — Home Croissanterie</title></Head>
        <div className={styles.page}>
          <div className={styles.successCard}>
            <div className={styles.header}>
              <div className={styles.logo}>Home Croissanterie</div>
              <div className={styles.headerSub}>Wholesale</div>
            </div>
            <div className={styles.tanBar} />
            <div className={styles.successIcon}>🥐</div>
            <div className={styles.successTitle}>Order placed!</div>
            <p className={styles.successMsg}>
              Your order has been sent to Home Croissanterie.
              Ben will be in touch to confirm your delivery.
            </p>
            <p className={styles.successContact}>ben@homecroissanterie.com.au</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Order — {shopName} — Home Croissanterie</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo}>Home Croissanterie</div>
            <div className={styles.headerSub}>Wholesale Order Form</div>
          </div>
          <div className={styles.tanBar} />

          <div className={styles.body}>
            {/* Shop */}
            <p className={styles.sectionLabel}>Ordering for</p>
            <div className={styles.shopName}>{shopName}</div>

            {/* Date */}
            <p className={styles.sectionLabel} style={{ marginTop: 20 }}>Requested delivery date</p>
            <div className={styles.dateField}>
              <button
                className={`${styles.dateButton} ${deliveryDate ? styles.hasDate : ""}`}
                onClick={() => setShowCalendar((v) => !v)}
              >
                <span>{deliveryDate ? format(deliveryDate, "EEEE d MMMM yyyy") : "Select a date"}</span>
                <span style={{ opacity: 0.4, fontSize: 12 }}>{showCalendar ? "▲" : "▼"}</span>
              </button>

              {showCalendar && (
                <div className={styles.calendarWrapper}>
                  <DayPicker
                    mode="single"
                    selected={deliveryDate}
                    onSelect={(date) => { setDeliveryDate(date); setShowCalendar(false); }}
                    disabled={getDisabledDays()}
                    startMonth={getEarliestDeliveryDate()}
                    showOutsideDays={false}
                    modifiersStyles={{
                      selected: { backgroundColor: "var(--tan)", color: "var(--white)" },
                      today: { color: "var(--tan)", fontWeight: 700 },
                    }}
                  />
                </div>
              )}

              <p className={`${styles.dateHint} ${styles[hint.type as keyof typeof styles]}`}>
                {hint.text}
              </p>
            </div>

            {/* Items */}
            <p className={styles.sectionLabel} style={{ marginTop: 20 }}>Select items</p>
            <div className={styles.itemsGrid}>
              {MENU_ITEMS.map((item, i) => (
                <div key={item.name} className={styles.itemRow}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemDesc}>{item.description}</div>
                  </div>
                  <div className={styles.itemPrice}>${item.price.toFixed(2)}</div>
                  <div className={styles.qtyControl}>
                    <button className={styles.qtyBtn} onClick={() => changeQty(i, -1)} aria-label={`Decrease ${item.name}`}>−</button>
                    <span className={styles.qtyNum}>{qtys[i]}</span>
                    <button className={styles.qtyBtn} onClick={() => changeQty(i, 1)} aria-label={`Increase ${item.name}`}>+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <p className={styles.sectionLabel} style={{ marginTop: 20 }}>Notes / special requests</p>
            <textarea
              className={styles.notesInput}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes for this order..."
              rows={3}
            />

            {/* Summary */}
            <div className={styles.summary}>
              {discountRate === 0 && totalUnits > 0 && (
                <div className={styles.progressWrap}>
                  <div className={styles.progressLabel}>
                    <span>{totalUnits} of {VOLUME_DISCOUNT_THRESHOLD} units for 10% off</span>
                    <span>{VOLUME_DISCOUNT_THRESHOLD - totalUnits} more to go</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
                  </div>
                </div>
              )}

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>${subtotal.toFixed(2)}</span>
              </div>

              {discountRate > 0 && (
                <div className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
                  <span className={styles.summaryLabel}>
                    <span className={styles.discountBadge}>10% off · {totalUnits} units</span>
                  </span>
                  <span className={styles.summaryValue}>−${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>
                  Delivery{" "}
                  <span style={{ opacity: 0.5, fontSize: 11 }}>
                    {delivery === 0 ? "(free over $120)" : "($20 · free over $120)"}
                  </span>
                </span>
                <span className={styles.summaryValue}>{delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`}</span>
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>ORDER TOTAL (inc. GST)</span>
                <span className={styles.totalValue}>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              className={styles.submitBtn}
              onClick={handleSubmitClick}
              disabled={!canSubmit}
            >
              {totalUnits === 0 ? "Add items to your order"
                : !deliveryDate ? "Select a delivery date"
                : !isValidDeliveryDate(deliveryDate) ? "Please select a valid date"
                : "Place Order"}
            </button>

            <p className={styles.terms}>
              All prices include GST · 2 day lead time, orders by 12pm noon<br />
              Questions? <a href="mailto:ben@homecroissanterie.com.au">ben@homecroissanterie.com.au</a>
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {step === "confirm" && deliveryDate && (
        <div className={styles.overlay} onClick={() => setStep("form")}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTitle}>Confirm your order</div>

            {dupInfo && (
              <div className={styles.dupWarning}>
                <div className={styles.dupWarningTitle}>⚠️ Possible duplicate order</div>
                An order from {shopName} for this delivery date was already placed on {dupInfo.timestamp}.
                <br /><strong>Previous order:</strong> {dupInfo.items}
                <br /><br />You can still proceed if this is intentional.
              </div>
            )}

            <div className={styles.modalSection}>Shop</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--black)" }}>{shopName}</div>

            <div className={styles.modalSection}>Delivery date</div>
            <div style={{ fontSize: 14, color: "var(--charcoal)" }}>{format(deliveryDate, "EEEE d MMMM yyyy")}</div>

            <div className={styles.modalSection}>Items</div>
            {orderedLines.map((l) => (
              <div key={l.name} className={styles.modalItem}>
                <span>{l.name} ×{l.qty}</span>
                <span>${l.lineTotal}</span>
              </div>
            ))}

            <hr className={styles.modalDivider} />

            <div className={styles.modalItem}>
              <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className={styles.modalItem} style={{ color: "var(--green)" }}>
                <span>Volume discount (10%)</span><span>−${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className={styles.modalItem}>
              <span>Delivery</span><span>{delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`}</span>
            </div>

            <div className={styles.modalTotal}>
              <span>Total (inc. GST)</span><span>${total.toFixed(2)}</span>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={() => setStep("form")}>Go back</button>
              <button className={styles.btnConfirm} onClick={handleConfirm} disabled={submitting}>
                {submitting ? "Sending..." : "Confirm order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(CUSTOMERS).map((slug) => ({ params: { slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const customer = CUSTOMERS[slug];
  if (!customer) return { notFound: true };
  return { props: { slug, shopName: customer.name } };
};
