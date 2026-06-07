"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NewsEventForm from "@/components/admin/NewsEventForm";

interface NewsImage {
    id: string;
    imageUrl: string;
    imageFileId?: string | null;
    order: number;
}

interface NewsEvent {
    id: string;
    title: string;
    body?: string | null;
    images?: NewsImage[];
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
        if (!confirm(`Supprimer "${item.title}" ?`)) return;

        await fetch("/api/admin/news", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: item.id })
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
                <h1 className="text-2xl font-bold text-gray-800">Actualités</h1>
                <button
                    onClick={() => setAdding(true)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + Ajouter une actualité
                </button>
            </div>

            {adding && (
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h2 className="font-semibold text-gray-800 mb-4">Nouvelle actualité</h2>
                    <NewsEventForm onSave={handleSaved} onCancel={() => setAdding(false)} />
                </div>
            )}

            <div className="flex flex-col gap-4">
                {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow p-6">
                        {editing?.id === item.id ? (
                            <NewsEventForm initial={editing} onSave={handleSaved} onCancel={() => setEditing(null)} />
                        ) : (
                            <div className="flex gap-4 items-start">
                                {item.images && item.images.length > 0 && (
                                    <div className="relative w-28 h-28 rounded-lg overflow-hidden shrink-0">
                                        <Image
                                            src={item.images[0].imageUrl}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                        {item.images.length > 1 && (
                                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-full">
                                                +{item.images.length - 1}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    {!item.visible && (
                                        <span className="inline-flex text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 mb-2">
                                            caché
                                        </span>
                                    )}
                                    <p className="font-semibold text-gray-800 text-lg">{item.title}</p>
                                    {item.body && <p className="text-sm text-gray-500 mt-2 line-clamp-3">{item.body}</p>}
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => setEditing(item)}
                                        className="px-3 py-1 text-xs border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="px-3 py-1 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {items.length === 0 && !adding && (
                    <div className="text-center py-16 text-gray-400">
                        Aucune actualité pour le moment. Cliquez sur "+ Ajouter une actualité" pour en créer une.
                    </div>
                )}
            </div>
        </div>
    );
}
