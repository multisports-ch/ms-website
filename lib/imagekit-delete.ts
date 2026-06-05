import { imagekit } from "./imagekit";

export async function deleteImageKitFile(fileId: string | null | undefined) {
    if (!fileId) return;
    try {
        await imagekit.deleteFile(fileId);
    } catch (err) {
        // Log but don't throw — if the file is already gone, that's fine
        console.warn("ImageKit delete failed for fileId:", fileId, err);
    }
}
