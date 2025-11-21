import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "No access token found" },
      { status: 401 }
    );
  }

  try {
    // 1️⃣ Get list of messages (latest 10)
    const listRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10",
      {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      }
    );
    const listData = await listRes.json();

    if (!listData.messages) {
      return NextResponse.json({ messages: [] });
    }

    // 2️⃣ Fetch **full details** of each message in parallel
    const messagesFull = await Promise.all(
      listData.messages.map(async (msg) => {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
          {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          }
        );
        const msgData = await msgRes.json();
        return msgData; // send everything Gmail returns
      })
    );

    return NextResponse.json({ messages: messagesFull });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
