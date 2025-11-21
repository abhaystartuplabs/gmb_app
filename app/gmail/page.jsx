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

        const messagesWithDetails = await Promise.all(
          (data.messages || []).map(async (msg) => {
            const resDetails = await fetch(`/api/business/gmail/${msg.id}`, { cache: "no-store" });
            return await resDetails.json();
          })
        );

        setMessages(messagesWithDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGmail();
  }, []);

  const containerStyle = {
    maxWidth: "900px",
    margin: "2rem auto",
    padding: "1rem",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "1.5rem",
    color: "#333",
    textAlign: "center",
  };

  const listStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    padding: "1.25rem",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  };

  const cardHoverStyle = {
    transform: "translateY(-3px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  };

  const paragraphStyle = {
    margin: "0.4rem 0",
    color: "#555",
    fontSize: "0.95rem",
  };

  const strongStyle = {
    color: "#222",
  };

  const stateStyle = {
    textAlign: "center",
    fontSize: "1.2rem",
    marginTop: "3rem",
  };

  const errorStyle = {
    ...stateStyle,
    color: "#e63946",
  };

  if (loading) return <p style={stateStyle}>Loading Gmail messages...</p>;
  if (error) return <p style={errorStyle}>Error: {error}</p>;
  if (!messages.length) return <p style={stateStyle}>No emails found.</p>;

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Last 10 Gmail Messages</h1>
      <ul style={listStyle}>
        {messages.map((msg) => (
          <li
            key={msg.id}
            style={cardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
          >
            <p style={paragraphStyle}><strong style={strongStyle}>From:</strong> {msg.from}</p>
            <p style={paragraphStyle}><strong style={strongStyle}>Subject:</strong> {msg.subject}</p>
            <p style={paragraphStyle}><strong style={strongStyle}>Date:</strong> {msg.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
