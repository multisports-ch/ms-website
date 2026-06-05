import { auth } from "@/lib/auth";
import { deleteImageKitFile } from "@/lib/imagekit-delete";
import { db } from "@/db";
import { contentBlocks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function PATCH(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, text, imageUrl, imageFileId, imageAlt } = await req.json();

    // If a new image is being set, delete the old one first
    if (imageFileId) {
        const existing = await db.select().from(contentBlocks).where(eq(contentBlocks.id, id)).limit(1);

        await deleteImageKitFile(existing[0]?.imageFileId);
    }

    await db
        .update(contentBlocks)
        .set({
            ...(text !== undefined && { text }),
            ...(imageUrl !== undefined && { imageUrl }),
            ...(imageFileId !== undefined && { imageFileId }),
            ...(imageAlt !== undefined && { imageAlt }),
            updatedAt: new Date()
        })
        .where(eq(contentBlocks.id, id));

    revalidateTag("content-blocks", "default");
    return NextResponse.json({ success: true });
}
