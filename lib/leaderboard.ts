import { db } from "@/db";
import { eventResults, events, seasonLeaderboard } from "@/db/schema";
import { and, eq, notInArray, sql } from "drizzle-orm";

export async function recomputeSeasonLeaderboard(seasonId: string) {
    // Aggregate points per user for this season (members only, guests have points=0)
    const aggregated = await db
        .select({
            userId: eventResults.userId,
            totalPoints: sql<number>`sum(${eventResults.points})`.as("total_points")
        })
        .from(eventResults)
        .innerJoin(events, eq(eventResults.eventId, events.id))
        .where(eq(events.seasonId, seasonId))
        .groupBy(eventResults.userId)
        .having(sql`${eventResults.userId} is not null`) // exclude guests
        .orderBy(sql`total_points desc`);


    // Assign ranks (handle ties — same points = same rank)
    let currentRank = 1;
    const ranked = aggregated.map((row, index) => {
        if (index < aggregated.length - 1 && row.totalPoints > aggregated[index + 1].totalPoints) {
            currentRank = index + 1;
        }
        return {
            seasonId,
            userId: row.userId!,
            totalPoints: row.totalPoints,
            rank: currentRank,
            updatedAt: new Date()
        };
    });

    const userIds = ranked.map((row) => row.userId);

    if (ranked.length > 0) {
        await db
            .insert(seasonLeaderboard)
            .values(ranked)
            .onConflictDoUpdate({
                target: [seasonLeaderboard.seasonId, seasonLeaderboard.userId],
                set: {
                    totalPoints: sql`excluded.total_points`,
                    rank: sql`excluded.rank`,
                    updatedAt: new Date()
                }
            });
    }

    if (userIds.length > 0) {
        await db.delete(seasonLeaderboard).where(
            and(eq(seasonLeaderboard.seasonId, seasonId), notInArray(seasonLeaderboard.userId, userIds))
        );
    } else {
        await db.delete(seasonLeaderboard).where(eq(seasonLeaderboard.seasonId, seasonId));
    }
}
