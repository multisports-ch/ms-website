import { db } from "@/db";
import { eventResults, events, seasonLeaderboard } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function recomputeSeasonLeaderboard(seasonId: string) {
    // Fetch all event results for the season and keep each member's best 6 scores
    const allResults = await db
        .select({
            userId: eventResults.userId,
            points: eventResults.points
        })
        .from(eventResults)
        .innerJoin(events, eq(eventResults.eventId, events.id))
        .where(and(eq(events.seasonId, seasonId), eq(events.type, "sport")))
        .orderBy(eventResults.userId);

    const totalsByUser = new Map<string, number[]>();

    for (const row of allResults) {
        if (!row.userId) continue;

        const existingPoints = totalsByUser.get(row.userId) ?? [];
        existingPoints.push(Number(row.points ?? 0));
        totalsByUser.set(row.userId, existingPoints);
    }

    const aggregated = Array.from(totalsByUser.entries())
        .map(([userId, points]) => {
            const bestSix = [...points]
                .sort((a, b) => b - a)
                .slice(0, 6);

            return {
                userId,
                totalPoints: bestSix.reduce((sum, point) => sum + point, 0)
            };
        })
        .sort((a, b) => b.totalPoints - a.totalPoints || a.userId.localeCompare(b.userId));

    // Assign ranks (handle ties — same points = same rank)
    let currentRank = 1;
    const ranked = aggregated.map((row, index) => {
        if (index < aggregated.length - 1 && row.totalPoints > aggregated[index + 1].totalPoints) {
            currentRank = index + 1;
        }
        if (index == aggregated.length - 1 && row.totalPoints < aggregated[index - 1].totalPoints) {
            currentRank = index + 1;
        }
        return {
            seasonId,
            userId: row.userId,
            totalPoints: row.totalPoints,
            rank: currentRank,
            updatedAt: new Date()
        };
    });

    // Full replace for this season
    await db.delete(seasonLeaderboard).where(eq(seasonLeaderboard.seasonId, seasonId));

    if (ranked.length > 0) {
        await db.insert(seasonLeaderboard).values(ranked);
    }
}
