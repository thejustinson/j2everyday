import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { giftId, guestName, note } = body;

    if (!giftId || !guestName?.trim()) {
      return NextResponse.json(
        { error: "Gift ID and your name are required." },
        { status: 400 }
      );
    }

    const safeGiftId = giftId.trim();
    const safeName = guestName.trim();
    const safeNote = note?.trim() || null;

    // Check if already claimed
    const existing = await sql`
      SELECT id, claimed_by FROM gift_claims WHERE gift_id = ${safeGiftId}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        {
          error: `This gift has already been claimed by ${existing[0].claimed_by}. Thank you!`,
          alreadyClaimed: true,
          claimedBy: existing[0].claimed_by,
        },
        { status: 409 }
      );
    }

    const inserted = await sql`
      INSERT INTO gift_claims (gift_id, claimed_by, note)
      VALUES (${safeGiftId}, ${safeName}, ${safeNote})
      RETURNING gift_id, claimed_by, note, claimed_at
    `;

    return NextResponse.json({
      success: true,
      claim: inserted[0],
    });
  } catch (error) {
    console.error("Error claiming gift:", error);
    return NextResponse.json(
      { error: "Failed to record gift claim. Please try again." },
      { status: 500 }
    );
  }
}
