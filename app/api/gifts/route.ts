import { NextResponse } from "next/server";
import { sql } from "../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [claims, contributions] = await Promise.all([
      sql`
        SELECT gift_id, claimed_by, note, claimed_at
        FROM gift_claims
        ORDER BY claimed_at ASC
      `,
      sql`
        SELECT id, gift_id, contributor_name, amount, note, created_at
        FROM gift_contributions
        ORDER BY created_at ASC
      `,
    ]);

    // Group contributions by gift_id
    const contributionsByGift: Record<
      string,
      {
        total: number;
        items: Array<{
          id: number;
          contributor_name: string;
          amount: number;
          note: string | null;
          created_at: string;
        }>;
      }
    > = {};

    for (const c of contributions as Array<{
      id: number;
      gift_id: string;
      contributor_name: string;
      amount: string | number;
      note: string | null;
      created_at: string;
    }>) {
      if (!contributionsByGift[c.gift_id]) {
        contributionsByGift[c.gift_id] = { total: 0, items: [] };
      }
      const numAmount = Number(c.amount) || 0;
      contributionsByGift[c.gift_id].total += numAmount;
      contributionsByGift[c.gift_id].items.push({
        id: c.id,
        contributor_name: c.contributor_name,
        amount: numAmount,
        note: c.note,
        created_at: c.created_at,
      });
    }

    return NextResponse.json({
      claims,
      contributions: contributionsByGift,
    });
  } catch (error) {
    console.error("Error fetching gift data:", error);
    return NextResponse.json(
      { error: "Failed to fetch gift data" },
      { status: 500 }
    );
  }
}
