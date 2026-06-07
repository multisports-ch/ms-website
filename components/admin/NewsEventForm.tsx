"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";

interface NewsImage {
    imageUrl: string;
    imageFileId?: string | null;
}

interface NewsEvent {
    id?: string;
    title: string;
    body?: string | null;
    images?: NewsImage[];
    visible: boolean;
}

interface Props {
    initial?: NewsEvent;
    onSave: () => void;
    onCancel: () => void;
}

export default function NewsEventForm({ initial, onSave, onCancel }: Props) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [body, setBody] = useState(initial?.body ?? "");
    const [images, setImages] = useState<NewsImage[]>(initial?.images ?? []);
    const [visible, setVisible] = useState(initial?.visible ?? true);
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        if (!title) return;
        setSaving(true);

        const method = initial?.id ? "PATCH" : "POST";
        const body_ = {
            ...(initial?.id && { id: initial.id }),
            title,
            body,
            visible,
            images: images
                .filter((img) => img.imageUrl)
                .slice(0, 10)
                .map((img, index) => ({
                    imageUrl: img.imageUrl,
                    imageFileId: img.imageFileId ?? null,
                    order: index
                }))
        };

        await fetch("/api/admin/news", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body_)
        });

        setSaving(false);
        onSave();
    }

    function handleImageUpload(index: number, url: string, fileId?: string | null) {
        setImages((current) =>
            current.map((image, i) => (i === index ? { imageUrl: url, imageFileId: fileId ?? null } : image))
        );
    }

    function handleRemoveImage(index: number) {
        setImages((current) => current.filter((_, i) => i !== index));
    }

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ex. Tournoi d'été 2025"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Contenu</label>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={5}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    placeholder="Rédigez votre contenu ici..."
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Images</label>
                    <p className="text-xs text-gray-500">{images.length}/10 téléchargées</p>
                </div>
                <div className="space-y-4">
                    {images.map((image, index) => (
                        <div key={index} className="rounded-2xl border border-border p-4 bg-slate-50">
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <ImageUploader
                                        currentUrl={image.imageUrl}
                                        currentFileId={image.imageFileId ?? undefined}
                                        onUpload={(url, fileId) => handleImageUpload(index, url, fileId)}
                                        folder="/news"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="text-sm text-red-600 hover:text-red-800 transition-colors"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}

                    {images.length < 10 && (
                        <button
                            type="button"
                            onClick={() => setImages((current) => [...current, { imageUrl: "", imageFileId: null }])}
                            className="inline-flex items-center justify-center rounded-lg border border-dashed border-border px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            + Ajouter une image
                        </button>
                    )}
                </div>
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
                    Visible sur le site public
                </label>
            </div>

            <div className="flex gap-2 justify-end">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50 transition-colors"
                >
                    Annuler
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving || !title}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
            </div>
        </div>
    );
}
