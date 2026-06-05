import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await db.insert(contactSubmissions).values({ name, email, message });

    return NextResponse.json({ success: true });
}
