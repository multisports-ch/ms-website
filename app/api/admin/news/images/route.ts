import { auth } from "@/lib/auth";
import { db } from "@/db";
import { newsImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { deleteImageKitFile } from "@/lib/imagekit-delete";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newsId, imageUrl, imageFileId, order } = await req.json();

    const result = await db
        .insert(newsImages)
        .values({ newsId, imageUrl, imageFileId, order: order ?? 0 })
        .returning();

    return NextResponse.json(result[0]);
}

export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, imageFileId } = await req.json();

    await deleteImageKitFile(imageFileId);
    await db.delete(newsImages).where(eq(newsImages.id, id));

    return NextResponse.json({ success: true });
}
