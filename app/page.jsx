"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const { user, accessToken } = session || {};
  const router = useRouter();

  useEffect(() => { 
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  // --- Style Definitions (Converted from Tailwind) ---

  // Converted: flex h-screen items-center justify-center
  const loadingContainerStyle = {
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Converted: text-xl font-medium text-gray-700 animate-pulse
  const loadingTextStyle = {
    fontSize: '1.25rem', // text-xl
    fontWeight: 500, // font-medium
    color: '#374151', // text-gray-700
    // animate-pulse is omitted
  };

  // Converted: min-h-screen flex items-center justify-center px-4 relative overflow-hidden
  const mainContainerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '1rem', // px-4
    paddingRight: '1rem',
    position: 'relative',
    overflow: 'hidden',
    // Simulating a light gradient background for the overall page
    backgroundColor: '#e0e7ff', 
  };
  
  // Converted: absolute inset-0 blur-3xl
  const backgroundGlowStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    filter: 'blur(3rem)', // blur-3xl
    zIndex: 0,
    // Add some color for the glow effect
    background: 'radial-gradient(circle, rgba(165,180,252,0.8) 0%, rgba(255,255,255,0) 70%)',
  };

  // Converted: relative bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-md text-center border border-white/40
  // Note: Hover/Transition effects are omitted as they require state or separate CSS.
  const cardStyle = {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // bg-white/70
    backdropFilter: 'blur(24px)', // backdrop-blur-xl (using static value)
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
    borderRadius: '1.5rem', // rounded-3xl
    padding: '2.5rem', // p-10
    width: '100%',
    maxWidth: '28rem', // max-w-md
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.4)', // border border-white/40
    zIndex: 10,
  };

  // Converted: flex flex-col items-center mb-6
  const profileContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '1.5rem', // mb-6
  };

  // Converted: w-20 h-20 rounded-full border-4 border-white shadow-md mb-3
  const profileImageStyle = {
    width: '5rem', // w-20
    height: '5rem', // h-20
    borderRadius: '9999px', // rounded-full
    border: '4px solid #ffffff', // border-4 border-white
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)', // shadow-md
    marginBottom: '0.75rem', // mb-3
  };

  // Converted: text-2xl font-semibold text-gray-800
  const welcomeTitleStyle = {
    fontSize: '1.5rem', // text-2xl
    fontWeight: 600, // font-semibold
    color: '#1f2937', // text-gray-800
  };

  // Converted: text-3xl font-bold text-gray-800 mb-3
  const initialWelcomeTitleStyle = {
    fontSize: '1.875rem', // text-3xl
    fontWeight: 700, // font-bold
    color: '#1f2937', // text-gray-800
    marginBottom: '0.75rem', // mb-3
  };
  
  // Converted: text-gray-500 text-sm mb-8
  const textGray500Style = {
    color: '#6b7280', // text-gray-500
    fontSize: '0.875rem', // text-sm
  };
  
  // Converted: text-gray-500 mb-8
  const welcomeMessageStyle = {
    color: '#6b7280', // text-gray-500
    marginBottom: '2rem', // mb-8
  };

  // Converted: flex items-center justify-center gap-3 bg-[#4285F4] text-white font-semibold py-3 px-6 rounded-full w-full shadow-lg
  // Note: Hover and active states omitted
  const googleSignInButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem', // gap-3
    backgroundColor: '#4285F4', // bg-[#4285F4]
    color: '#ffffff',
    fontWeight: 600, // font-semibold
    padding: '0.75rem 1.5rem', // py-3 px-6
    borderRadius: '9999px', // rounded-full
    width: '100%',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)', // shadow-lg
    border: 'none',
    cursor: 'pointer',
  };

  // Converted: bg-white rounded-full p-0.5
  const googleIconStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '9999px', // rounded-full
    padding: '0.125rem', // p-0.5
  };
  
  // Converted: flex items-center justify-center gap-3 bg-red-500 text-white font-semibold py-3 px-6 rounded-full w-full shadow-lg
  const signOutButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem', // gap-3
    backgroundColor: '#ef4444', // bg-red-500
    color: '#ffffff',
    fontWeight: 600, // font-semibold
    padding: '0.75rem 1.5rem', // py-3 px-6
    borderRadius: '9999px', // rounded-full
    width: '100%',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)', // shadow-lg
    border: 'none',
    cursor: 'pointer',
  };

  // Converted: mt-4 bg-indigo-500 text-white font-semibold py-3 px-6 rounded-full w-full shadow-md
  const viewBusinessButtonStyle = {
    marginTop: '1rem', // mt-4
    backgroundColor: '#6366f1', // bg-indigo-500
    color: '#ffffff',
    fontWeight: 600, // font-semibold
    padding: '0.75rem 1.5rem', // py-3 px-6
    borderRadius: '9999px', // rounded-full
    width: '100%',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', // shadow-md
    border: 'none',
    cursor: 'pointer',
  };
  
  // Converted: my-8 border-t border-gray-200
  const dividerStyle = {
    marginTop: '2rem', // my-8
    marginBottom: '2rem',
    borderTop: '1px solid #e5e7eb', // border-t border-gray-200
  };

  // Converted: text-indigo-600 font-medium hover:underline
  const linkStyle = {
    color: '#4f46e5', // text-indigo-600
    fontWeight: 500, // font-medium
    textDecoration: 'none',
    cursor: 'pointer',
  };

  // Converted: absolute bottom-6 text-gray-500 text-sm text-center
  const footerStyle = {
    position: 'absolute',
    bottom: '1.5rem', // bottom-6
    color: '#6b7280', // text-gray-500
    fontSize: '0.875rem', // text-sm
    textAlign: 'center',
  };

  // Converted: font-semibold text-indigo-600
  const footerSpanStyle = {
    fontWeight: 600, // font-semibold
    color: '#4f46e5', // text-indigo-600
  };

  if (status === "loading") {
    return (
      <div style={loadingContainerStyle}>
        <div style={loadingTextStyle}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div style={mainContainerStyle}>
      {/* Background glow effect */}
      <div style={backgroundGlowStyle}></div>

      {/* Card */}
      <div style={cardStyle}>
        {/* Profile / Logo */}
        {accessToken && (
          <div style={profileContainerStyle}>
            <img
              src={user?.image}
              alt={user?.name || "User Avatar"}
              style={profileImageStyle}
            />
            <h1 style={welcomeTitleStyle}>
              Hi, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p style={textGray500Style}>{user?.email}</p>
          </div>
        )}

        {/* Welcome Text */}
        {!accessToken && (
          <>
            <h1 style={initialWelcomeTitleStyle}>
              Welcome Back 👋
            </h1>
            <p style={welcomeMessageStyle}>
              Sign in to access your Google Business Dashboard
            </p>
          </>
        )}

        {/* Auth Buttons */}
        {!accessToken ? (
          <button
            onClick={() => signIn("google")}
            style={googleSignInButtonStyle}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              height={18}
              width={18}
              style={googleIconStyle}
            />
            <span>Sign in with Google</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => signOut()}
              style={signOutButtonStyle}
            >
              <span>Sign Out</span>
            </button>

            <button
              onClick={() => router.push("/business")}
              style={viewBusinessButtonStyle}
            >
              View My Business Accounts
            </button>
          </>
        )}

        {/* Divider */}
        <div style={dividerStyle}></div>

        {/* Terms */}
        <p style={textGray500Style}>
          By continuing, you agree to our{" "}
          <a
            href="#"
            style={linkStyle}
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            style={linkStyle}
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>

      {/* Footer */}
      <p style={footerStyle}>
        Powered by{" "}
        <span style={footerSpanStyle}>NextAuth.js</span>
      </p>
    </div>
  );
}
