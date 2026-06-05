import { db } from "@/db";
import { events, seasons } from "@/db/schema";
import { eq, gte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const seasonId = req.nextUrl.searchParams.get("seasonId");
    const upcoming = req.nextUrl.searchParams.get("upcoming");

    let query = db.select().from(events);

    // Filter by season
    if (seasonId) {
        query = query.where(eq(events.seasonId, seasonId)) as typeof query;
    }

    // Filter upcoming only
    if (upcoming === "true") {
        query = query.where(gte(events.date, new Date())) as typeof query;
    }

    const all = await query.orderBy(events.date);
    return NextResponse.json(all);
}
