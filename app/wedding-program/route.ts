import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-static";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "wedding-program.pdf");

  try {
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="J2Everyday-Wedding-Program.pdf"',
        "Content-Length": fileBuffer.byteLength.toString(),
      },
    });
  } catch {
    return new NextResponse("Wedding program not found.", { status: 404 });
  }
}
