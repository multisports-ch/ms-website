"use client";

import { useState } from "react";

interface Season {
    id: string;
    name: string;
    isCurrent: boolean;
    startDate: string | null;
    endDate: string | null;
}

interface Props {
    seasons: Season[];
    selectedSeasonId: string | null;
    onSelect: (id: string) => void;
    onRefresh: () => void;
}

const emptyForm = { name: "", startDate: "", endDate: "", isCurrent: false };

export default function SeasonManager({ seasons, selectedSeasonId, onSelect, onRefresh }: Props) {
    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState<Season | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    function openAdd() {
        setEditing(null);
        setForm(emptyForm);
        setAdding(true);
    }

    function openEdit(season: Season) {
        setAdding(false);
        setEditing(season);
        setForm({
            name: season.name,
            startDate: season.startDate ? season.startDate.slice(0, 10) : "",
            endDate: season.endDate ? season.endDate.slice(0, 10) : "",
            isCurrent: season.isCurrent
        });
    }

    async function handleSave() {
        if (!form.name) return;
        setSaving(true);

        if (editing) {
            await fetch("/api/admin/leaderboard/seasons", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editing.id, ...form })
            });
        } else {
            await fetch("/api/admin/leaderboard/seasons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
        }

        setSaving(false);
        setAdding(false);
        setEditing(null);
        setForm(emptyForm);
        onRefresh();
    }

    async function handleDelete(id: string) {
        if (!confirm("Supprimer cette saison et toutes ses données ?")) return;
        await fetch("/api/admin/leaderboard/seasons", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        onRefresh();
    }

    async function handleSetCurrent(id: string) {
        await fetch("/api/admin/leaderboard/seasons", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, isCurrent: true })
        });
        onRefresh();
    }

    const showForm = adding || editing !== null;

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 flex flex-col gap-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Saisons</h2>
                <button
                    onClick={openAdd}
                    className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + Ajouter
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex flex-col gap-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {editing ? "Modifier la saison" : "Nouvelle saison"}
                    </p>
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="ex. 2024-2025"
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Début</label>
                                <input
                                    type="date"
                                    value={form.startDate}
                                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                    className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Fin</label>
                                <input
                                    type="date"
                                    value={form.endDate}
                                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                    className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={form.isCurrent}
                                onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
                                className="rounded"
                            />
                            Saison en cours
                        </label>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={saving || !form.name}
                            className="flex-1 text-xs px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {saving ? "Enregistrement..." : "Enregistrer"}
                        </button>
                        <button
                            onClick={() => {
                                setAdding(false);
                                setEditing(null);
                            }}
                            className="flex-1 text-xs px-3 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {/* Season list */}
            <div className="flex flex-col divide-y divide-gray-100">
                {seasons.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8">Aucune saison. Commencez par en créer une.</p>
                )}
                {seasons.map((season) => (
                    <div
                        key={season.id}
                        onClick={() => onSelect(season.id)}
                        className={`flex items-center justify-between px-5 py-3 cursor-pointer transition-colors ${
                            selectedSeasonId === season.id
                                ? "bg-blue-50 border-l-4 border-l-blue-500"
                                : "hover:bg-gray-50 border-l-4 border-l-transparent"
                        }`}
                    >
                        <div>
                            <p className="font-medium text-sm text-gray-800">{season.name}</p>
                            {season.isCurrent && (
                                <span className="text-xs text-green-600 font-semibold">● En cours</span>
                            )}
                            {season.startDate && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {new Date(season.startDate).toLocaleDateString("fr-CH", {
                                        month: "short",
                                        year: "numeric"
                                    })}
                                    {season.endDate &&
                                        ` → ${new Date(season.endDate).toLocaleDateString("fr-CH", { month: "short", year: "numeric" })}`}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-1 shrink-0 ml-2">
                            {!season.isCurrent && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSetCurrent(season.id);
                                    }}
                                    className="text-xs px-2 py-1 border rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                                >
                                    Activer
                                </button>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openEdit(season);
                                }}
                                className="text-xs px-2 py-1 border rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                            >
                                Éditer
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(season.id);
                                }}
                                className="text-xs px-2 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
