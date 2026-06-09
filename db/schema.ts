import { pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// AUTH TABLES — required by Auth.js Drizzle adapter
// ============================================================

export const users = pgTable("users", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull().unique(),
    password: text("password"),
    role: text("role").$type<"member" | "admin">().notNull().default("member"),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull()
});

// ============================================================
// CONTENT BLOCKS
// ============================================================

export const contentBlocks = pgTable("content_blocks", {
    id: text("id").primaryKey(),
    page: text("page").notNull(),
    label: text("label").notNull(),
    text: text("text"),
    imageUrl: text("image_url"),
    imageFileId: text("image_file_id"),
    imageAlt: text("image_alt"),
    fileUrl: text("file_url"), // add this
    fileFileId: text("file_file_id"), // add this
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// ============================================================
// COMMITTEE MEMBERS
// ============================================================

export const committeeMembers = pgTable("committee_members", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    role: text("role").notNull(),
    description: text("description"),
    photoUrl: text("photo_url"),
    photoFileId: text("photo_file_id"),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull()
});

// ============================================================
// SEASONS
// ============================================================

export const seasons = pgTable("seasons", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    startDate: timestamp("start_date", { mode: "date" }),
    endDate: timestamp("end_date", { mode: "date" }),
    isCurrent: boolean("is_current").notNull().default(false)
});

// ============================================================
// EVENTS
// ============================================================

export const events = pgTable("events", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    seasonId: text("season_id").references(() => seasons.id, { onDelete: "cascade" }),
    name: text("name"),
    type: text("type").$type<"sport" | "defi">().notNull(),
    date: timestamp("date", { mode: "date" }),
    time: text("time"),
    location: text("location"),
    memberPrice: integer("member_price"),
    guestPrice: integer("guest_price")
});

// ============================================================
// GUESTS
// ============================================================

export const guests = pgTable("guests", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    email: text("email")
});

// ============================================================
// EVENT SIGNUPS
// ============================================================

export const eventSignups = pgTable("event_signups", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    eventId: text("event_id")
        .notNull()
        .references(() => events.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    guestId: text("guest_id").references(() => guests.id, { onDelete: "cascade" }),
    signedUpAt: timestamp("signed_up_at").defaultNow().notNull()
});

// ============================================================
// EVENT RESULTS
// ============================================================

export const eventResults = pgTable("event_results", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    eventId: text("event_id")
        .notNull()
        .references(() => events.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    guestId: text("guest_id").references(() => guests.id, { onDelete: "cascade" }),
    result: text("result"),
    rank: integer("rank").notNull(),
    points: integer("points").notNull().default(0)
});

// ============================================================
// SEASON LEADERBOARD — precomputed totals per member per season
// Recomputed every time admin saves event results
// ============================================================

export const seasonLeaderboard = pgTable("season_leaderboard", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    seasonId: text("season_id")
        .notNull()
        .references(() => seasons.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    totalPoints: integer("total_points").notNull().default(0),
    rank: integer("rank").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// ============================================================
// NEWS
// ============================================================
export const news = pgTable("news", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    body: text("body"),
    publishedAt: timestamp("published_at").defaultNow().notNull(),
    visible: boolean("visible").notNull().default(true)
});

export const newsImages = pgTable("news_images", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    newsId: text("news_id")
        .notNull()
        .references(() => news.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    imageFileId: text("image_file_id"),
    order: integer("order").notNull().default(0)
});

// ============================================================
// CONTACT FORM SUBMISSIONS
// ============================================================

export const contactSubmissions = pgTable("contact_submissions", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    email: text("email").notNull(),
    message: text("message").notNull(),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
    read: boolean("read").notNull().default(false)
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    usedAt: timestamp("used_at", { mode: "date" })
});

// ============================================================
// RELATIONS
// ============================================================

export const eventResultsRelations = relations(eventResults, ({ one }) => ({
    user: one(users, {
        fields: [eventResults.userId],
        references: [users.id]
    }),
    guest: one(guests, {
        fields: [eventResults.guestId],
        references: [guests.id]
    }),
    event: one(events, {
        fields: [eventResults.eventId],
        references: [events.id]
    })
}));

export const eventSignupsRelations = relations(eventSignups, ({ one }) => ({
    user: one(users, {
        fields: [eventSignups.userId],
        references: [users.id]
    }),
    guest: one(guests, {
        fields: [eventSignups.guestId],
        references: [guests.id]
    }),
    event: one(events, {
        fields: [eventSignups.eventId],
        references: [events.id]
    })
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
    season: one(seasons, {
        fields: [events.seasonId],
        references: [seasons.id]
    }),
    results: many(eventResults),
    signups: many(eventSignups)
}));

export const seasonsRelations = relations(seasons, ({ many }) => ({
    events: many(events)
}));

export const seasonLeaderboardRelations = relations(seasonLeaderboard, ({ one }) => ({
    season: one(seasons, {
        fields: [seasonLeaderboard.seasonId],
        references: [seasons.id]
    }),
    user: one(users, {
        fields: [seasonLeaderboard.userId],
        references: [users.id]
    })
}));

export const newsImagesRelations = relations(newsImages, ({ one }) => ({
    news: one(news, {
        fields: [newsImages.newsId],
        references: [news.id]
    })
}));

export const newsRelations = relations(news, ({ many }) => ({
    images: many(newsImages)
}));
