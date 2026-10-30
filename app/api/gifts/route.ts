import { NextResponse } from "next/server";
import { sql } from "../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const claims = await sql`
      SELECT gift_id, claimed_by, note, claimed_at
      FROM gift_claims
      ORDER BY claimed_at ASC
    `;

    return NextResponse.json({ claims });
  } catch (error) {
    console.error("Error fetching gift claims:", error);
    return NextResponse.json({ error: "Failed to fetch gift claims" }, { status: 500 });
  }
}
