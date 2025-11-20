import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import axios from "axios";

const BASE_V1 = "https://mybusinessbusinessinformation.googleapis.com/v1";

/**
 * POST /api/business/search-location
 * Body: { query: "Startup Labs" }
 */
export async function POST(request) {
  console.log("🔹 API: /api/business/search-location");

  try {
    // 1️⃣ Verify session
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = session.accessToken;

    // 2️⃣ Parse request body
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Missing required field: query" },
        { status: 400 }
      );
    }

    // 3️⃣ Call Google My Business Information API
    const url = `${BASE_V1}/googleLocations:search`;
    console.log("📡 Searching Google Location for:", query);

    const googleRes = await axios.post(
      url,
      { query },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const googleLocations = googleRes.data?.googleLocations || [];

    // 4️⃣ Handle empty results
    if (googleLocations.length === 0) {
      return NextResponse.json(
        { success: false, message: "No locations found for this query" },
        { status: 404 }
      );
    }

    // 5️⃣ Map response into cleaner format
    const formattedResults = googleLocations.map((loc) => ({
      name: loc.name,
      title: loc.location?.title || "Unknown",
      phoneNumbers: loc.location?.phoneNumbers || {},
      address: loc.location?.storefrontAddress || {},
      websiteUri: loc.location?.websiteUri || null,
      latlng: loc.location?.latlng || null,
      metadata: loc.location?.metadata || {},
      requestAdminRightsUri: loc.requestAdminRightsUri || null,
    }));

    // ✅ 6️⃣ Send unified JSON
    return NextResponse.json(
      {
        success: true,
        count: formattedResults.length,
        googleLocations: formattedResults,
        source: "Google My Business Information API",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in /search-location:", error.message);
    const status = error.response?.status || 500;
    const errMsg = error.response?.data || { message: error.message };
    return NextResponse.json({ error: errMsg }, { status });
  }
}
