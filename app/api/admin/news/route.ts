import { auth } from "@/lib/auth";
import { db } from "@/db";
import { news, newsImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET() {
    const items = await db.query.news.findMany({
        where: eq(news.visible, true),
        with: { images: { orderBy: (i, { asc }) => [asc(i.order)] } },
        orderBy: (news, { desc }) => [desc(news.publishedAt)]
    });
    return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, body, visible, images } = await req.json();

    const result = await db
        .insert(news)
        .values({ title, body, visible: visible ?? true })
        .returning();

    const newsItem = result[0];

    if (images?.length > 0) {
        await db.insert(newsImages).values(
            images.map((img: any, index: number) => ({
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

    const { id, title, body, visible } = await req.json();

    await db
        .update(news)
        .set({
            ...(title !== undefined && { title }),
            ...(body !== undefined && { body }),
            ...(visible !== undefined && { visible })
        })
        .where(eq(news.id, id));
    revalidateTag("news", "default");
    return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    await db.delete(news).where(eq(news.id, id));
    revalidateTag("news", "default");
    return NextResponse.json({ success: true });
}
