"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log("session:-", session)
  console.log("status:-", status)

  const [accountId, setAccountId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, accessToken, expires } = session || {};

  /** Handle authentication + API fetching */
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status !== "authenticated") return;

    const fetchBusinessData = async () => {
      try {
        setLoading(true);

        // Fetch Account
        const accRes = await fetch("/api/business/account");
        const accData = await accRes.json();
        if (!accRes.ok) throw accData.error || "Failed to fetch account";

        const accountName = accData?.accounts?.[0]?.name; // "accounts/110941873856954736511"
        console.log("accountName:-",accountName)
        const onlyId = accountName?.replace("accounts/", ""); // "110941873856954736511"

        setAccountId(onlyId || "");


        // Fetch Locations
        const locRes = await fetch("/api/business/locations");
        const locData = await locRes.json();
        if (!locRes.ok) throw locData.error || "Failed to fetch locations";

        const location = locData?.locations?.[0]?.name;
        setLocationId(location || "");
      } catch (err) {
        console.error("⚠️ API Error:", err);
        setError(typeof err === "string" ? err : err?.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [status, router]);

  // 🧠 Styles memoized to avoid re-creation
  const styles = useMemo(
    () => ({
      container: {
        minHeight: "100vh",
        backgroundColor: "#fecaca",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      },
      card: {
        backgroundColor: "#fff",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        borderRadius: "1rem",
        padding: "2rem",
        width: "100%",
        maxWidth: "28rem",
        textAlign: "center",
      },
      profile: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      },
      image: {
        width: "6rem",
        height: "6rem",
        borderRadius: "50%",
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        border: "2px solid #c7d2fe",
      },
      title: { fontSize: "1.5rem", fontWeight: 600, color: "#1f2937" },
      email: { color: "#6b7280" },
      detailsCard: {
        marginTop: "2rem",
        backgroundColor: "#f9fafb",
        borderRadius: "0.75rem",
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
        padding: "1.25rem",
        textAlign: "left",
      },
      detailsTitle: {
        fontSize: "1.125rem",
        fontWeight: 600,
        color: "#4f46e5",
        borderBottom: "1px solid #e5e7eb",
        paddingBottom: "0.5rem",
        marginBottom: "0.75rem",
      },
      label: { fontWeight: 500, color: "#1f2937" },
      value: { color: "#4b5563", wordBreak: "break-all" },
      buttonGroup: {
        display: "flex",
        flexDirection: "column",
        marginTop: "1rem",
        gap: "0.75rem",
      },
      button: {
        fontWeight: 600,
        padding: "0.5rem 1.5rem",
        borderRadius: "9999px",
        border: "none",
        cursor: "pointer",
        color: "#fff",
        backgroundColor: "#6366f1",
        transition: "transform 0.2s",
      },
      signOut: { backgroundColor: "#ef4444" },
      footer: {
        marginTop: "1.5rem",
        color: "#6b7280",
        fontSize: "0.875rem",
        textAlign: "center",
      },
      footerSpan: { fontWeight: 600, color: "#4f46e5" },
    }),
    []
  );

  /** Loading Screen */
  if (status === "loading" || loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <p style={{ fontSize: "1.25rem", fontWeight: 500, color: "#4b5563" }}>
          Loading Dashboard...
        </p>
      </div>
    );
  }

  /** Error State */
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={{ color: "#ef4444", marginBottom: "1rem" }}>Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ ...styles.button, backgroundColor: "#6366f1", marginTop: "1rem" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /** Main Dashboard */
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.profile}>
          <img
            src={user?.image}
            alt={user?.name || "Profile"}
            style={styles.image}
          />
          <h1 style={styles.title}>Welcome, {user?.name}</h1>
          <p style={styles.email}>{user?.email}</p>
        </div>

        <div style={styles.detailsCard}>
          <h3 style={styles.detailsTitle}>Session Details</h3>
          <p>
            <span style={styles.label}>Access Token:</span>
            <br />
            <span style={styles.value}>{accessToken || "—"}</span>
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            <span style={styles.label}>Expires:</span>
            <br />
            <span style={styles.value}>
              {expires ? new Date(expires).toLocaleString() : "—"}
            </span>
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            <span style={styles.label}>Account ID:</span>
            <br />
            <span style={styles.value}>{accountId || "—"}</span>
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            <span style={styles.label}>Location ID:</span>
            <br />
            <span style={styles.value}>{locationId || "—"}</span>
          </p>
        </div>

        <div style={styles.buttonGroup}>
          {[
            { label: "View My Business Accounts", path: "/business/accounts" },
            { label: "View My Business Attributes", path: "/business/attributes" },
            { label: "View My Business Locations", path: "/business/location" },
            { label: "View My Business Reviews", path: "/business/reviews" },
            { label: "View Full Business Dashboard", path: "/business/full-dashboard" },
            { label: "View Full Business Details", path: "/business/search" },
            { label: "View Full Business Social", path: "/business/socialMedia" },
            { label: "Post Media on GMB", path: `/business/upload_media?accountId=${accountId}` },
          ].map((btn, i) => (
            <button key={i} onClick={() => router.push(btn.path)} style={styles.button}>
              {btn.label}
            </button>
          ))}

          <button onClick={() => signOut()} style={{ ...styles.button, ...styles.signOut }}>
            Sign Out
          </button>
          <a
            href="https://search.google.com/local/writereview?placeid=ChIJqWk-S5q0bTkRU7x4FZek9W4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Write a Review on Google
          </a>
        </div>
      </div>

      <p style={styles.footer}>
        Powered by <span style={styles.footerSpan}>NextAuth.js</span>
      </p>
    </div>
  );
}
