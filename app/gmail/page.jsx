"use client";
import React, { useEffect, useState } from "react";

export default function GmailPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchGmail() {
      try {
        const res = await fetch("/api/business/gmail", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch emails");

        console.log("All messages:", data.messages);

        setMessages(data.messages || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGmail();
  }, []);

  const containerStyle = { maxWidth: "900px", margin: "2rem auto", padding: "1rem", fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" };
  const titleStyle = { fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem", color: "#333", textAlign: "center" };
  const listStyle = { listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" };
  const cardStyle = { backgroundColor: "#fff", padding: "1.25rem", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.08)", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" };
  const cardHoverStyle = { transform: "translateY(-3px)", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" };
  const paragraphStyle = { margin: "0.4rem 0", color: "#555", fontSize: "0.95rem" };
  const strongStyle = { color: "#222" };
  const snippetStyle = { marginTop: "0.5rem", fontStyle: "italic", color: "#444", fontSize: "0.9rem" };
  const labelsStyle = { marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" };
  const labelBadgeStyle = { backgroundColor: "#f1f1f1", padding: "2px 6px", borderRadius: "6px", fontSize: "0.75rem", color: "#333" };
  const stateStyle = { textAlign: "center", fontSize: "1.2rem", marginTop: "3rem" };
  const errorStyle = { ...stateStyle, color: "#e63946" };

  if (loading) return <p style={stateStyle}>Loading Gmail messages...</p>;
  if (error) return <p style={errorStyle}>Error: {error}</p>;
  if (!messages.length) return <p style={stateStyle}>No emails found.</p>;

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Last 10 Gmail Messages</h1>
      <ul style={listStyle}>
        {messages.map((msg) => {
          const fromHeader = msg.payload?.headers?.find(h => h.name === "From")?.value || "Unknown sender";
          const subjectHeader = msg.payload?.headers?.find(h => h.name === "Subject")?.value || "(No Subject)";
          const dateHeader = msg.payload?.headers?.find(h => h.name === "Date")?.value || "";

          return (
            <li
              key={msg.id}
              style={cardStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
            >
              <p style={paragraphStyle}><strong style={strongStyle}>From:</strong> {fromHeader}</p>
              <p style={paragraphStyle}><strong style={strongStyle}>Subject:</strong> {subjectHeader}</p>
              <p style={paragraphStyle}><strong style={strongStyle}>Date:</strong> {dateHeader}</p>
              {msg.snippet && <p style={snippetStyle}>{msg.snippet}</p>}
              {msg.labelIds && (
                <div style={labelsStyle}>
                  {msg.labelIds.map((label) => (
                    <span key={label} style={labelBadgeStyle}>{label}</span>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
