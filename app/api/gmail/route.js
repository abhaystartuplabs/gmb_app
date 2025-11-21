import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "No access token found" }, { status: 401 });
  }

  try {
    // Fetch list of messages
    const messagesRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10",
      {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      }
    );
    const messagesData = await messagesRes.json();

    if (!messagesData.messages || messagesData.messages.length === 0) {
      return NextResponse.json({ messages: [] });
    }

    // Fetch details of each message
    const messages = await Promise.all(
      messagesData.messages.map(async (msg) => {
        const res = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
          {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          }
        );
        const data = await res.json();

        // Parse headers
        const headers = data.payload?.headers || [];
        const from = headers.find((h) => h.name === "From")?.value || "";
        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        const date = headers.find((h) => h.name === "Date")?.value || "";

        return { id: msg.id, from, subject, date };
      })
    );

    return NextResponse.json({ messages });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
