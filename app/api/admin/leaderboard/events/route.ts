import { auth } from "@/lib/auth";
import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const seasonId = req.nextUrl.searchParams.get("seasonId");

    const all = await db
        .select()
        .from(events)
        .where(seasonId ? eq(events.seasonId, seasonId) : undefined)
        .orderBy(events.date);

    return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { seasonId, name, type, date, time, location, memberPrice, guestPrice } = await req.json();

    const result = await db
        .insert(events)
        .values({
            seasonId,
            name,
            type,
            date: date ? new Date(date) : null,
            time,
            location,
            memberPrice: memberPrice ? Math.round(memberPrice * 100) : null,
            guestPrice: guestPrice ? Math.round(guestPrice * 100) : null
        })
        .returning();

    return NextResponse.json(result[0]);
}

export async function PATCH(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, type, date, time, location, memberPrice, guestPrice } = await req.json();

    await db
        .update(events)
        .set({
            ...(name !== undefined && { name }),
            ...(type !== undefined && { type }),
            ...(date !== undefined && { date: new Date(date) }),
            ...(time !== undefined && { time }),
            ...(location !== undefined && { location }),
            ...(memberPrice !== undefined && { memberPrice: Math.round(memberPrice * 100) }),
            ...(guestPrice !== undefined && { guestPrice: Math.round(guestPrice * 100) })
        })
        .where(eq(events.id, id));

    return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    await db.delete(events).where(eq(events.id, id));
    return NextResponse.json({ success: true });
}
