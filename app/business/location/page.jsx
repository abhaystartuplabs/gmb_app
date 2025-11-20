"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BusinessLocations() {
  const { data: session, status } = useSession();
  const [locations, setLocations] = useState([]); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      // Ensure we are authenticated before proceeding
      if (status !== "authenticated" || !session?.accessToken) return;
      setLoading(true);

      try {
        // ✅ Call the secure server route handler
        const res = await fetch("/api/business/locations"); 
        const data = await res.json();

        // console.log("data:-",data)
        
        if (!res.ok || data.error) {
            // Throw error message received from the server
            throw data.error || data.details || "Unknown error from server."; 
        }

        // Set the locations array from the 'locations' key
        setLocations(data.locations || []); 
      } catch (err) {
        console.error("⚠️ API Error:", err);
        // Ensure error state is a readable string
        setError(typeof err === 'object' && err !== null ? JSON.stringify(err) : String(err));
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
        fetchLocations();
    }
  }, [session, status]);



  // --- Style Definitions (All styles are kept for completeness) ---

  const loadingContainerStyle = { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' };
  const loadingTextStyle = { fontSize: '1.125rem', fontWeight: 500, color: '#4b5563' };
  const errorContainerStyle = { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef2f2', textAlign: 'center', padding: '1rem' };
  const errorTitleStyle = { fontSize: '1.5rem', fontWeight: 600, color: '#dc2626', marginBottom: '1rem' };
  const errorPreStyle = { fontSize: '0.875rem', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)', textAlign: 'left', overflow: 'auto', maxWidth: '42rem', maxHeight: '24rem', border: '1px solid #f3f4f6' };
  const backButtonStyle = { marginTop: '1.5rem', backgroundColor: '#4f46e5', color: '#ffffff', padding: '0.5rem 1.5rem', borderRadius: '9999px', transition: 'all 150ms ease-in-out', cursor: 'pointer', border: 'none', fontWeight: 500 };
  const mainContainerStyle = { minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2.5rem', paddingBottom: '2.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' };
  const cardStyle = { backgroundColor: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '64rem' };
  const titleStyle = { fontSize: '1.875rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.5rem', textAlign: 'center' };
  const emptyTextStyle = { textAlign: 'center', color: '#6b7280' };
  const gridStyle = { display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' };
  const locationCardStyle = { backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', transition: 'all 150ms ease-in-out' };
  const locationTitleStyle = { fontSize: '1.25rem', fontWeight: 600, color: '#4338ca' };
  const locationTextStyle = { fontSize: '0.875rem', color: '#4b5563', marginTop: '0.5rem' };
  const locationMediumStyle = { fontWeight: 500 };
  const locationStatusStyle = { fontSize: '0.875rem', color: '#6b7280' };
  const actionContainerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2.5rem' };
  const dashboardButtonStyle = { backgroundColor: '#4f46e5', color: '#ffffff', padding: '0.5rem 1.5rem', borderRadius: '9999px', transition: 'all 150ms ease-in-out', cursor: 'pointer', border: 'none', fontWeight: 500 };
  const signOutButtonStyle = { backgroundColor: '#ef4444', color: '#ffffff', padding: '0.5rem 1.5rem', borderRadius: '9999px', transition: 'all 150ms ease-in-out', cursor: 'pointer', border: 'none', fontWeight: 500 };


  // --- Render ---

  if (status === "loading" || loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={loadingTextStyle}>
          Loading business locations...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorContainerStyle}>
        <h2 style={errorTitleStyle}>
          ⚠️ API Error
        </h2>
        <pre style={errorPreStyle}>
          {error}
        </pre>
        <button
          onClick={() => router.push("/dashboard")}
          style={backButtonStyle}
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={mainContainerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>
          📍 Google Business Locations
        </h1>

        {locations.length === 0 ? (
          <p style={emptyTextStyle}>
            No business locations found. Check your GMB account permissions.
          </p>
        ) : (
          <div style={gridStyle}>
            {locations.map((loc) => (
              <div
                key={loc.name}
                style={locationCardStyle}
              >
                <h2 style={locationTitleStyle}>
                  {/* Business Name */}
                  **{loc.title}** </h2>
                
                <p style={locationTextStyle}>
                  {/* Resource Name / Location ID */}
                  <span style={locationMediumStyle}>Resource:</span> {loc.name}
                </p>
                
                {/* Full Address Rendering */}
                {loc.storefrontAddress && (
                  <div style={locationStatusStyle}>
                    <p style={locationTextStyle}>
                      <span style={locationMediumStyle}>Street:</span> {loc.storefrontAddress.addressLines?.join(', ')}
                    </p>
                    <p style={locationTextStyle}>
                      <span style={locationMediumStyle}>City/State/Zip:</span> 
                      {loc.storefrontAddress.locality}, {loc.storefrontAddress.administrativeArea} - {loc.storefrontAddress.postalCode}
                    </p>
                    <p style={locationTextStyle}>
                      <span style={locationMediumStyle}>Country/Lang:</span> 
                      {loc.storefrontAddress.regionCode} ({loc.storefrontAddress.languageCode})
                    </p>
                  </div>
                )}
                
                {/* Account ID (if added by server) */}
                {loc.accountId && (
                  <p style={locationTextStyle}>
                      <span style={locationMediumStyle}>Account ID:</span> {loc.accountId.split('/')[1]}
                  </p>
                )}

              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div style={actionContainerStyle}>
          <button
            onClick={() => router.push("/dashboard")}
            style={dashboardButtonStyle}
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={() => {signOut(),router.push("/dashboard")}}
            style={signOutButtonStyle}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}