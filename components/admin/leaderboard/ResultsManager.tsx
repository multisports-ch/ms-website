"use client";

import { useEffect, useState } from "react";

interface ResultRow {
    id?: string;
    rank: number;
    points: number;
    result: string;
    userId: string | null;
    guestId: string | null;
    userName: string | null;
    guestName: string | null;
    isNew?: boolean;
    isGuest?: boolean;
    newGuestName?: string;
}

interface Member {
    id: string;
    name: string | null;
    email: string | null;
}

interface Event {
    id: string;
    name: string | null;
    type: "sport" | "defi";
    date: string | null;
}

interface Props {
    eventId: string;
}

export default function ResultsManager({ eventId }: Props) {
    const [event, setEvent] = useState<Event | null>(null);
    const [rows, setRows] = useState<ResultRow[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    async function loadEvent() {
        const res = await fetch(`/api/admin/leaderboard/events?seasonId=all`);
        // Fetch single event info from existing results endpoint context
        // We'll derive from what we have
    }

    async function loadResults() {
        const res = await fetch(`/api/admin/leaderboard/results?eventId=${eventId}`);
        const data = await res.json();
        setRows(
            data.map((r: any) => ({
                id: r.id,
                rank: r.rank,
                points: r.points,
                result: r.result ?? "",
                userId: r.userId,
                guestId: r.guestId,
                userName: r.user?.name ?? r.userName ?? null,
                guestName: r.guest?.name ?? r.guestName ?? null,
                isGuest: !!r.guestId
            }))
        );
    }

    async function loadMembers() {
        const res = await fetch("/api/admin/members");
        const data = await res.json();
        setMembers(data);
    }

    useEffect(() => {
        setRows([]);
        setSaved(false);
        loadResults();
        loadMembers();
    }, [eventId]);

    function addMemberRow() {
        setRows([
            ...rows,
            {
                rank: rows.length + 1,
                points: 0,
                result: "",
                userId: "",
                guestId: null,
                userName: null,
                guestName: null,
                isNew: true,
                isGuest: false
            }
        ]);
    }

    function addGuestRow() {
        setRows([
            ...rows,
            {
                rank: rows.length + 1,
                points: 0,
                result: "",
                userId: null,
                guestId: "new",
                userName: null,
                guestName: null,
                isNew: true,
                isGuest: true,
                newGuestName: ""
            }
        ]);
    }

    function updateRow(index: number, field: keyof ResultRow, value: any) {
        setRows(rows.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
    }

    function removeRow(index: number) {
        setRows(rows.filter((_, i) => i !== index).map((r, i) => ({ ...r, rank: i + 1 })));
    }

    function moveRow(index: number, direction: "up" | "down") {
        const newRows = [...rows];
        const swapIndex = direction === "up" ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= newRows.length) return;
        [newRows[index], newRows[swapIndex]] = [newRows[swapIndex], newRows[index]];
        setRows(newRows.map((r, i) => ({ ...r, rank: i + 1 })));
    }

    async function handleSave() {
        setSaving(true);

        const payload = rows
            .filter((r) => r.userId || r.newGuestName || (r.guestId && r.guestId !== "new"))
            .map((r) => ({
                rank: r.rank,
                points: r.points,
                result: r.result || null,
                userId: r.isGuest ? null : r.userId || null,
                guestId: r.isGuest && r.guestId !== "new" ? r.guestId : null,
                guestName: r.isGuest ? r.newGuestName || r.guestName : null
            }));

        await fetch("/api/admin/leaderboard/results", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventId, results: payload })
        });

        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        loadResults();
    }

    const usedMemberIds = rows.filter((r) => !r.isGuest).map((r) => r.userId);

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 flex flex-col gap-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Résultats</h2>
                <div className="flex gap-2">
                    <button
                        onClick={addMemberRow}
                        className="text-xs px-3 py-1.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        + Membre
                    </button>
                    <button
                        onClick={addGuestRow}
                        className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        + Invité
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {rows.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <p className="text-sm">Aucun résultat.</p>
                        <p className="text-xs mt-1">Ajoutez des membres ou invités ci-dessus.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                                <th className="px-3 py-2 text-left w-10">#</th>
                                <th className="px-3 py-2 text-left">Participant</th>
                                <th className="px-3 py-2 text-left w-28">Résultat</th>
                                <th className="px-3 py-2 text-center w-20">Pts MS</th>
                                <th className="px-3 py-2 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {rows.map((row, index) => (
                                <tr key={index} className={`${row.isGuest ? "bg-gray-50/50" : ""}`}>
                                    {/* Rank */}
                                    <td className="px-3 py-2">
                                        <div className="flex flex-col gap-0.5">
                                            <button
                                                onClick={() => moveRow(index, "up")}
                                                disabled={index === 0}
                                                className="text-gray-300 hover:text-gray-500 disabled:opacity-0 text-xs leading-none"
                                            >
                                                ▲
                                            </button>
                                            <span className="text-xs font-bold text-gray-500 text-center">
                                                {row.rank}
                                            </span>
                                            <button
                                                onClick={() => moveRow(index, "down")}
                                                disabled={index === rows.length - 1}
                                                className="text-gray-300 hover:text-gray-500 disabled:opacity-0 text-xs leading-none"
                                            >
                                                ▼
                                            </button>
                                        </div>
                                    </td>

                                    {/* Participant */}
                                    <td className="px-3 py-2">
                                        {row.isGuest ? (
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded font-medium shrink-0">
                                                    Invité
                                                </span>
                                                <input
                                                    type="text"
                                                    value={row.newGuestName ?? row.guestName ?? ""}
                                                    onChange={(e) => updateRow(index, "newGuestName", e.target.value)}
                                                    placeholder="Nom de l'invité"
                                                    className="border rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                />
                                            </div>
                                        ) : (
                                            <select
                                                value={row.userId ?? ""}
                                                onChange={(e) => updateRow(index, "userId", e.target.value)}
                                                className="border rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            >
                                                <option value="">Sélectionner...</option>
                                                {members.map((m) => (
                                                    <option
                                                        key={m.id}
                                                        value={m.id}
                                                        disabled={usedMemberIds.includes(m.id) && row.userId !== m.id}
                                                    >
                                                        {m.name ?? m.email}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </td>

                                    {/* Result */}
                                    <td className="px-3 py-2">
                                        <input
                                            type="text"
                                            value={row.result}
                                            onChange={(e) => updateRow(index, "result", e.target.value)}
                                            placeholder="ex. 3 victoires"
                                            className="border rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        />
                                    </td>

                                    {/* Points */}
                                    <td className="px-3 py-2">
                                        {row.isGuest ? (
                                            <span className="text-xs text-gray-300 block text-center">—</span>
                                        ) : (
                                            <input
                                                type="number"
                                                value={row.points}
                                                onChange={(e) => updateRow(index, "points", Number(e.target.value))}
                                                className="border rounded px-2 py-1 text-xs w-full min-w-16 text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                min={0}
                                            />
                                        )}
                                    </td>

                                    {/* Remove */}
                                    <td className="px-3 py-2 text-center">
                                        <button
                                            onClick={() => removeRow(index)}
                                            className="text-red-400 hover:text-red-600 text-xs transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Save button */}
            {rows.length > 0 && (
                <div className="px-5 py-4 border-t border-gray-100">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                            saved
                                ? "bg-green-500 text-white"
                                : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        }`}
                    >
                        {saving ? "Enregistrement..." : saved ? "✓ Enregistré" : "Enregistrer les résultats"}
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-2">
                        Le classement de la saison sera recalculé automatiquement.
                    </p>
                </div>
            )}
        </div>
    );
}
