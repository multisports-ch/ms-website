"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";

interface NewsEvent {
    id?: string;
    title: string;
    type: "news" | "event";
    body?: string | null;
    imageUrl?: string | null;
    imageFileId?: string | null;
    imageAlt?: string | null;
    eventDate?: string | null;
    visible: boolean;
}

interface Props {
    initial?: NewsEvent;
    onSave: () => void;
    onCancel: () => void;
}

export default function NewsEventForm({ initial, onSave, onCancel }: Props) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [type, setType] = useState<"news" | "event">(initial?.type ?? "news");
    const [body, setBody] = useState(initial?.body ?? "");
    const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
    const [imageFileId, setImageFileId] = useState(initial?.imageFileId ?? "");
    const [imageAlt, setImageAlt] = useState(initial?.imageAlt ?? "");
    const [eventDate, setEventDate] = useState(initial?.eventDate ?? "");
    const [visible, setVisible] = useState(initial?.visible ?? true);
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        if (!title) return;
        setSaving(true);

        const method = initial?.id ? "PATCH" : "POST";
        const body_ = {
            ...(initial?.id && { id: initial.id }),
            title,
            type,
            body,
            imageUrl: imageUrl || null,
            imageFileId: imageFileId || null,
            imageAlt: imageAlt || null,
            eventDate: eventDate || null,
            visible
        };

        await fetch("/api/admin/news", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body_)
        });

        setSaving(false);
        onSave();
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Summer Tournament 2025"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as "news" | "event")}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="news">News</option>
                        <option value="event">Event</option>
                    </select>
                </div>
            </div>

            {type === "event" && (
                <div>
                    <label className="block text-sm font-medium mb-1">Event Date</label>
                    <input
                        type="date"
                        value={eventDate ?? ""}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-1">Body</label>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={5}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    placeholder="Write your content here..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <ImageUploader
                    currentUrl={imageUrl}
                    currentFileId={imageFileId}
                    onUpload={(url, fileId) => {
                        setImageUrl(url);
                        setImageFileId(fileId);
                    }}
                    folder="/news"
                />
                {imageUrl && (
                    <input
                        type="text"
                        value={imageAlt}
                        onChange={(e) => setImageAlt(e.target.value)}
                        placeholder="Image alt text"
                        className="mt-2 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="visible"
                    checked={visible}
                    onChange={(e) => setVisible(e.target.checked)}
                    className="rounded"
                />
                <label htmlFor="visible" className="text-sm font-medium">
                    Visible on public site
                </label>
            </div>

            <div className="flex gap-2 justify-end">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving || !title}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
}
