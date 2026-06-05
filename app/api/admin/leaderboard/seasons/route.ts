import { auth } from "@/lib/auth";
import { db } from "@/db";
import { seasons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const all = await db.select().from(seasons).orderBy(seasons.startDate);
    return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, startDate, endDate, isCurrent } = await req.json();

    if (isCurrent) {
        await db.update(seasons).set({ isCurrent: false });
    }

    const result = await db
        .insert(seasons)
        .values({
            name,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            isCurrent: isCurrent ?? false
        })
        .returning();

    return NextResponse.json(result[0]);
}

export async function PATCH(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, startDate, endDate, isCurrent } = await req.json();

    if (isCurrent) {
        await db.update(seasons).set({ isCurrent: false });
    }

    await db
        .update(seasons)
        .set({
            ...(name !== undefined && { name }),
            ...(startDate !== undefined && { startDate: new Date(startDate) }),
            ...(endDate !== undefined && { endDate: new Date(endDate) }),
            ...(isCurrent !== undefined && { isCurrent })
        })
        .where(eq(seasons.id, id));

    return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    await db.delete(seasons).where(eq(seasons.id, id));
    return NextResponse.json({ success: true });
}
