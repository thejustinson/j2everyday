import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";

export const dynamic = "force-dynamic";

function checkAuth(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD || "j2everyday2026";
  const authHeader = request.headers.get("x-admin-password");
  const url = new URL(request.url);
  const authQuery = url.searchParams.get("password");

  return authHeader === adminPassword || authQuery === adminPassword;
}

export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [claims, contributions] = await Promise.all([
      sql`
        SELECT id, gift_id, claimed_by, note, claimed_at
        FROM gift_claims
        ORDER BY claimed_at ASC
      `,
      sql`
        SELECT id, gift_id, contributor_name, amount, note, created_at
        FROM gift_contributions
        ORDER BY created_at DESC
      `,
    ]);

    return NextResponse.json({ claims, contributions });
  } catch (error) {
    console.error("Error fetching admin gift data:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { giftId, contributionId } = body;

    if (contributionId) {
      await sql`
        DELETE FROM gift_contributions
        WHERE id = ${Number(contributionId)}
      `;
      return NextResponse.json({ success: true, message: "Contribution deleted" });
    }

    if (giftId) {
      await sql`
        DELETE FROM gift_claims
        WHERE gift_id = ${giftId}
      `;
      return NextResponse.json({ success: true, message: "Gift claim released" });
    }

    return NextResponse.json(
      { error: "Gift ID or Contribution ID required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error deleting gift claim or contribution:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
