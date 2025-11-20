import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import axios from "axios";
import { authOptions } from "../../auth/[...nextauth]/route";

// Base endpoint — accountId will be dynamically inserted
const GOOGLE_BUSINESS_BASE_URL = "https://mybusinessbusinessinformation.googleapis.com/v1";

export async function GET(request) {
  // 1️⃣ Get Session + Access Token
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = session.accessToken;

  try {
    // 2️⃣ Optional: Parse `accountId` from query param for flexibility
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");

    // 3️⃣ If not provided, fetch accountId dynamically
    let resolvedAccountId = accountId;
    if (!resolvedAccountId) {
      const accountRes = await axios.get(
        `${GOOGLE_BUSINESS_BASE_URL}/accounts`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Use the first available account
      resolvedAccountId = accountRes.data?.accounts?.[0]?.name;
      if (!resolvedAccountId) {
        throw new Error("No Google Business accounts found.");
      }
    }

    // 4️⃣ Construct dynamic URL safely
    const url = `${GOOGLE_BUSINESS_BASE_URL}/${resolvedAccountId}/locations?read_mask=name,title,storefrontAddress,latlng`;

    // 5️⃣ Fetch locations
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    console.log("✅ Google Locations Response:", JSON.stringify(response.data, null, 2));

    // 6️⃣ Return data
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching locations from Google:", error.message);

    const statusCode = error.response?.status || 500;
    const errorData = error.response?.data || { message: error.message || "Internal server error" };

    return NextResponse.json({ error: errorData }, { status: statusCode });
  }
}
