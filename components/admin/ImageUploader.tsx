"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface Props {
    currentUrl?: string | null;
    currentFileId?: string | null;
    onUpload: (url: string, fileId: string) => void;
    folder?: string;
}

export default function ImageUploader({ currentUrl, currentFileId, onUpload, folder }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        // Delete previous image if exists
        if (currentFileId) {
            await fetch("/api/imagekit/upload", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileId: currentFileId })
            });
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = (reader.result as string).split(",")[1];

            const res = await fetch("/api/imagekit/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ base64, fileName: file.name, folder })
            });

            const data = await res.json();
            setPreview(data.url);
            onUpload(data.url, data.fileId);
            setUploading(false);
        };
        reader.readAsDataURL(file);
    }

    return (
        <div className="flex flex-col gap-2">
            {preview && (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                </div>
            )}
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-lg disabled:opacity-50 transition-colors"
            >
                {uploading ? "Uploading..." : preview ? "Replace image" : "Upload image"}
            </button>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
    );
}
