import { db } from "@/db";
import { eventSignups, guests, events } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    const { name, email } = await req.json();

    if (!name || !email) {
        return NextResponse.json({ error: "Nom et email requis." }, { status: 400 });
    }

    // Check event exists
    const event = await db.select().from(events).where(eq(events.id, eventId)).limit(1);

    if (!event[0]) {
        return NextResponse.json({ error: "Événement introuvable." }, { status: 404 });
    }

    // Find or create guest
    let guest = await db.select().from(guests).where(eq(guests.email, email)).limit(1);

    let guestId: string;
    if (guest[0]) {
        guestId = guest[0].id;
    } else {
        const newGuest = await db.insert(guests).values({ name, email }).returning();
        guestId = newGuest[0].id;
    }

    // Prevent duplicate signup
    const existing = await db
        .select()
        .from(eventSignups)
        .where(and(eq(eventSignups.eventId, eventId), eq(eventSignups.guestId, guestId)))
        .limit(1);

    if (existing[0]) {
        return NextResponse.json({ error: "Vous êtes déjà inscrit(e)." }, { status: 409 });
    }

    await db.insert(eventSignups).values({ eventId, guestId });
    return NextResponse.json({ success: true });
}
