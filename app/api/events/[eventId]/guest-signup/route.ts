import { db } from "@/db";
import { eventSignups, guests, events } from "@/db/schema";
import { getContentBlock } from "@/lib/queries";
import { sendEmail } from "@/lib/mailer";
import { eq, and, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

function escapeHtml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    const { name, email: rawEmail } = await req.json();
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    if (typeof name !== "string" || !name.trim() || !email) {
        return NextResponse.json({ error: "Nom et email requis." }, { status: 400 });
    }

    // Check event exists
    const event = await db.select().from(events).where(eq(events.id, eventId)).limit(1);

    if (!event[0]) {
        return NextResponse.json({ error: "Événement introuvable." }, { status: 404 });
    }

    // Find or create guest
    let guest = await db
        .select()
        .from(guests)
        .where(eq(sql`lower(${guests.email})`, email))
        .limit(1);

    let guestId: string;
    if (guest[0]) {
        guestId = guest[0].id;
    } else {
        const newGuest = await db.insert(guests).values({ name: name.trim(), email }).returning();
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

    const [template, subjectTemplate] = await Promise.all([
        getContentBlock("template_email_guest"),
        getContentBlock("template_email_guest_subject")
    ]);
    const eventType = event[0].type === "sport" ? "Sport" : "Défi";
    const eventDateTime = event[0].date
        ? `${String(new Date(event[0].date).getDate()).padStart(2, "0")}.${String(
              new Date(event[0].date).getMonth() + 1
          ).padStart(2, "0")}.${new Date(event[0].date).getFullYear()} - ${event[0].time ?? "Non précisée"}`
        : "Non précisée";
    const eventLocation = event[0].location ?? "Non précisé";
    const eventPrice = event[0].guestPrice != null ? `CHF ${(event[0].guestPrice / 100).toFixed(2)}` : "Non précisé";
    const templateText = template?.text ??
        "Bonjour {{name}},\n\nVotre inscription au {{eventType}} {{eventName}} est confirmée.\n\nDate : {{eventDateTime}}\nLieu : {{eventLocation}}\nPrix invité : {{eventPrice}}\n\nÀ bientôt !";
    const emailText = templateText
        .replaceAll("{{name}}", name)
        .replaceAll("{{eventName}}", event[0].name ?? "l'événement")
        .replaceAll("{{eventType}}", eventType)
        .replaceAll("{{eventDateTime}}", eventDateTime)
        .replaceAll("{{eventLocation}}", eventLocation)
        .replaceAll("{{eventPrice}}", eventPrice);
    const missingDetails = [
        !templateText.includes("{{eventType}}") ? `Type : ${eventType}` : null,
        !templateText.includes("{{eventDateTime}}") ? `Date : ${eventDateTime}` : null,
        !templateText.includes("{{eventLocation}}") ? `Lieu : ${eventLocation}` : null,
        !templateText.includes("{{eventPrice}}") ? `Prix invité : ${eventPrice}` : null
    ].filter((detail): detail is string => detail !== null);
    const emailTextWithDetails = missingDetails.length > 0 ? `${emailText}\n\n${missingDetails.join("\n")}` : emailText;
    const emailSubject = (subjectTemplate?.text ?? "Confirmation d'inscription - {{eventName}}")
        .replaceAll("{{name}}", name)
        .replaceAll("{{eventName}}", event[0].name ?? "l'événement")
        .replaceAll("{{eventType}}", eventType)
        .replaceAll("{{eventDateTime}}", eventDateTime)
        .replaceAll("{{eventLocation}}", eventLocation)
        .replaceAll("{{eventPrice}}", eventPrice)
        .replace(/[\r\n]+/g, " ")
        .trim();

    let emailSent = false;
    try {
        await sendEmail({
            to: email,
            subject: emailSubject,
            html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${escapeHtml(emailTextWithDetails).replaceAll(
                "\n",
                "<br />"
            )}</div>`
        });
        emailSent = true;
    } catch (error) {
        console.error("Guest signup confirmation email failed", error);
    }

    return NextResponse.json({ success: true, emailSent });
}
