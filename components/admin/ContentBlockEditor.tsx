"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import FileUploader from "./FileUploader";

interface ContentBlock {
    id: string;
    label: string;
    text?: string | null;
    imageUrl?: string | null;
    imageFileId?: string | null;
    imageAlt?: string | null;
    fileUrl?: string | null;
    fileFileId?: string | null;
}

interface Props {
    block: ContentBlock;
}

export default function ContentBlockEditor({ block }: Props) {
    const [text, setText] = useState(block.text ?? "");
    const [imageUrl, setImageUrl] = useState(block.imageUrl ?? "");
    const [imageFileId, setImageFileId] = useState(block.imageFileId ?? "");
    const [imageAlt, setImageAlt] = useState(block.imageAlt ?? "");
    const [fileUrl, setFileUrl] = useState(block.fileUrl ?? "");
    const [fileFileId, setFileFileId] = useState(block.fileFileId ?? "");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const isImageBlock = block.id.includes("image");
    const isFileBlock = block.id.includes("doc") || block.id.includes("file");

    async function handleSave() {
        setSaving(true);

        await fetch("/api/admin/content", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: block.id,
                text: text || undefined,
                imageUrl: imageUrl || undefined,
                imageFileId: imageFileId || undefined,
                imageAlt: imageAlt || undefined,
                fileUrl: fileUrl || undefined,
                fileFileId: fileFileId || undefined
            })
        });

        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    return (
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{block.label}</h3>
                <span className="text-xs text-gray-400 font-mono">{block.id}</span>
            </div>

            {isFileBlock ? (
                <FileUploader
                    currentUrl={fileUrl || null}
                    currentFileId={fileFileId || null}
                    onUpload={(url, fileId) => {
                        setFileUrl(url);
                        setFileFileId(fileId);
                    }}
                    folder="/documents"
                />
            ) : isImageBlock ? (
                <div className="flex flex-col gap-2">
                    <ImageUploader
                        currentUrl={imageUrl}
                        currentFileId={imageFileId}
                        onUpload={(url, fileId) => {
                            setImageUrl(url);
                            setImageFileId(fileId);
                        }}
                        folder="/website"
                    />
                    <input
                        type="text"
                        value={imageAlt}
                        onChange={(e) => setImageAlt(e.target.value)}
                        placeholder="Texte alternatif (accessibilité)"
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            ) : (
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    placeholder="Entrez le contenu..."
                />
            )}

            <button
                onClick={handleSave}
                disabled={saving}
                className="self-end px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
                {saving ? "Enregistrement..." : saved ? "✓ Enregistré" : "Enregistrer"}
            </button>
        </div>
    );
}
