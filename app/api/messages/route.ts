import { NextResponse } from "next/server";
import { sql } from "../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const messages = await sql`
      SELECT id, sender_name, category, message, bible_reference, created_at
      FROM wall_messages
      WHERE is_approved = TRUE
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching wall messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { senderName, category, message, bibleReference } = body;

    const safeName = (senderName || "").trim();
    const safeMessage = (message || "").trim();
    const safeCategory = (category || "well_wishes").trim().toLowerCase();
    const safeRef = (bibleReference || "").trim() || null;

    if (!safeName) {
      return NextResponse.json(
        { error: "Please enter your name." },
        { status: 400 }
      );
    }

    if (!safeMessage) {
      return NextResponse.json(
        { error: "Please write a message, prayer, or bible verse." },
        { status: 400 }
      );
    }

    const inserted = await sql`
      INSERT INTO wall_messages (sender_name, category, message, bible_reference, is_approved)
      VALUES (${safeName}, ${safeCategory}, ${safeMessage}, ${safeRef}, TRUE)
      RETURNING id, sender_name, category, message, bible_reference, created_at
    `;

    return NextResponse.json({
      success: true,
      message: inserted[0],
    });
  } catch (error) {
    console.error("Error creating wall message:", error);
    return NextResponse.json(
      { error: "Failed to post message. Please try again." },
      { status: 500 }
    );
  }
}
