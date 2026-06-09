import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/mailer";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email requis." }, { status: 400 });
    }

    // Always return success to prevent email enumeration
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (user[0]) {
        // Delete any existing tokens for this user
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user[0].id));

        // Create new token — expires in 1 hour
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

        await db.insert(passwordResetTokens).values({
            userId: user[0].id,
            token,
            expiresAt
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

        await sendEmail({
            to: email,
            subject: "Réinitialisation de votre mot de passe Multisports",
            html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="font-size: 24px; font-weight: 900; color: #111; margin-bottom: 8px;">
            Réinitialisation du mot de passe
          </h2>
          <p style="color: #666; margin-bottom: 24px;">
            Vous avez demandé à réinitialiser votre mot de passe Multisports.
            Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
            Ce lien est valable <strong>1 heure</strong>.
          </p>
          <a href="${resetUrl}"
            style="display: inline-block; background: #327DB3; color: white; font-weight: 700;
                   padding: 12px 28px; border-radius: 12px; text-decoration: none; font-size: 15px;">
            Réinitialiser mon mot de passe
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            Votre mot de passe ne sera pas modifié.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #bbb; font-size: 11px;">Multisports — ${process.env.NEXT_PUBLIC_APP_URL}</p>
        </div>
      `
        });
    }

    return NextResponse.json({ success: true });
}
