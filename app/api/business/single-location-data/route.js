import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import axios from "axios";

const BASE_V1 = "https://mybusinessbusinessinformation.googleapis.com/v1";
const BASE_V4 = "https://mybusiness.googleapis.com/v4";
const BASE_ACCOUNTS = "https://mybusinessaccountmanagement.googleapis.com/v1";

// 🔹 Safe fetch helper for external Google APIs
const fetchApiData = async (url, accessToken, label) => {
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.ok) return await res.json();
    console.warn(`⚠️ ${label} failed (${res.status}): ${url}`);
    return null;
  } catch (err) {
    console.error(`❌ ${label} fetch error:`, err.message);
    return null;
  }
};

export async function GET(request) {
  console.log("🔹 API: /api/business/single-location-data");

  try {
    // 1️⃣ Verify session
    const session = await getServerSession(authOptions);
    if (!session?.accessToken)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const accessToken = session.accessToken;

    // 2️⃣ Parse query params
    const { searchParams } = new URL(request.url);
    let accountId = searchParams.get("accountId");
    let locationId = searchParams.get("locationId");

    // 3️⃣ Resolve account dynamically if not provided
    if (!accountId) {
      const accRes = await axios.get(`${BASE_ACCOUNTS}/accounts`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      accountId = accRes.data?.accounts?.[0]?.name;
      if (!accountId) throw new Error("No Google Business accounts found.");
    }

    // 4️⃣ Resolve location dynamically if not provided
    if (!locationId) {
      const locRes = await axios.get(
        `${BASE_V1}/${accountId}/locations?read_mask=name,title,storefrontAddress,latlng`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const firstLocation = locRes.data?.locations?.[0];
      if (!firstLocation)
        throw new Error("No locations found for this account.");
      locationId = firstLocation.name.split("/").pop();
    }

    const LOCATION_NAME = `${accountId}/locations/${locationId}`;
    console.log("📍 Using:", LOCATION_NAME);

    // 5️⃣ Define endpoints for all sub-data
    const reviewsUrl = `${BASE_V4}/${LOCATION_NAME}/reviews?pageSize=20`;
    const photosUrl = `${BASE_V4}/${LOCATION_NAME}/media`;
    const generalAttrUrl = `${BASE_V1}/attributes?region_code=IN&language_code=en`;
    const categoryAttrUrl = `${BASE_V1}/attributes?category_name=gcid:corporate_office&region_code=IN&language_code=en`;
    const locationDetailsUrl = `${BASE_V1}/${LOCATION_NAME}?read_mask=name,title,storefrontAddress,latlng,regularHours,primaryPhone`;

    console.log("reviewsUrl:-",reviewsUrl)
    console.log("photosUrl:-",photosUrl)
    console.log("generalAttrUrl:-",generalAttrUrl)
    console.log("categoryAttrUrl:-",categoryAttrUrl)
    console.log("locationDetailsUrl:-",categoryAttrUrl)

    // 6️⃣ Parallel API calls
    const [
      reviewsData,
      photosData,
      generalAttributes,
      categoryAttributes,
      locationData,
    ] = await Promise.all([
      fetchApiData(reviewsUrl, accessToken, "Reviews"),
      fetchApiData(photosUrl, accessToken, "Photos"),
      fetchApiData(generalAttrUrl, accessToken, "General Attributes"),
      fetchApiData(categoryAttrUrl, accessToken, "Category Attributes"),
      fetchApiData(locationDetailsUrl, accessToken, "Location Details"),
    ]);

    // 7️⃣ Merge attributes safely
    const mergedAttributes = [
      ...(generalAttributes?.attributeMetadata || []),
      ...(categoryAttributes?.attributeMetadata || []),
    ];

    // 8️⃣ Build unified location object
    const coreLocation = {
      name: LOCATION_NAME,
      title:
        locationData?.title ||
        locationData?.locationName ||
        photosData?.locationName ||
        "Unknown Location",
      primaryPhone: locationData?.primaryPhone || "N/A",
      address:
        locationData?.storefrontAddress || {
          addressLines: ["Address not available"],
          regionCode: "IN",
        },
      regularHours: locationData?.regularHours || null,
      latlng: locationData?.latlng || null,
    };

    // ✅ 9️⃣ Return combined, structured data
    return NextResponse.json(
      {
        success: true,
        location: coreLocation,
        reviews: reviewsData?.reviews || [],
        photos: photosData?.mediaItems || [],
        attributesMetadata: mergedAttributes,
        source: "Dynamic Aggregated Data (v1 + v4)",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in single-location-data:", error.message);
    const statusCode = error.response?.status || 500;
    const errMsg = error.response?.data || { message: error.message };
    return NextResponse.json({ error: errMsg }, { status: statusCode });
  }
}
