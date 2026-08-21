import { auth } from "@/lib/auth";
import { db } from "@/db";
import { eventSignups } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ signupId: string }> }
) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { signupId } = await params;
    const signup = await db
        .select({ id: eventSignups.id, guestId: eventSignups.guestId, userId: eventSignups.userId })
        .from(eventSignups)
        .where(eq(eventSignups.id, signupId))
        .limit(1);

    if (!signup[0]) {
        return NextResponse.json({ error: "Inscription introuvable." }, { status: 404 });
    }

    if (!signup[0].guestId || signup[0].userId) {
        return NextResponse.json({ error: "Les inscriptions des membres ne peuvent pas être supprimées." }, { status: 403 });
    }

    await db.delete(eventSignups).where(eq(eventSignups.id, signupId));
    return NextResponse.json({ success: true });
}