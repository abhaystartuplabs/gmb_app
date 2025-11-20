"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MapPin, Clock, Star, Phone, Tag, Image as ImageIcon, Layers } from "lucide-react";

const styles = {
  indigo700: "#4338ca",
  gray900: "#111827",
  gray600: "#4b5563",
  yellow500: "#f59e0b",
  white: "#ffffff",
  red600: "#dc2626",

  mainContainer: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    padding: "3rem 1rem",
  },
  dashboardCard: {
    backgroundColor: "#ffffff",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    borderRadius: "1rem",
    maxWidth: "80rem",
    margin: "0 auto",
    padding: "2rem",
  },
  header: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#111827",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "0.75rem",
    marginBottom: "2rem",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#4338ca",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "0.5rem",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem",
  },
  reviewCard: {
    padding: "1rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
};

const renderRating = (rating) => {
  const numericRating =
    rating && rating.toUpperCase().endsWith("E")
      ? parseInt(rating.split("_")[0])
      : parseInt(rating);

  return (
    <div style={{ display: "flex", color: styles.yellow500 }}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          style={{
            width: "1.1rem",
            height: "1.1rem",
            fill: i < numericRating ? styles.yellow500 : "none",
            color: styles.yellow500,
          }}
          strokeWidth={2}
        />
      ))}
    </div>
  );
};

export default function FullDashboardPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;

    const fetchLocations = async () => {
      try {
        const res = await fetch("/api/business/locations");
        const data = await res.json();
        if (!res.ok || data.error) throw data.error || "Failed to fetch locations";
        setLocations(data.locations || []);
      } catch (err) {
        console.error("⚠️ API Error:", err);
      }
    };

    const fetchData = async () => {
      try {
        const res = await fetch("/api/business/single-location-data");
        const result = await res.json();
        console.log("result:-", result);
        if (result.success) setData(result);
      } catch (e) {
        console.error("Failed to load dashboard data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
    fetchData();
  }, [session, status]);

  const LazyLoadImage = ({ media, index, style }) => {
    const [imageSrc, setImageSrc] = useState(
      (media.googleUrl || media.thumbnailUrl || "").replace("http://", "https://")
    );
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
      if (!hasError && media.thumbnailUrl) {
        setImageSrc(media.thumbnailUrl.replace("http://", "https://"));
        setHasError(true);
      } else {
        setImageSrc(
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E📸%3C/text%3E%3C/svg%3E"
        );
      }
    };

    return (
      <div key={index} style={style}>
        <img
          src={imageSrc}
          alt={`Business photo ${index + 1}`}
          loading="lazy"
          onError={handleError}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          ...styles.mainContainer,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ fontSize: "1.5rem", color: styles.indigo700 }}>
          Loading comprehensive dashboard...
        </p>
      </div>
    );
  }

  if (!data || !data.location) {
    return (
      <div
        style={{
          ...styles.mainContainer,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>Loading Location...</p>
      </div>
    );
  }

  const { location, reviews, photos, attributesMetadata } = data;

  // ✅ Group attributes by groupDisplayName
  const groupedAttributes = attributesMetadata.reduce((acc, attr) => {
    const group = attr.groupDisplayName || "Other";
    if (!acc[group]) acc[group] = [];
    acc[group].push(attr);
    return acc;
  }, {});

  return (
    <div style={styles.mainContainer}>
      <div style={styles.dashboardCard}>
        <h1 style={styles.header}>Comprehensive Business Dashboard</h1>

        {/* --- LOCATION DETAILS --- */}
        <h2 style={styles.sectionTitle}>
          <MapPin size={20} style={{ color: styles.indigo700 }} />{" "}
          {location.locationName || "Business"} Details
        </h2>

        <div style={styles.grid}>
          {locations.length > 0 ? (
            locations.map((loc) => (
              <div
                key={loc.name}
                style={{
                  padding: "1.5rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  backgroundColor: "#f9fafb",
                  marginBottom: "1.5rem",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#111827",
                    marginBottom: "0.75rem",
                  }}
                >
                  {loc.title || "Unknown Location"}
                </h2>

                <p style={{ color: "#6b7280", marginBottom: "0.5rem" }}>
                  {loc.storefrontAddress?.addressLines?.join(", ") ||
                    "Address not available"}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "0.5rem",
                    color: "#4b5563",
                    fontSize: "0.9rem",
                  }}
                >
                  <p>
                    <strong>City:</strong>{" "}
                    {loc.storefrontAddress?.locality || "N/A"}
                  </p>
                  <p>
                    <strong>State:</strong>{" "}
                    {loc.storefrontAddress?.administrativeArea || "N/A"}
                  </p>
                  <p>
                    <strong>Postal Code:</strong>{" "}
                    {loc.storefrontAddress?.postalCode || "N/A"}
                  </p>
                  <p>
                    <strong>Country:</strong>{" "}
                    {loc.storefrontAddress?.regionCode || "N/A"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p
              style={{
                textAlign: "center",
                color: "#6b7280",
                marginTop: "2rem",
              }}
            >
              No locations found for this account.
            </p>
          )}
        </div>

        {/* --- PHOTOS --- */}
        <h2 style={styles.sectionTitle}>
          <ImageIcon size={20} style={{ color: styles.indigo700 }} /> Photos (
          {photos.length})
        </h2>
        <div
          style={{
            ...styles.grid,
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          }}
        >
          {photos.map((media, i) => (
            <LazyLoadImage
              key={i}
              media={media}
              index={i}
              style={{
                height: "150px",
                overflow: "hidden",
                borderRadius: "0.5rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          ))}
        </div>

        {/* --- REVIEWS --- */}
        <h2 style={styles.sectionTitle}>
          <Star size={20} style={{ color: styles.indigo700 }} /> Reviews (
          {reviews.length})
        </h2>
        <div style={styles.grid}>
          {reviews.map((r, i) => (
            <div key={i} style={styles.reviewCard}>
              <p
                style={{
                  fontWeight: "600",
                  color: styles.gray900,
                  marginBottom: "0.5rem",
                }}
              >
                {r.reviewer.displayName}
              </p>
              {renderRating(r.rating)}
              <p
                style={{
                  fontSize: "0.875rem",
                  color: styles.gray600,
                  marginTop: "0.5rem",
                  fontStyle: "italic",
                }}
              >
                {r.comment}
              </p>
            </div>
          ))}
        </div>

        {/* --- ATTRIBUTES --- */}
        <h2 style={styles.sectionTitle}>
          <Tag size={20} style={{ color: styles.indigo700 }} /> Attributes (
          {attributesMetadata.length})
        </h2>

        {Object.keys(groupedAttributes).map((group, gi) => (
          <div key={gi} style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: styles.indigo700,
                marginBottom: "0.75rem",
              }}
            >
              <Layers size={18} style={{ marginRight: "0.25rem" }} /> {group}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {groupedAttributes[group].map((attr, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    backgroundColor: "#fff",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "600",
                      color: styles.gray900,
                      fontSize: "0.9rem",
                    }}
                  >
                    {attr.displayName}
                  </p>
                  <p style={{ color: styles.gray600, fontSize: "0.8rem" }}>
                    {attr.valueMetadata?.[0]?.value === true
                      ? "✅ Enabled"
                      : attr.valueMetadata?.[0]?.value === false
                      ? "❌ Disabled"
                      : "ℹ️ Not specified"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
