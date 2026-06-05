"use client";

import { useEffect, useState } from "react";

interface Event {
    id: string;
    name: string | null;
    type: "sport" | "defi";
    date: string | null;
    time: string | null;
    location: string | null;
    memberPrice: number | null;
    guestPrice: number | null;
}

interface Props {
    seasonId: string;
    selectedEventId: string | null;
    onSelectEvent: (id: string) => void;
}

const emptyForm = {
    name: "",
    type: "sport" as "sport" | "defi",
    date: "",
    time: "",
    location: "",
    memberPrice: "",
    guestPrice: ""
};

export default function EventManager({ seasonId, selectedEventId, onSelectEvent }: Props) {
    const [events, setEvents] = useState<Event[]>([]);
    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState<Event | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    async function loadEvents() {
        const res = await fetch(`/api/admin/leaderboard/events?seasonId=${seasonId}`);
        const data = await res.json();
        setEvents(data);
    }

    useEffect(() => {
        loadEvents();
        setAdding(false);
        setEditing(null);
    }, [seasonId]);

    function openAdd() {
        setEditing(null);
        setForm(emptyForm);
        setAdding(true);
    }

    function openEdit(event: Event) {
        setAdding(false);
        setEditing(event);
        setForm({
            name: event.name ?? "",
            type: event.type,
            date: event.date ? event.date.slice(0, 10) : "",
            time: event.time ?? "",
            location: event.location ?? "",
            memberPrice: event.memberPrice ? (event.memberPrice / 100).toString() : "",
            guestPrice: event.guestPrice ? (event.guestPrice / 100).toString() : ""
        });
    }

    async function handleSave() {
        if (!form.name) return;
        setSaving(true);

        const body = {
            ...(editing && { id: editing.id }),
            seasonId,
            name: form.name,
            type: form.type,
            date: form.date || null,
            time: form.time || null,
            location: form.location || null,
            memberPrice: form.memberPrice ? parseFloat(form.memberPrice) : null,
            guestPrice: form.guestPrice ? parseFloat(form.guestPrice) : null
        };

        await fetch("/api/admin/leaderboard/events", {
            method: editing ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        setSaving(false);
        setAdding(false);
        setEditing(null);
        setForm(emptyForm);
        loadEvents();
    }

    async function handleDelete(id: string) {
        if (!confirm("Supprimer cet événement et tous ses résultats ?")) return;
        await fetch("/api/admin/leaderboard/events", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        loadEvents();
    }

    const sportEvents = events.filter((e) => e.type === "sport");
    const defiEvents = events.filter((e) => e.type === "defi");
    const showForm = adding || editing !== null;

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 flex flex-col gap-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Événements</h2>
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
                        {editing ? "Modifier l'événement" : "Nouvel événement"}
                    </p>
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Nom (ex. Volleyball, Laser Game)"
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setForm({ ...form, type: "sport" })}
                                className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                                    form.type === "sport"
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                Sport
                            </button>
                            <button
                                onClick={() => setForm({ ...form, type: "defi" })}
                                className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                                    form.type === "defi"
                                        ? "bg-purple-600 text-white border-purple-600"
                                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                Défi
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Date</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Heure</label>
                                <input
                                    type="time"
                                    value={form.time}
                                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                                    className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <input
                            type="text"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            placeholder="Lieu"
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Prix membre (CHF)</label>
                                <input
                                    type="number"
                                    value={form.memberPrice}
                                    onChange={(e) => setForm({ ...form, memberPrice: e.target.value })}
                                    placeholder="5.00"
                                    step="0.50"
                                    className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Prix invité (CHF)</label>
                                <input
                                    type="number"
                                    value={form.guestPrice}
                                    onChange={(e) => setForm({ ...form, guestPrice: e.target.value })}
                                    placeholder="8.00"
                                    step="0.50"
                                    className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
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

            {/* Events list grouped by type */}
            <div className="flex flex-col divide-y divide-gray-100">
                {events.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8">Aucun événement pour cette saison.</p>
                )}

                {(["sport", "defi"] as const).map((type) => {
                    const typeEvents = type === "sport" ? sportEvents : defiEvents;
                    if (typeEvents.length === 0) return null;
                    return (
                        <div key={type}>
                            <p
                                className={`px-5 py-2 text-xs font-bold uppercase tracking-widest ${
                                    type === "sport" ? "text-blue-600 bg-blue-50" : "text-purple-600 bg-purple-50"
                                }`}
                            >
                                {type === "sport" ? "⚽ Sports" : "🎯 Défis"}
                            </p>
                            {typeEvents.map((event) => (
                                <div
                                    key={event.id}
                                    onClick={() => onSelectEvent(event.id)}
                                    className={`flex items-center justify-between px-5 py-3 cursor-pointer transition-colors border-t border-gray-50 ${
                                        selectedEventId === event.id
                                            ? "bg-blue-50 border-l-4 border-l-blue-500"
                                            : "hover:bg-gray-50 border-l-4 border-l-transparent"
                                    }`}
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm text-gray-800 truncate">{event.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            {event.date && (
                                                <span className="text-xs text-gray-400">
                                                    {new Date(event.date).toLocaleDateString("fr-CH", {
                                                        day: "numeric",
                                                        month: "short"
                                                    })}
                                                    {event.time && ` · ${event.time}`}
                                                </span>
                                            )}
                                            {event.location && (
                                                <span className="text-xs text-gray-400 truncate">
                                                    · {event.location}
                                                </span>
                                            )}
                                        </div>
                                        {(event.memberPrice || event.guestPrice) && (
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {event.memberPrice &&
                                                    `Membres: CHF ${(event.memberPrice / 100).toFixed(2)}`}
                                                {event.memberPrice && event.guestPrice && " · "}
                                                {event.guestPrice &&
                                                    `Invités: CHF ${(event.guestPrice / 100).toFixed(2)}`}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-1 shrink-0 ml-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEdit(event);
                                            }}
                                            className="text-xs px-2 py-1 border rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                                        >
                                            Éditer
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(event.id);
                                            }}
                                            className="text-xs px-2 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
