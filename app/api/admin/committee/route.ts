import { auth } from "@/lib/auth";
import { deleteImageKitFile } from "@/lib/imagekit-delete";
import { db } from "@/db";
import { committeeMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET() {
    const members = await db.select().from(committeeMembers).orderBy(committeeMembers.order);

    return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, role, description, photoUrl, photoFileId, order } = await req.json();

    const member = await db
        .insert(committeeMembers)
        .values({ name, role, description, photoUrl, photoFileId, order: order ?? 0 })
        .returning();

    revalidateTag("committee-members", "default");
    return NextResponse.json(member[0]);
}

export async function PATCH(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, role, description, photoUrl, photoFileId, order } = await req.json();

    // If a new photo is being set, delete the old one first
    if (photoFileId) {
        const existing = await db.select().from(committeeMembers).where(eq(committeeMembers.id, id)).limit(1);

        await deleteImageKitFile(existing[0]?.photoFileId);
    }

    await db
        .update(committeeMembers)
        .set({
            ...(name !== undefined && { name }),
            ...(role !== undefined && { role }),
            ...(description !== undefined && { description }),
            ...(photoUrl !== undefined && { photoUrl }),
            ...(photoFileId !== undefined && { photoFileId }),
            ...(order !== undefined && { order })
        })
        .where(eq(committeeMembers.id, id));

    revalidateTag("committee-members", "default");
    return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    // Fetch the member first to get the photoFileId
    const member = await db.select().from(committeeMembers).where(eq(committeeMembers.id, id)).limit(1);

    await deleteImageKitFile(member[0]?.photoFileId);
    await db.delete(committeeMembers).where(eq(committeeMembers.id, id));

    revalidateTag("committee-members", "default");
    return NextResponse.json({ success: true });
}
