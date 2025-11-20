"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function BusinessAttributesPage() {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();

  // Selected locationId
  const [selectedLocationId, setSelectedLocationId] = useState("");

  // 1️⃣ Fetch all locations for the user
  useEffect(() => {
    const fetchLocations = async () => {
      if (status !== "authenticated" || !session?.accessToken) return;
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/business/locations");
        const data = await res.json();

        if (!res.ok || data.error) throw data.error || "Failed to fetch locations";

        setLocations(data.locations || []);
        // Automatically select the first location
        if (data.locations?.length > 0) {
          setSelectedLocationId(data.locations[0].name.split("/").pop());
        }
      } catch (err) {
        console.error(err);
        setError(typeof err === "object" ? JSON.stringify(err) : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [session, status]);

  // 2️⃣ Fetch attributes for the selected location
  useEffect(() => {
    const fetchAttributes = async () => {
      if (!selectedLocationId) return;
      setLoading(true);
      setError("");
      setAttributes([]);

      try {
        const res = await fetch(`/api/business/socialMedia?locationId=${selectedLocationId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error?.message || "Failed to fetch attributes");
        setAttributes(data.attributes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttributes();
  }, [selectedLocationId]);

  return (
    <div className="container">
      <h1>🏢 Google Business Social Media</h1>

      {loading && <p className="loading">⏳ Loading...</p>}
      {error && <div className="error">❌ {error}</div>}

      {/* Location selector */}
      {locations.length > 1 && (
        <select
          value={selectedLocationId}
          onChange={(e) => setSelectedLocationId(e.target.value)}
          className="location-select"
        >
          {locations.map((loc) => (
            <option key={loc.name} value={loc.name.split("/").pop()}>
              {loc.title || loc.name}
            </option>
          ))}
        </select>
      )}

      <div className="attributes">
        {attributes.map((attr, idx) => (
          <div className="attribute-card" key={idx}>
            <div className="attr-header">
              <strong>{attr.name.replace("attributes/", "")}</strong>
              <span className="attr-type">{attr.valueType}</span>
            </div>
            <div className="attr-value">
              {attr.valueType === "BOOL"
                ? attr.values?.[0]?.toString()
                : attr.uriValues?.[0]?.uri || "N/A"}
            </div>
            {attr.valueType === "URL" && attr.uriValues?.[0]?.uri && (
              <div className="attr-link">
                🔗 <a href={attr.uriValues[0].uri} target="_blank">{attr.uriValues[0].uri}</a>
              </div>
            )}
          </div>
        ))}
      </div>

      {!loading && attributes.length === 0 && !error && (
        <p className="no-results">No attributes found for this business.</p>
      )}

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 50px auto;
          padding: 0 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
          font-size: 2rem;
          color: #111;
        }

        .loading {
          text-align: center;
          font-style: italic;
          color: #555;
        }

        .error {
          color: #dc2626;
          margin-bottom: 20px;
          text-align: center;
        }

        .location-select {
          display: block;
          margin: 0 auto 20px auto;
          padding: 10px;
          font-size: 1rem;
        }

        .attributes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .attribute-card {
          padding: 20px;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .attribute-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .attr-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .attr-type {
          font-size: 0.85rem;
          color: #888;
          font-style: italic;
        }

        .attr-value {
          font-size: 1rem;
          margin-bottom: 8px;
        }

        .attr-link a {
          color: #0070f3;
          text-decoration: none;
          word-break: break-all;
        }

        .attr-link a:hover {
          text-decoration: underline;
        }

        .no-results {
          text-align: center;
          color: #555;
          margin-top: 30px;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}
