import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

let cachedAccounts = null;
let cacheTimestamp = 0;
const CACHE_LIFETIME = 60 * 1000; // 60s

export async function GET() {
  try {
    if (cachedAccounts && Date.now() < cacheTimestamp + CACHE_LIFETIME) {
      console.log("Serving /api/business from cache.");
      return new Response(JSON.stringify(cachedAccounts), { status: 200 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return new Response(JSON.stringify({ error: "No access token found" }), { status: 401 });
    }

    const res = await fetch(
      "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
      {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Google API Error:", data);
      return new Response(JSON.stringify({ error: data }), { status: res.status });
    }

    cachedAccounts = data;
    cacheTimestamp = Date.now();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("Error fetching business accounts:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
