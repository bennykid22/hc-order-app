import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Head from "next/head";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const callbackUrl =
    typeof router.query.callbackUrl === "string" ? router.query.callbackUrl : "/";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setSubmitting(false);

    if (!res || res.error) {
      setError(
        "Incorrect email or password. Please try again, or contact ben@homecroissanterie.com.au."
      );
      return;
    }

    router.push(res.url ?? callbackUrl);
  };

  return (
    <>
      <Head>
        <title>Log in — Home Croissanterie</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo}>Home Croissanterie</div>
            <div className={styles.headerSub}>Wholesale Login</div>
          </div>
          <div className={styles.tanBar} />

          <div className={styles.body}>
            <form onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button className={styles.submitBtn} type="submit" disabled={submitting}>
                {submitting ? "Logging in..." : "Log in"}
              </button>
            </form>

            <p className={styles.terms}>
              Having trouble logging in? Please email{" "}
              <a href="mailto:ben@homecroissanterie.com.au">
                ben@homecroissanterie.com.au
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
