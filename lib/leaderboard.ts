import { db } from "@/db";
import { eventResults, events, seasonLeaderboard } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function recomputeSeasonLeaderboard(seasonId: string) {
    // Fetch all sport and défi results; only sport results are capped at six.
    const allResults = await db
        .select({
            userId: eventResults.userId,
            points: eventResults.points,
            type: events.type
        })
        .from(eventResults)
        .innerJoin(events, eq(eventResults.eventId, events.id))
        .where(eq(events.seasonId, seasonId))
        .orderBy(eventResults.userId);

    const sportsByUser = new Map<string, number[]>();
    const defisByUser = new Map<string, number[]>();

    for (const row of allResults) {
        if (!row.userId) continue;

        const scoresByUser = row.type === "sport" ? sportsByUser : defisByUser;
        const points = scoresByUser.get(row.userId) ?? [];
        points.push(Number(row.points ?? 0));
        scoresByUser.set(row.userId, points);
    }

    const userIds = new Set([...sportsByUser.keys(), ...defisByUser.keys()]);
    const aggregated = Array.from(userIds)
        .map((userId) => {
            const bestSixSports = (sportsByUser.get(userId) ?? [])
                .sort((a, b) => b - a)
                .slice(0, 6);
            const allDefis = defisByUser.get(userId) ?? [];

            return {
                userId,
                totalPoints: [...bestSixSports, ...allDefis].reduce((sum, point) => sum + point, 0)
            };
        })
        .sort((a, b) => b.totalPoints - a.totalPoints || a.userId.localeCompare(b.userId));

    // Assign ranks (handle ties — same points = same rank)
    let currentRank = 1;
    const ranked = aggregated.map((row, index) => {
        if (index > 0 && row.totalPoints !== aggregated[index - 1].totalPoints) {
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
