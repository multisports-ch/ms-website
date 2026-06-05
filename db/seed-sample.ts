import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./index";
import { users, seasons, events, eventResults, eventSignups, seasonLeaderboard, guests } from "./schema";

async function main() {
    console.log("Seeding sample data...");

    // ============================================================
    // MEMBERS
    // ============================================================
    const password = await bcrypt.hash("password123", 12);

    const memberData = [
        { name: "Jean Dupont", email: "jean@example.com" },
        { name: "Marie Martin", email: "marie@example.com" },
        { name: "Luc Bernard", email: "luc@example.com" },
        { name: "Sophie Durand", email: "sophie@example.com" },
        { name: "Thomas Petit", email: "thomas@example.com" },
        { name: "Clara Moreau", email: "clara@example.com" }
    ];

    const insertedMembers = await db
        .insert(users)
        .values(memberData.map((m) => ({ ...m, password, role: "member" as const })))
        .onConflictDoNothing()
        .returning();

    console.log(`Inserted ${insertedMembers.length} members`);

    // Fetch all members including any that already existed
    const allMembers = await db.select().from(users);
    const members = allMembers.filter((u) => u.role === "member");

    // ============================================================
    // GUESTS
    // ============================================================
    const insertedGuests = await db
        .insert(guests)
        .values([
            { name: "Alex Invité", email: "alex.invite@example.com" },
            { name: "Laura Invitée", email: "laura.invite@example.com" }
        ])
        .onConflictDoNothing()
        .returning();

    console.log(`Inserted ${insertedGuests.length} guests`);
    const allGuests = await db.select().from(guests);

    // ============================================================
    // PAST SEASON — 2023-2024
    // ============================================================
    const [pastSeason] = await db
        .insert(seasons)
        .values({
            name: "2023-2024",
            startDate: new Date("2023-08-01"),
            endDate: new Date("2024-06-30"),
            isCurrent: false
        })
        .onConflictDoNothing()
        .returning();

    // ============================================================
    // CURRENT SEASON — 2024-2025
    // ============================================================
    const [currentSeason] = await db
        .insert(seasons)
        .values({
            name: "2024-2025",
            startDate: new Date("2024-08-01"),
            endDate: new Date("2025-06-30"),
            isCurrent: true
        })
        .onConflictDoNothing()
        .returning();

    console.log("Inserted seasons");

    if (!currentSeason || !pastSeason) {
        console.log("Seasons already exist, skipping events");
        process.exit(0);
    }

    // ============================================================
    // CURRENT SEASON EVENTS
    // ============================================================
    const currentEvents = await db
        .insert(events)
        .values([
            // Block 1 — Volleyball
            {
                seasonId: currentSeason.id,
                name: "Volleyball",
                type: "sport",
                date: new Date("2024-10-15"),
                time: "19:00",
                location: "Salle des sports, Lausanne",
                memberPrice: 500,
                guestPrice: 800
            },
            {
                seasonId: currentSeason.id,
                name: "Laser Game",
                type: "defi",
                date: new Date("2024-10-18"),
                time: "20:00",
                location: "Laser Arena, Lausanne",
                memberPrice: 1000,
                guestPrice: 1200
            },
            // Block 2 — Badminton
            {
                seasonId: currentSeason.id,
                name: "Badminton",
                type: "sport",
                date: new Date("2024-12-03"),
                time: "19:30",
                location: "Gymnase du Collège, Lausanne",
                memberPrice: 500,
                guestPrice: 800
            },
            {
                seasonId: currentSeason.id,
                name: "Bowling",
                type: "defi",
                date: new Date("2024-12-06"),
                time: "20:00",
                location: "Bowling Club, Lausanne",
                memberPrice: 800,
                guestPrice: 1000
            },
            // Block 3 — Pickleball (upcoming)
            {
                seasonId: currentSeason.id,
                name: "Pickleball",
                type: "sport",
                date: new Date("2025-02-11"),
                time: "19:00",
                location: "Centre sportif, Lausanne",
                memberPrice: 500,
                guestPrice: 800
            },
            {
                seasonId: currentSeason.id,
                name: "Curling",
                type: "defi",
                date: new Date("2025-02-14"),
                time: "18:00",
                location: "Patinoire de Lausanne",
                memberPrice: 1200,
                guestPrice: 1500
            }
        ])
        .returning();

    console.log(`Inserted ${currentEvents.length} current season events`);

    // ============================================================
    // PAST SEASON EVENTS
    // ============================================================
    const pastEvents = await db
        .insert(events)
        .values([
            {
                seasonId: pastSeason.id,
                name: "Football",
                type: "sport",
                date: new Date("2023-10-10"),
                time: "19:00",
                location: "Stade de la Pontaise, Lausanne",
                memberPrice: 500,
                guestPrice: 800
            },
            {
                seasonId: pastSeason.id,
                name: "Escape Room",
                type: "defi",
                date: new Date("2023-10-13"),
                time: "20:00",
                location: "Escape World, Lausanne",
                memberPrice: 1500,
                guestPrice: 1800
            },
            {
                seasonId: pastSeason.id,
                name: "Basketball",
                type: "sport",
                date: new Date("2023-12-05"),
                time: "19:00",
                location: "Salle omnisports, Lausanne",
                memberPrice: 500,
                guestPrice: 800
            },
            {
                seasonId: pastSeason.id,
                name: "Karting",
                type: "defi",
                date: new Date("2023-12-08"),
                time: "18:00",
                location: "Karting de Lausanne",
                memberPrice: 2000,
                guestPrice: 2500
            }
        ])
        .returning();

    console.log(`Inserted ${pastEvents.length} past season events`);

    // ============================================================
    // EVENT RESULTS — only for past events (first 4 current events)
    // ============================================================
    const pointsTable: Record<number, number> = {
        1: 20,
        2: 16,
        3: 13,
        4: 11,
        5: 9,
        6: 7,
        7: 5,
        8: 3
    };

    function getPoints(rank: number): number {
        return pointsTable[rank] ?? Math.max(1, 3 - (rank - 8));
    }

    // Events that have already happened in current season
    const completedCurrentEvents = currentEvents.slice(0, 4);

    // All past season events
    const allCompletedEvents = [...completedCurrentEvents, ...pastEvents];

    function getResult(eventName: string | null, rank: number): string {
        const name = eventName?.toLowerCase() ?? "";

        if (name.includes("volleyball")) {
            const wins = Math.max(0, 8 - rank);
            return `${wins} victoire${wins !== 1 ? "s" : ""}`;
        }
        if (name.includes("laser")) {
            const elims = Math.max(0, 30 - rank * 3 + Math.floor(Math.random() * 5));
            return `${elims} éliminations`;
        }
        if (name.includes("bowling")) {
            const score = Math.max(50, 220 - rank * 15 + Math.floor(Math.random() * 10));
            return `${score} pts`;
        }
        if (name.includes("badminton")) {
            const wins = Math.max(0, 7 - rank);
            return `${wins} victoire${wins !== 1 ? "s" : ""}`;
        }
        if (name.includes("football")) {
            const wins = Math.max(0, 6 - rank);
            return `${wins} victoire${wins !== 1 ? "s" : ""}`;
        }
        if (name.includes("escape")) {
            const minutes = 20 + rank * 3 + Math.floor(Math.random() * 5);
            return `${minutes} min`;
        }
        if (name.includes("basketball")) {
            const points = Math.max(5, 40 - rank * 4 + Math.floor(Math.random() * 8));
            return `${points} pts`;
        }
        if (name.includes("karting")) {
            const seconds = 45 + rank * 2 + Math.floor(Math.random() * 3);
            const ms = Math.floor(Math.random() * 999)
                .toString()
                .padStart(3, "0");
            return `${seconds}.${ms}s`;
        }
        if (name.includes("curling")) {
            const score = Math.max(1, 10 - rank);
            return `${score} pts`;
        }
        if (name.includes("pickleball")) {
            const wins = Math.max(0, 7 - rank);
            return `${wins} victoire${wins !== 1 ? "s" : ""}`;
        }

        return `${Math.max(1, 100 - rank * 8)} pts`;
    }

    for (const event of allCompletedEvents) {
        const shuffled = [...members].sort(() => Math.random() - 0.5);

        const resultRows: {
            eventId: string;
            userId: string | null;
            guestId: string | null;
            rank: number;
            points: number;
            result: string | null;
        }[] = shuffled.map((member, index) => ({
            eventId: event.id,
            userId: member.id,
            guestId: null,
            rank: index + 1,
            points: getPoints(index + 1),
            result: getResult(event.name, index + 1)
        }));

        if (allGuests.length > 0 && Math.random() > 0.5) {
            const guest = allGuests[Math.floor(Math.random() * allGuests.length)];
            resultRows.push({
                eventId: event.id,
                userId: null,
                guestId: guest.id,
                rank: resultRows.length + 1,
                points: 0,
                result: getResult(event.name, resultRows.length + 1)
            });
        }

        await db.insert(eventResults).values(resultRows).onConflictDoNothing();
    }

    console.log("Inserted event results");

    // ============================================================
    // EVENT SIGNUPS — for upcoming events
    // ============================================================
    const upcomingEvents = currentEvents.slice(4); // Pickleball + Curling

    for (const event of upcomingEvents) {
        const signupRows = members.slice(0, 4).map((member) => ({
            eventId: event.id,
            userId: member.id,
            guestId: null
        }));
        await db.insert(eventSignups).values(signupRows).onConflictDoNothing();
    }

    console.log("Inserted event signups");

    // ============================================================
    // COMPUTE SEASON LEADERBOARDS
    // ============================================================
    async function computeLeaderboard(seasonId: string, seasonEvents: typeof currentEvents) {
        const completedEvents = seasonEvents.filter((e) => e.date && new Date(e.date) < new Date());

        // Aggregate points per member
        const pointsMap: Record<string, number> = {};

        for (const event of completedEvents) {
            const results = await db
                .select()
                .from(eventResults)
                .then((all) => all.filter((r) => r.eventId === event.id && r.userId));

            for (const result of results) {
                if (!result.userId) continue;
                pointsMap[result.userId] = (pointsMap[result.userId] ?? 0) + result.points;
            }
        }

        // Sort and rank
        const sorted = Object.entries(pointsMap).sort(([, a], [, b]) => b - a);

        let currentRank = 1;
        const leaderboardRows = sorted.map(([userId, totalPoints], index) => {
            if (index > 0 && totalPoints < sorted[index - 1][1]) {
                currentRank = index + 1;
            }
            return {
                seasonId,
                userId,
                totalPoints,
                rank: currentRank,
                updatedAt: new Date()
            };
        });

        if (leaderboardRows.length > 0) {
            await db.insert(seasonLeaderboard).values(leaderboardRows).onConflictDoNothing();
        }
    }

    await computeLeaderboard(currentSeason.id, currentEvents);
    await computeLeaderboard(pastSeason.id, pastEvents);

    console.log("Computed leaderboards");
    console.log("✅ Sample data seeded successfully!");
    console.log("");
    console.log("Member logins (password: password123):");
    memberData.forEach((m) => console.log(` - ${m.email}`));

    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
