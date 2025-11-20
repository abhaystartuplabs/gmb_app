"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BusinessAttributes() {
  const { data: session, status } = useSession();
  const [attributes, setAttributes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAttributes = async () => {
      if (!session?.accessToken) return;
      setLoading(true);

      try {
        // ✅ Call your secure server route instead of the direct Google URL
        const res = await fetch("/api/business/attributes"); 

        const data = await res.json();
        console.log("data:-", data);

        if (!res.ok || data.error) {
            // Throw the error returned by the server route
            throw data.error || data.details; 
        }
        
        // Set the attributes array from the server response
        setAttributes(data.attributes || []); 
      } catch (err) {
        console.error("⚠️ API Error:", err);
        // Note: err can be a string or an object from the server
        setError(typeof err === 'object' && err !== null ? JSON.stringify(err) : err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttributes();
  }, [session]);

  if (status === "loading" || loading) {
    // Converted: flex h-screen items-center justify-center from-blue-50 to-indigo-100
    const loadingContainerStyle = {
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      // Tailwind gradient simulation is complex, using a simple background
      backgroundColor: '#f8fafc', 
    };
    
    // Converted: text-lg font-medium text-gray-700 animate-pulse
    const loadingTextStyle = {
      fontSize: '1.125rem', // text-lg
      fontWeight: 500, // font-medium
      color: '#4b5563', // text-gray-700
      // animate-pulse is hard to do with inline style, omitting the animation
    };

    return (
      <div style={loadingContainerStyle}>
        <div style={loadingTextStyle}>
          Loading attributes...
        </div>
      </div>
    );
  }

  if (error) {
    // Converted: min-h-screen flex flex-col items-center justify-center bg-red-50 text-center px-4
    const errorContainerStyle = {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fef2f2', // bg-red-50
      textAlign: 'center',
      padding: '1rem', // px-4
    };

    // Converted: text-2xl font-semibold text-red-600 mb-4
    const errorTitleStyle = {
      fontSize: '1.5rem', // text-2xl
      fontWeight: 600, // font-semibold
      color: '#dc2626', // text-red-600
      marginBottom: '1rem', // mb-4
    };

    // Converted: text-sm bg-white p-4 rounded-lg shadow-md text-left overflow-auto max-w-2xl max-h-96 border border-gray-100
    const errorPreStyle = {
      fontSize: '0.875rem', // text-sm
      backgroundColor: '#ffffff',
      padding: '1rem', // p-4
      borderRadius: '0.5rem', // rounded-lg
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)', // shadow-md
      textAlign: 'left',
      overflow: 'auto',
      maxWidth: '42rem', // max-w-2xl
      maxHeight: '24rem', // max-h-96
      border: '1px solid #f3f4f6', // border border-gray-100
    };

    // Converted: mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full transition-all
    const backButtonStyle = {
      marginTop: '1.5rem', // mt-6
      backgroundColor: '#4f46e5', // bg-indigo-600
      color: '#ffffff',
      padding: '0.5rem 1.5rem', // px-6 py-2
      borderRadius: '9999px', // rounded-full
      transition: 'all 150ms ease-in-out', // transition-all
      cursor: 'pointer',
      border: 'none',
      fontWeight: 500,
    };


    return (
      <div style={errorContainerStyle}>
        <h2 style={errorTitleStyle}>
          ⚠️ API Error
        </h2>
        <pre style={errorPreStyle}>
          {JSON.stringify(error, null, 2)}
        </pre>

        <button
          onClick={() => router.push("/dashboard")}
          // Note: Hover styles cannot be fully applied via inline style without JS event listeners
          style={{ ...backButtonStyle, }} 
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  // Converted: min-h-screen from-blue-50 to-indigo-100 flex flex-col items-center py-10 px-6
  const mainContainerStyle = {
    minHeight: '100vh',
    // Background gradient simulation is complex, using a light color
    backgroundColor: '#f8fafc', 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '2.5rem', // py-10
    paddingBottom: '2.5rem',
    paddingLeft: '1.5rem', // px-6
    paddingRight: '1.5rem',
  };

  // Converted: bg-white shadow-xl rounded-2xl p-8 w-full max-w-5xl
  const cardStyle = {
    backgroundColor: '#ffffff',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-xl
    borderRadius: '1rem', // rounded-2xl
    padding: '2rem', // p-8
    width: '100%',
    maxWidth: '64rem', // max-w-5xl
  };

  // Converted: text-3xl font-bold text-gray-800 mb-6 text-center
  const titleStyle = {
    fontSize: '1.875rem', // text-3xl
    fontWeight: 700, // font-bold
    color: '#1f2937', // text-gray-800
    marginBottom: '1.5rem', // mb-6
    textAlign: 'center',
  };

  // Converted: text-center text-gray-500
  const emptyTextStyle = {
    textAlign: 'center',
    color: '#6b7280', // text-gray-500
  };

  // Converted: grid md:grid-cols-2 lg:grid-cols-3 gap-6
  const gridStyle = {
    display: 'grid',
    gap: '1.5rem', // gap-6
    // Using simple grid properties, responsive columns are complex with inline style:
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
  };
  
  // Converted: bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all
  const attributeCardStyle = {
    backgroundColor: '#f9fafb', // bg-gray-50
    border: '1px solid #e5e7eb', // border border-gray-200
    borderRadius: '0.5rem', // rounded-lg
    padding: '1rem', // p-4
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
    transition: 'all 150ms ease-in-out', // transition-all
    // Omitting hover:shadow-md transition-all (cannot be done with inline style)
  };

  // Converted: text-lg font-semibold text-gray-800
  const attributeTitleStyle = {
    fontSize: '1.125rem', // text-lg
    fontWeight: 600, // font-semibold
    color: '#1f2937', // text-gray-800
  };

  // Converted: text-sm text-gray-600 mt-1
  const attributeTextStyle = {
    fontSize: '0.875rem', // text-sm
    color: '#4b5563', // text-gray-600
    marginTop: '0.25rem', // mt-1
  };
  
  // Converted: font-medium
  const attributeMediumStyle = {
    fontWeight: 500, // font-medium
  };

  // Converted: text-sm text-gray-500 mt-1
  const attributeGroupStyle = {
    fontSize: '0.875rem', // text-sm
    color: '#6b7280', // text-gray-500
    marginTop: '0.25rem', // mt-1
  };

  // Converted: text-xs text-red-500 mt-2 font-semibold
  const deprecatedTextStyle = {
    fontSize: '0.75rem', // text-xs
    color: '#ef4444', // text-red-500
    marginTop: '0.5rem', // mt-2
    fontWeight: 600, // font-semibold
  };

  // Converted: flex flex-col sm:flex-row items-center justify-center gap-4 mt-10
  const actionContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem', // gap-4
    marginTop: '2.5rem', // mt-10
  };
  
  // Converted: bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full transition-all
  const dashboardButtonStyle = {
    backgroundColor: '#4f46e5', // bg-indigo-600
    color: '#ffffff',
    padding: '0.5rem 1.5rem', // px-6 py-2
    borderRadius: '9999px', // rounded-full
    transition: 'all 150ms ease-in-out',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 500,
  };
  
  // Converted: bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-all
  const signOutButtonStyle = {
    backgroundColor: '#ef4444', // bg-red-500
    color: '#ffffff',
    padding: '0.5rem 1.5rem', // px-6 py-2
    borderRadius: '9999px', // rounded-full
    transition: 'all 150ms ease-in-out',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 500,
  };

  return (
    <div style={mainContainerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>
          🏷️ Google Business Attributes
        </h1>

        {attributes.length === 0 ? (
          <p style={emptyTextStyle}>
            No attributes found. Try again later or verify your access token
            scopes.
          </p>
        ) : (
          <div style={gridStyle}>
            {attributes.map((attr) => (
              <div
                key={attr.parent}
                style={attributeCardStyle}
              >
                <h2 style={attributeTitleStyle}>
                  {attr.displayName || "Unnamed Attribute"}
                </h2>
                <p style={attributeTextStyle}>
                  Type: <span style={attributeMediumStyle}>{attr.valueType}</span>
                </p>
                {attr.groupDisplayName && (
                  <p style={attributeGroupStyle}>
                    Group: {attr.groupDisplayName}
                  </p>
                )}
                {attr.deprecated && (
                  <p style={deprecatedTextStyle}>
                    ⚠️ Deprecated
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
            onClick={() => signOut()}
            style={signOutButtonStyle}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
