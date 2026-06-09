import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { token, password } = await req.json();

    if (!token || !password) {
        return NextResponse.json({ error: "Données manquantes." }, { status: 400 });
    }

    if (password.length < 8) {
        return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères." }, { status: 400 });
    }

    // Find valid unused token
    const resetToken = await db
        .select()
        .from(passwordResetTokens)
        .where(and(eq(passwordResetTokens.token, token), gt(passwordResetTokens.expiresAt, new Date())))
        .limit(1);

    if (!resetToken[0] || resetToken[0].usedAt) {
        return NextResponse.json(
            { error: "Lien invalide ou expiré. Veuillez faire une nouvelle demande." },
            { status: 400 }
        );
    }

    // Update password
    const hashed = await bcrypt.hash(password, 12);
    await db.update(users).set({ password: hashed }).where(eq(users.id, resetToken[0].userId));

    // Mark token as used
    await db
        .update(passwordResetTokens)
        .set({ usedAt: new Date() })
        .where(eq(passwordResetTokens.id, resetToken[0].id));

    return NextResponse.json({ success: true });
}
