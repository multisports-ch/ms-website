"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";

interface Member {
    id?: string;
    name: string;
    role: string;
    description: string | null;
    photoUrl?: string | null;
    photoFileId?: string | null;
    order: number;
}

interface Props {
    initial?: Member;
    onSave: (member: Member) => void;
    onCancel: () => void;
}

export default function CommitteeMemberForm({ initial, onSave, onCancel }: Props) {
    const [name, setName] = useState(initial?.name ?? "");
    const [role, setRole] = useState(initial?.role ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl ?? "");
    const [photoFileId, setPhotoFileId] = useState(initial?.photoFileId ?? "");
    const [order, setOrder] = useState(initial?.order ?? 0);
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        if (!name || !role) return;
        setSaving(true);

        const method = initial?.id ? "PATCH" : "POST";
        const body = initial?.id
            ? { id: initial.id, name, role, description, photoUrl, photoFileId, order }
            : { name, role, description, photoUrl, photoFileId, order };

        const res = await fetch("/api/admin/committee", {
            method: initial?.id ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const saved = await res.json();
        setSaving(false);
        onSave(saved);
    }

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ex. Jean Dupont"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Fonction</label>
                <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ex. Président"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    placeholder="Biographie courte ou description..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Ordre d'affichage</label>
                <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Photo</label>
                <ImageUploader
                    currentUrl={photoUrl}
                    currentFileId={photoFileId}
                    onUpload={(url, fileId) => {
                        setPhotoUrl(url);
                        setPhotoFileId(fileId);
                    }}
                    folder="/committee"
                />
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
                    disabled={saving || !name || !role}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
            </div>
        </div>
    );
}
