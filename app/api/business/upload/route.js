import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { imageUrl, mediaFormat, accessToken, accountId, locationId } =
      await req.json();

    if (!imageUrl)
      return NextResponse.json(
        { error: "imageUrl is required" },
        { status: 400 }
      );

    const payload = {
      mediaFormat, // PHOTO or VIDEO
      locationAssociation: { category: "COVER" },
      sourceUrl: imageUrl,
    };

    const googleRes = await fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/media`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await googleRes.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
