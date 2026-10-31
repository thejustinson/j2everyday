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
    const messages = await sql`
      SELECT id, sender_name, category, message, bible_reference, is_approved, created_at
      FROM wall_messages
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching admin messages:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, is_approved } = body;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const updated = await sql`
      UPDATE wall_messages
      SET is_approved = ${Boolean(is_approved)}
      WHERE id = ${Number(id)}
      RETURNING id, is_approved
    `;

    return NextResponse.json({ success: true, message: updated[0] });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await sql`
      DELETE FROM wall_messages
      WHERE id = ${Number(id)}
    `;

    return NextResponse.json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
