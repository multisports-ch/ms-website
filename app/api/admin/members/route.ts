import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const members = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt
        })
        .from(users)
        .orderBy(users.createdAt);

    return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password, role } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error: "Email et mot de passe requis." }, { status: 400 });
    }

    if (password.length < 8) {
        return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères." }, { status: 400 });
    }

    // Check if email already exists
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existing[0]) {
        return NextResponse.json({ error: "Un compte avec cet email existe déjà." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);

    const result = await db
        .insert(users)
        .values({
            name: name || null,
            email,
            password: hashed,
            role: role ?? "member"
        })
        .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt
        });

    return NextResponse.json(result[0]);
}

export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    // Prevent self-deletion
    if (id === session.user.id) {
        return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte." }, { status: 400 });
    }

    await db.delete(users).where(eq(users.id, id));
    return NextResponse.json({ success: true });
}
