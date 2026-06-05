import { auth } from "@/lib/auth";
import { db } from "@/db";
import { eventResults, events, guests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { recomputeSeasonLeaderboard } from "@/lib/leaderboard";

export async function GET(req: NextRequest) {
    const eventId = req.nextUrl.searchParams.get("eventId");
    if (!eventId) return NextResponse.json([]);

    const results = await db.query.eventResults.findMany({
        where: eq(eventResults.eventId, eventId),
        with: {
            user: { columns: { id: true, name: true, email: true } },
            guest: { columns: { id: true, name: true } }
        },
        orderBy: (eventResults, { asc }) => [asc(eventResults.rank)]
    });

    return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId, results } = await req.json();

    // Delete existing results for clean overwrite
    await db.delete(eventResults).where(eq(eventResults.eventId, eventId));

    if (results.length > 0) {
        const processed = await Promise.all(
            results.map(async (r: any) => {
                let guestId = r.guestId ?? null;

                // Create guest record if new guest
                if (!r.userId && r.guestName && !guestId) {
                    const newGuest = await db
                        .insert(guests)
                        .values({ name: r.guestName, email: r.guestEmail ?? null })
                        .returning();
                    guestId = newGuest[0].id;
                }

                return {
                    eventId,
                    userId: r.userId || null,
                    guestId,
                    result: r.result ?? null,
                    rank: r.rank,
                    points: r.points ?? 0
                };
            })
        );

        await db.insert(eventResults).values(processed);
    }

    // Recompute season leaderboard
    const event = await db.select().from(events).where(eq(events.id, eventId)).limit(1);

    if (event[0]?.seasonId) {
        await recomputeSeasonLeaderboard(event[0].seasonId);
    }

    revalidateTag("leaderboard", "default");
    revalidateTag("events", "default");

    return NextResponse.json({ success: true });
}
