"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BusinessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [businessAccounts, setBusinessAccounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetch("/api/business/account")
        .then((res) => res.json())
        .then((data) => {
          if (data.error) setError(data.error);
          else setBusinessAccounts(data.accounts || []);
        })
        .catch((err) => setError(err.message));
    }
  }, [status, router]);

  if (status === "loading") {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: "600", color: "#4338ca", marginBottom: "2rem" }}>
        Google My Business Accounts
      </h1>

      {error && (
        <p style={{ color: "#ef4444", marginBottom: "1.5rem" }}>
          ⚠️ {typeof error === "string" ? error : JSON.stringify(error)}
        </p>
      )}

      {businessAccounts.length === 0 ? (
        <p>No business accounts found.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          {businessAccounts.map((account) => (
            <div
              key={account.name}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "1rem",
                padding: "1.5rem",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
            >
              <p style={{ fontWeight: 600, fontSize: "1.125rem", color: "#1f2937" }}>
                {account.accountName}
              </p>
              <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                ID: {account.name.split("/")[1]}
              </p>
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                Type: {account.type}
              </p>
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                Verification: {account.verificationState}
              </p>
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                Vetted: {account.vettedState}
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        style={{
          marginTop: "2rem",
          backgroundColor: "#4338ca",
          color: "#fff",
          padding: "0.5rem 1.5rem",
          borderRadius: "9999px",
          border: "none",
          cursor: "pointer",
          fontWeight: 500,
        }}
        onClick={() => router.push("/dashboard")}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}
