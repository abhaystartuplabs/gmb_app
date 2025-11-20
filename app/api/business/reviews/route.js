// app/api/business/reviews/route.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import axios from "axios";

const GOOGLE_BUSINESS_BASE_URL = "https://mybusiness.googleapis.com/v4";

export async function GET(request) {
  console.log("🔹 API Route Called: /api/business/reviews (Dynamic)");

  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = session.accessToken;

    // 1️⃣ Extract query parameters (optional)
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");
    const locationId = searchParams.get("locationId");

    // 2️⃣ Resolve account dynamically if not provided
    let resolvedAccountId = accountId;
    if (!resolvedAccountId) {
      const accountsRes = await axios.get(
        `https://mybusinessaccountmanagement.googleapis.com/v1/accounts`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      resolvedAccountId = accountsRes.data?.accounts?.[0]?.name;
      if (!resolvedAccountId) {
        throw new Error("No Google Business accounts found.");
      }
    }

    // 3️⃣ Resolve location dynamically if not provided
    let resolvedLocationId = locationId;
    if (!resolvedLocationId) {
      const locationsRes = await axios.get(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${resolvedAccountId}/locations?read_mask=name,title`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const firstLocation = locationsRes.data?.locations?.[0];
      if (!firstLocation) {
        throw new Error("No locations found under this account.");
      }

      resolvedLocationId = firstLocation.name.split("/").pop(); // Extract numeric part only
    }

    // 4️⃣ Construct Google API URL dynamically
    const reviewsUrl = `${GOOGLE_BUSINESS_BASE_URL}/${resolvedAccountId}/locations/${resolvedLocationId}/reviews`;

    console.log("📍 Fetching Reviews From:", reviewsUrl);

    // 5️⃣ Fetch reviews from Google API
    const response = await fetch(reviewsUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to fetch reviews`, errorText);
      return NextResponse.json(
        { error: "Failed to fetch reviews from GMB", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reviews = data.reviews || [];

    // 6️⃣ Normalize review data for frontend use
    const allReviews = reviews.map((r) => ({
      location: r.name || "Unknown Location",
      reviewer: r.reviewer?.displayName || "Anonymous",
      rating: r.starRating,
      comment: r.comment,
      createTime: r.createTime,
    }));

    // ✅ Return structured response
    return NextResponse.json({
      success: true,
      total: allReviews.length,
      reviews: allReviews,
    });
  } catch (err) {
    console.error("❌ Server error fetching reviews:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch reviews", details: err.message },
      { status: 500 }
    );
  }
}
