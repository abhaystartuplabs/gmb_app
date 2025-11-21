"use client";
import React, { useEffect, useState } from "react";

export default function GmailPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchGmail() {
      try {
        // 1️⃣ Get last 10 message IDs
        const res = await fetch("/api/business/gmail", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch emails");

        // 2️⃣ Get details for each message
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

  if (loading) return <p>Loading Gmail messages...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!messages.length) return <p>No emails found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Last 10 Gmail Messages</h1>
      <ul className="space-y-3">
        {messages.map((msg) => (
          <li key={msg.id} className="border p-3 rounded shadow">
            <p><strong>From:</strong> {msg.from}</p>
            <p><strong>Subject:</strong> {msg.subject}</p>
            <p><strong>Date:</strong> {msg.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
