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
    const claims = await sql`
      SELECT id, gift_id, claimed_by, note, claimed_at
      FROM gift_claims
      ORDER BY claimed_at ASC
    `;

    return NextResponse.json({ claims });
  } catch (error) {
    console.error("Error fetching admin gift claims:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { giftId } = body;

    if (!giftId) {
      return NextResponse.json({ error: "Gift ID required" }, { status: 400 });
    }

    await sql`
      DELETE FROM gift_claims
      WHERE gift_id = ${giftId}
    `;

    return NextResponse.json({ success: true, message: "Gift claim released" });
  } catch (error) {
    console.error("Error deleting gift claim:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
