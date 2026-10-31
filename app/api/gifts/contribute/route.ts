import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";
import { GIFTS } from "../../../lib/config";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { giftId, contributorName, amount, note } = body;

    if (!giftId || typeof giftId !== "string") {
      return NextResponse.json(
        { error: "A valid Gift ID is required." },
        { status: 400 }
      );
    }

    const safeName = (contributorName || "").trim();
    if (!safeName) {
      return NextResponse.json(
        { error: "Please provide your name." },
        { status: 400 }
      );
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { error: "Please enter a valid contribution amount greater than 0." },
        { status: 400 }
      );
    }

    const safeNote = note?.trim() || null;
    const safeGiftId = giftId.trim();

    // Insert contribution
    const inserted = await sql`
      INSERT INTO gift_contributions (gift_id, contributor_name, amount, note)
      VALUES (${safeGiftId}, ${safeName}, ${numAmount}, ${safeNote})
      RETURNING id, gift_id, contributor_name, amount, note, created_at
    `;

    // Calculate total contributions for this gift
    const totalRow = await sql`
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM gift_contributions
      WHERE gift_id = ${safeGiftId}
    `;

    const totalContributed = Number(totalRow[0]?.total || 0);

    // Find gift target amount from config
    const giftConfig = GIFTS.find((g) => g.id === safeGiftId);
    const targetAmount = giftConfig ? giftConfig.targetAmount : 0;
    const isFullyFunded = targetAmount > 0 && totalContributed >= targetAmount;

    // If fully funded and not already in gift_claims, also add a claim record
    if (isFullyFunded) {
      const existingClaim = await sql`
        SELECT id FROM gift_claims WHERE gift_id = ${safeGiftId}
      `;
      if (existingClaim.length === 0) {
        await sql`
          INSERT INTO gift_claims (gift_id, claimed_by, note)
          VALUES (${safeGiftId}, ${safeName}, ${safeNote})
        `;
      }
    }

    return NextResponse.json({
      success: true,
      contribution: inserted[0],
      totalContributed,
      isFullyFunded,
    });
  } catch (error) {
    console.error("Error creating gift contribution:", error);
    return NextResponse.json(
      { error: "Failed to record contribution. Please try again." },
      { status: 500 }
    );
  }
}
