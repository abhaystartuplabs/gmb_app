import React from "react";

async function fetchGmail() {
  const res = await fetch("/api/gmail", { cache: "no-store" }); // SSR fetch
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch emails");
  }
  return res.json();
}

export default async function GmailPage() {
  let data;
  try {
    data = await fetchGmail();
  } catch (err) {
    return <p className="text-red-500">Error: {err.message}</p>;
  }

  const messages = data.messages || [];

  if (messages.length === 0) return <p>No emails found.</p>;

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
