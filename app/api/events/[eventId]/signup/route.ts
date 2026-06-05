import { auth } from "@/lib/auth";
import { db } from "@/db";
import { eventSignups, events } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { eventId: string } }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if current user is signed up
    const signup = await db
        .select()
        .from(eventSignups)
        .where(and(eq(eventSignups.eventId, params.eventId), eq(eventSignups.userId, session.user.id)))
        .limit(1);

    // Get total signup count
    const all = await db.select().from(eventSignups).where(eq(eventSignups.eventId, params.eventId));

    return NextResponse.json({
        isSignedUp: signup.length > 0,
        totalSignups: all.length
    });
}

export async function POST(req: NextRequest, { params }: { params: { eventId: string } }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check event exists
    const event = await db.select().from(events).where(eq(events.id, params.eventId)).limit(1);

    if (!event[0]) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Prevent duplicate signup
    const existing = await db
        .select()
        .from(eventSignups)
        .where(and(eq(eventSignups.eventId, params.eventId), eq(eventSignups.userId, session.user.id)))
        .limit(1);

    if (existing[0]) {
        return NextResponse.json({ error: "Already signed up" }, { status: 409 });
    }

    await db.insert(eventSignups).values({
        eventId: params.eventId,
        userId: session.user.id
    });

    return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { eventId: string } }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
        .delete(eventSignups)
        .where(and(eq(eventSignups.eventId, params.eventId), eq(eventSignups.userId, session.user.id)));

    return NextResponse.json({ success: true });
}
