import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import axios from "axios";

const BASE_V1 = "https://mybusinessbusinessinformation.googleapis.com/v1";

/**
 * GET /api/business/location-attributes?locationId=LOCATION_ID
 */
export async function GET(request) {
  try {
    // 1️⃣ Verify session
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = session.accessToken;

    // 2️⃣ Get locationId from query
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("locationId");
    if (!locationId) {
      return NextResponse.json(
        { error: "Missing required query param: locationId" },
        { status: 400 }
      );
    }

    // 3️⃣ Fetch attributes from Google My Business API
    const url = `${BASE_V1}/locations/${locationId}/attributes:getGoogleUpdated`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    // 4️⃣ Return attributes
    return NextResponse.json(
      { success: true, attributes: res.data.attributes || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching location attributes:", error.message);
    const status = error.response?.status || 500;
    const errMsg = error.response?.data || { message: error.message };
    return NextResponse.json({ error: errMsg }, { status });
  }
}
