import { auth } from "@/lib/auth";
import { deleteImageKitFile } from "@/lib/imagekit-delete";
import { db } from "@/db";
import { news, newsImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET() {
    const items = await db.query.news.findMany({
        with: { images: { orderBy: (i, { asc }) => [asc(i.order)] } },
        orderBy: (news, { asc }) => [asc(news.order)]
    });
    return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, body, newsDate, order, visible, images } = await req.json();

    const result = await db
        .insert(news)
        .values({ title, body, newsDate: new Date(newsDate), order: order ?? 0, visible: visible ?? true })
        .returning();

    const newsItem = result[0];

    if (images?.length > 0) {
        await db.insert(newsImages).values(
            images.slice(0, 10).map((img: any, index: number) => ({
                newsId: newsItem.id,
                imageUrl: img.imageUrl,
                imageFileId: img.imageFileId ?? null,
                order: index
            }))
        );
    }

    revalidateTag("news", "default");
    return NextResponse.json(newsItem);
}

export async function PATCH(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, body, newsDate, order, visible, images } = await req.json();

    await db
        .update(news)
        .set({
            ...(title !== undefined && { title }),
            ...(body !== undefined && { body }),
            ...(newsDate !== undefined && { newsDate: new Date(newsDate) }),
            ...(order !== undefined && { order }),
            ...(visible !== undefined && { visible })
        })
        .where(eq(news.id, id));

    if (images) {
        const existingImages = await db.select().from(newsImages).where(eq(newsImages.newsId, id));
        const retainedFileIds = new Set(
            images.map((image: { imageFileId?: string | null }) => image.imageFileId).filter(Boolean)
        );
        await Promise.all(
            existingImages
                .filter((image) => !retainedFileIds.has(image.imageFileId))
                .map((image) => deleteImageKitFile(image.imageFileId))
        );
        await db.delete(newsImages).where(eq(newsImages.newsId, id));
        if (images.length > 0) {
            await db.insert(newsImages).values(
                images.slice(0, 10).map((img: any, index: number) => ({
                    newsId: id,
                    imageUrl: img.imageUrl,
                    imageFileId: img.imageFileId ?? null,
                    order: index
                }))
            );
        }
    }

    revalidateTag("news", "default");
    return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    const existingImages = await db.select().from(newsImages).where(eq(newsImages.newsId, id));
    await Promise.all(existingImages.map((image) => deleteImageKitFile(image.imageFileId)));
    await db.delete(news).where(eq(news.id, id));
    revalidateTag("news", "default");
    return NextResponse.json({ success: true });
}
