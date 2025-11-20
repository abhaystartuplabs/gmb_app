// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../../auth/[...nextauth]/route";
// import { NextResponse } from "next/server";

// export async function GET() {
//   console.log("🔹 API Route Called: /api/business/attributes");

//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.accessToken) {
//       return NextResponse.json(
//         { error: "Unauthorized: Missing access token" },
//         { status: 401 }
//       );
//     }

//     // Call the GMB API endpoint securely on the server
//     const url = "https://mybusinessbusinessinformation.googleapis.com/v1/attributes?showAll=true&regionCode=IN&languageCode=en";
    
//     const res = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${session.accessToken}`,
//       },
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       console.error("Google API Error:", data);
//       return NextResponse.json(
//         { error: data.error?.message || "Google API Error", details: data },
//         { status: res.status }
//       );
//     }

//     return NextResponse.json({ success: true, attributes: data.attributeMetadata || [] });
//   } catch (err) {
//     console.error("❌ Server error fetching attributes:", err.message);
//     return NextResponse.json(
//       { error: "Failed to fetch attributes", details: err.message },
//       { status: 500 }
//     );
//   }
// }



// app/api/business/attributes/route.js (Fetching ALL possible Attribute Metadata)

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("🔹 API Route Called: /api/business/attributes (General Metadata)");

  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });
    const businessInfo = google.mybusinessbusinessinformation({ version: "v1", auth });

    // 1️⃣ Call the general Attribute list endpoint
    const res = await businessInfo.attributes.list({
      // We pass region and language to filter the available attributes
      regionCode: "IN", 
      languageCode: "en", 
      showAll: true, // Request all attributes, even if not applicable to a specific category
    });
    
    // This API returns 'attributeMetadata' which is a list of all attribute definitions
    const attributeMetadata = res.data.attributeMetadata || []; 

    return NextResponse.json({
      success: true,
      attributes: attributeMetadata, // This is a list of attribute schemas
      type: "Metadata"
    });
  } catch (error) {
    console.error("❌ Server error fetching attribute metadata:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch attribute metadata", details: error.message },
      { status: 500 }
    );
  }
}