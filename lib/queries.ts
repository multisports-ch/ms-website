import { unstable_cache } from "next/cache";
import { db } from "@/db";
import {
    contentBlocks,
    committeeMembers,
    seasonLeaderboard,
    seasons,
    events,
    eventResults,
    users,
    guests
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const getContentBlock = unstable_cache(
    async (id: string) => {
        const result = await db.select().from(contentBlocks).where(eq(contentBlocks.id, id)).limit(1);
        return result[0] ?? null;
    },
    ["content-block"],
    { revalidate: 3600, tags: ["content-blocks"] }
);

export const getCommitteeMembers = unstable_cache(
    async () => db.select().from(committeeMembers).orderBy(committeeMembers.order),
    ["committee-members"],
    { revalidate: 3600, tags: ["committee-members"] }
);

export const getAllSeasons = unstable_cache(
    async () => db.select().from(seasons).orderBy(desc(seasons.startDate)),
    ["seasons"],
    { revalidate: 3600, tags: ["seasons"] }
);

export const getCurrentSeason = unstable_cache(
    async () => {
        const result = await db.select().from(seasons).where(eq(seasons.isCurrent, true)).limit(1);
        return result[0] ?? null;
    },
    ["current-season"],
    { revalidate: 3600, tags: ["seasons"] }
);

export const getSeasonLeaderboard = unstable_cache(
    async (seasonId: string) => {
        return db
            .select({
                rank: seasonLeaderboard.rank,
                totalPoints: seasonLeaderboard.totalPoints,
                userId: seasonLeaderboard.userId,
                userName: users.name,
                userEmail: users.email
            })
            .from(seasonLeaderboard)
            .innerJoin(users, eq(seasonLeaderboard.userId, users.id))
            .where(eq(seasonLeaderboard.seasonId, seasonId))
            .orderBy(seasonLeaderboard.rank);
    },
    ["season-leaderboard"],
    { revalidate: 3600, tags: ["leaderboard"] }
);

export const getSeasonEvents = unstable_cache(
    async (seasonId: string) => {
        return db.select().from(events).where(eq(events.seasonId, seasonId)).orderBy(events.date);
    },
    ["season-events"],
    { revalidate: 3600, tags: ["events"] }
);

export const getEventResults = unstable_cache(
    async (eventId: string) => {
        return db
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
    },
    ["event-results"],
    { revalidate: 3600, tags: ["leaderboard"] }
);

export const getMemberEventPoints = unstable_cache(
    async (seasonId: string) => {
        // Returns all event results for members in a season
        // Used to build per-event columns in the leaderboard table
        return db
            .select({
                userId: eventResults.userId,
                eventId: eventResults.eventId,
                points: eventResults.points
            })
            .from(eventResults)
            .innerJoin(events, eq(eventResults.eventId, events.id))
            .where(eq(events.seasonId, seasonId));
    },
    ["member-event-points"],
    { revalidate: 3600, tags: ["leaderboard"] }
);
