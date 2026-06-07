import { auth } from "@/lib/auth";
import { imagekit } from "@/lib/imagekit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { base64, fileName, folder } = await req.json();

    const result = await imagekit.upload({
        file: base64,
        fileName,
        folder: folder ?? "/documents",
        useUniqueFileName: true
    });

    return NextResponse.json({ url: result.url, fileId: result.fileId });
}
