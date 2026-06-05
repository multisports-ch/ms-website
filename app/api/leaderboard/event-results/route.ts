import { db } from "@/db";
import { eventResults, users, guests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const eventId = req.nextUrl.searchParams.get("eventId");
    if (!eventId) return NextResponse.json([]);

    const results = await db
        .select({
            rank: eventResults.rank,
            points: eventResults.points,
            result: eventResults.result,
            userId: eventResults.userId,
            guestId: eventResults.guestId,
            userName: users.name,
            guestName: guests.name
        })
        .from(eventResults)
        .leftJoin(users, eq(eventResults.userId, users.id))
        .leftJoin(guests, eq(eventResults.guestId, guests.id))
        .where(eq(eventResults.eventId, eventId))
        .orderBy(eventResults.rank);

    return NextResponse.json(results);
}
