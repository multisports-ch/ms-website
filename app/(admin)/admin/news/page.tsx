"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NewsEventForm from "@/components/admin/NewsEventForm";

interface NewsEvent {
    id: string;
    title: string;
    type: "news" | "event";
    body?: string | null;
    imageUrl?: string | null;
    imageFileId?: string | null;
    imageAlt?: string | null;
    eventDate?: string | null;
    visible: boolean;
    publishedAt: string;
}

export default function AdminNewsPage() {
    const [items, setItems] = useState<NewsEvent[]>([]);
    const [editing, setEditing] = useState<NewsEvent | null>(null);
    const [adding, setAdding] = useState(false);

    async function load() {
        const res = await fetch("/api/admin/news");
        const data = await res.json();
        setItems(data);
    }

    useEffect(() => {
        load();
    }, []);

    async function handleDelete(item: NewsEvent) {
        if (!confirm(`Delete "${item.title}"?`)) return;

        await fetch("/api/admin/news", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: item.id, imageFileId: item.imageFileId })
        });
        load();
    }

    function handleSaved() {
        setEditing(null);
        setAdding(false);
        load();
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">News & Events</h1>
                <button
                    onClick={() => setAdding(true)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + Add item
                </button>
            </div>

            {adding && (
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h2 className="font-semibold text-gray-800 mb-4">New Item</h2>
                    <NewsEventForm onSave={handleSaved} onCancel={() => setAdding(false)} />
                </div>
            )}

            <div className="flex flex-col gap-4">
                {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow p-6">
                        {editing?.id === item.id ? (
                            <NewsEventForm initial={editing} onSave={handleSaved} onCancel={() => setEditing(null)} />
                        ) : (
                            <div className="flex gap-4">
                                {item.imageUrl && (
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.imageAlt ?? item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                item.type === "event"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-blue-100 text-blue-700"
                                            }`}
                                        >
                                            {item.type}
                                        </span>
                                        {!item.visible && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                                hidden
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-semibold text-gray-800">{item.title}</p>
                                    {item.eventDate && (
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {new Date(item.eventDate).toLocaleDateString()}
                                        </p>
                                    )}
                                    {item.body && <p className="text-sm text-gray-400 mt-1 truncate">{item.body}</p>}
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => setEditing(item)}
                                        className="px-3 py-1 text-xs border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="px-3 py-1 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {items.length === 0 && !adding && (
                    <div className="text-center py-16 text-gray-400">
                        No news or events yet. Click "+ Add item" to create one.
                    </div>
                )}
            </div>
        </div>
    );
}
