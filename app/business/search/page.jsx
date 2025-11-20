"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function SearchLocationPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const [error, setError] = useState("");

  // Auto-fetch first location and its details
  useEffect(() => {
    const fetchLocationsAndData = async () => {
      if (status !== "authenticated" || !session?.accessToken) return;
      setLoading(true);

      try {
        // Fetch locations
        const res = await fetch("/api/business/locations");
        const data = await res.json();

        if (!res.ok || data.error) throw data.error || "Unknown error fetching locations";

        const firstLocation = data.locations?.[0];
        if (!firstLocation) throw new Error("No locations found");

        setQuery(firstLocation.title || "");

        // Fetch the search results for the first location
        const searchRes = await fetch("/api/business/search-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: firstLocation.title }),
        });

        const searchData = await searchRes.json();
        if (!searchRes.ok) throw new Error(searchData.error?.message || searchData.message || "Search failed");

        setResults(searchData.googleLocations || []);
      } catch (err) {
        console.error(err);
        setError(typeof err === "object" ? JSON.stringify(err) : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchLocationsAndData();
  }, [session, status]);

  if (loading) return <p>⏳ Loading business details...</p>;
  if (error) return <div>❌ {error}</div>;
  if (!results.length) return <p>No business details found.</p>;

  return (
    <div className="container">
      {results.map((loc, index) => (
        <div className="location-card" key={index}>
          <h2>{loc.title}</h2>

          <p><strong>Primary Phone:</strong> {loc.phoneNumbers?.primaryPhone || "N/A"}</p>

          {loc.phoneNumbers?.additionalPhones?.length > 0 && (
            <p><strong>Additional Phones:</strong> {loc.phoneNumbers.additionalPhones.join(", ")}</p>
          )}

          <p>
            <strong>Address:</strong>{" "}
            {loc.address?.addressLines?.join(", ")}, {loc.address?.locality}, {loc.address?.administrativeArea} {loc.address?.postalCode}
          </p>

          {loc.websiteUri && (
            <p>🌐 <a href={loc.websiteUri} target="_blank" rel="noopener noreferrer">{loc.websiteUri}</a></p>
          )}

          {loc.metadata?.mapsUri && (
            <p>🗺️ <a href={loc.metadata.mapsUri} target="_blank" rel="noopener noreferrer">View on Google Maps</a></p>
          )}

          {loc.metadata?.newReviewUri && (
            <p>✍️ <a href={loc.metadata.newReviewUri} target="_blank" rel="noopener noreferrer">Write a Review</a></p>
          )}
        </div>
      ))}

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 40px auto;
          padding: 0 20px;
          font-family: Arial, sans-serif;
        }
        .location-card {
          border: 1px solid #ccc;
          padding: 15px;
          border-radius: 10px;
          background-color: #f9f9f9;
          margin-bottom: 20px;
        }
        .location-card h2 {
          margin: 0 0 10px;
        }
        a {
          color: #0070f3;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
