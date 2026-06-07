"use client";

import { useRef, useState } from "react";

interface Props {
    currentUrl?: string | null;
    currentFileId?: string | null;
    onUpload: (url: string, fileId: string) => void;
    folder?: string;
    accept?: string;
}

export default function FileUploader({
    currentUrl,
    currentFileId,
    onUpload,
    folder = "/documents",
    accept = ".pdf,.doc,.docx"
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [localFileName, setLocalFileName] = useState<string | null>(
        currentUrl ? (currentUrl.split("/").pop() ?? null) : null
    );
    const [localUrl, setLocalUrl] = useState<string | null>(currentUrl ?? null);

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);

        // Delete old file from ImageKit if exists
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

            const res = await fetch("/api/imagekit/file-upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    base64,
                    fileName: file.name,
                    folder
                })
            });

            const data = await res.json();
            setLocalFileName(file.name);
            setLocalUrl(data.url);
            onUpload(data.url, data.fileId);
            setUploading(false);
        };
        reader.readAsDataURL(file);
    }

    return (
        <div className="flex flex-col gap-2">
            {localUrl && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border rounded-lg text-sm text-gray-600">
                    <span>📄</span>
                    <span className="truncate flex-1">{localFileName ?? localUrl.split("/").pop()}</span>
                    <a
                        href={localUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline shrink-0"
                    >
                        Voir
                    </a>
                </div>
            )}
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-lg disabled:opacity-50 transition-colors text-left"
            >
                {uploading ? "Uploading..." : localUrl ? "Remplacer le fichier" : "Upload un fichier"}
            </button>
            <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFile} />
        </div>
    );
}
