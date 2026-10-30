import { NextResponse } from "next/server";
import { sql } from "../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, url, file_key, uploader_name, note, chapter, is_approved, created_at
      FROM photos
      WHERE is_approved = true
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ photos: rows });
  } catch (error) {
    console.error("Error fetching approved photos:", error);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { photos, guestName, chapter, note } = body;

    if (!Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json({ error: "No photos provided" }, { status: 400 });
    }

    const safeName = (guestName || "A Loved Guest").trim();
    const safeChapter = (chapter || "Everyday Moments").trim();
    const safeNote = (note || "").trim();

    const inserted: unknown[] = [];

    for (const item of photos) {
      const url = typeof item === "string" ? item : item.url;
      const key = typeof item === "object" ? item.key || item.file_key || null : null;

      if (!url) continue;

      const result = await sql`
        INSERT INTO photos (url, file_key, uploader_name, note, chapter, is_approved)
        VALUES (${url}, ${key}, ${safeName}, ${safeNote}, ${safeChapter}, false)
        RETURNING id, url, uploader_name, note, chapter, is_approved, created_at
      `;
      inserted.push(result[0]);
    }

    return NextResponse.json({ success: true, count: inserted.length, photos: inserted });
  } catch (error) {
    console.error("Error saving photos:", error);
    return NextResponse.json({ error: "Failed to save photos" }, { status: 500 });
  }
}
