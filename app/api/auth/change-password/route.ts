import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (newPassword.length < 8) {
        return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères." }, { status: 400 });
    }

    const user = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);

    if (!user[0]?.password) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(currentPassword, user[0].password);
    if (!valid) {
        return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await db.update(users).set({ password: hashed }).where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true });
}
