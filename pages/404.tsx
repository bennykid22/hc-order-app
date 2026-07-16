import Head from "next/head";
import styles from "./order/[slug].module.css";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Not Found — Home Croissanterie</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.card} style={{ textAlign: "center", padding: "60px 40px" }}>
          <div className={styles.logo}>Home Croissanterie</div>
          <p style={{ marginTop: 24, color: "var(--charcoal)", fontSize: 15 }}>
            This order link doesn&apos;t exist. Please contact Ben for your unique ordering link.
          </p>
          <p style={{ marginTop: 12, fontSize: 13, color: "var(--tan)" }}>
            ben@homecroissanterie.com.au
          </p>
        </div>
      </div>
    </>
  );
}
