import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { sendEmail } from "@/lib/mailer";
import { NextRequest, NextResponse } from "next/server";

function escapeHtml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

export async function POST(req: NextRequest) {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await db.insert(contactSubmissions).values({ name, email, message });

    await sendEmail({
        to: "multisports@etik.com",
        subject: `Nouveau message de contact de ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Nouveau message de contact</h2>
                <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
                <p><strong>Email :</strong> ${escapeHtml(email)}</p>
                <p><strong>Message :</strong></p>
                <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
            </div>
        `
    });

    return NextResponse.json({ success: true });
}
