"use client";

import { useState } from "react";

interface LeaderboardEntry {
    rank: number;
    totalPoints: number;
    userId: string;
    userName: string | null;
    userEmail: string | null;
}

interface Event {
    id: string;
    name: string | null;
    type: "sport" | "defi";
    date: string | null;
}

interface MemberEventPoints {
    userId: string | null;
    eventId: string;
    points: number;
}

interface EventResult {
    rank: number;
    points: number;
    result: string | null;
    userId: string | null;
    guestId: string | null;
    userName: string | null;
    guestName: string | null;
}

interface Props {
    leaderboard: LeaderboardEntry[];
    events: Event[];
    memberEventPoints: MemberEventPoints[];
    initialEventResults: EventResult[];
    initialEventId: string | null;
}

export default function SeasonLeaderboard({
    leaderboard,
    events,
    memberEventPoints,
    initialEventResults,
    initialEventId
}: Props) {
    const [selectedEventId, setSelectedEventId] = useState<string | null>(initialEventId);
    const [eventResults, setEventResults] = useState<EventResult[]>(initialEventResults);
    const [loading, setLoading] = useState(false);

    async function handleSelectEvent(eventId: string) {
        if (selectedEventId === eventId) return;
        setLoading(true);
        setSelectedEventId(eventId);
        const res = await fetch(`/api/leaderboard/event-results?eventId=${eventId}`);
        const data = await res.json();
        setEventResults(data);
        setLoading(false);
    }

    const selectedEvent = events.find((e) => e.id === selectedEventId);

    function getRankStyle(rank: number) {
        if (rank === 1)
            return "bg-[var(--accent)] text-black font-black text-lg w-9 h-9 rounded-full flex items-center justify-center";
        if (rank === 2)
            return "bg-gray-300 text-gray-800 font-black text-lg w-9 h-9 rounded-full flex items-center justify-center";
        if (rank === 3)
            return "bg-amber-600 text-white font-black text-lg w-9 h-9 rounded-full flex items-center justify-center";
        return "text-gray-400 font-bold text-base w-9 h-9 flex items-center justify-center";
    }

    function getRankLabel(rank: number) {
        if (rank === 1) return "1";
        if (rank === 2) return "2";
        if (rank === 3) return "3";
        return `${rank}`;
    }

    return (
        <div className="flex flex-col gap-10">
            {/* Season Leaderboard Table */}
            {leaderboard.length > 0 ? (
                <div className="rounded-2xl overflow-hidden shadow-lg border border-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm bg-card">
                            <thead>
                                <tr style={{ backgroundColor: "var(--primary)" }}>
                                    <th className="px-5 py-4 text-left font-bold text-white text-xs uppercase tracking-widest w-16">
                                        Rang
                                    </th>
                                    <th className="px-5 py-4 text-left font-bold text-white text-xs uppercase tracking-widest">
                                        Membre
                                    </th>
                                    <th className="px-5 py-4 text-center font-bold text-white text-xs uppercase tracking-widest">
                                        Total
                                    </th>
                                    {events.map((event) => (
                                        <th
                                            key={event.id}
                                            onClick={() => handleSelectEvent(event.id)}
                                            className="px-4 py-3 text-center cursor-pointer transition-all whitespace-nowrap group"
                                            style={{
                                                backgroundColor:
                                                    selectedEventId === event.id ? "var(--accent)" : undefined
                                            }}
                                        >
                                            <div className="flex flex-col items-center gap-1">
                                                <span
                                                    className={`font-semibold text-xs transition-colors ${
                                                        selectedEventId === event.id
                                                            ? "text-black"
                                                            : "text-white/80 group-hover:text-white"
                                                    }`}
                                                >
                                                    {event.name}
                                                </span>
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                        selectedEventId === event.id
                                                            ? event.type === "sport"
                                                                ? "bg-black/10 text-black"
                                                                : "bg-black/10 text-black"
                                                            : event.type === "sport"
                                                              ? "bg-white/20 text-white"
                                                              : "bg-white/10 text-white/70"
                                                    }`}
                                                >
                                                    {event.type === "sport" ? "Sport" : "Défi"}
                                                </span>
                                                {event.date && (
                                                    <span
                                                        className={`text-xs font-normal ${
                                                            selectedEventId === event.id
                                                                ? "text-black/60"
                                                                : "text-white/50"
                                                        }`}
                                                    >
                                                        {new Date(event.date).toLocaleDateString("fr-CH", {
                                                            day: "numeric",
                                                            month: "short"
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((entry, index) => (
                                    <tr
                                        key={entry.userId}
                                        className={`border-b border-border transition-colors hover:bg-muted/50 ${
                                            entry.rank === 1 ? "bg-(--accent)/5" : ""
                                        }`}
                                    >
                                        <td className="px-5 py-3">
                                            <div className={getRankStyle(entry.rank)}>{getRankLabel(entry.rank)}</div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`font-semibold ${
                                                    entry.rank <= 3 ? "text-foreground" : "text-foreground/80"
                                                }`}
                                            >
                                                {entry.userName ?? entry.userEmail}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <span className="font-black text-base" style={{ color: "var(--primary)" }}>
                                                {entry.totalPoints}
                                            </span>
                                        </td>
                                        {events.map((event) => {
                                            const pts = memberEventPoints.find(
                                                (p) => p.userId === entry.userId && p.eventId === event.id
                                            );
                                            return (
                                                <td
                                                    key={event.id}
                                                    className={`px-4 py-3 text-center transition-colors ${
                                                        selectedEventId === event.id ? "bg-(--accent)/10" : ""
                                                    }`}
                                                >
                                                    {pts ? (
                                                        <span className="font-semibold text-foreground/70">
                                                            {pts.points}
                                                        </span>
                                                    ) : (
                                                        <span className="text-foreground/20 text-xs">—</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 text-muted-foreground bg-card rounded-2xl border border-border">
                    <p className="text-lg font-medium">Aucun classement disponible</p>
                    <p className="text-sm mt-1">Les résultats apparaîtront ici au fil de la saison.</p>
                </div>
            )}

            {/* Event Results Panel */}
            {selectedEventId && (
                <div>
                    {/* Results header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-6 w-1 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                        <h2 className="text-xl font-bold text-foreground">Résultats — {selectedEvent?.name}</h2>
                        <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                selectedEvent?.type === "sport" ? "text-white" : "text-foreground/70 bg-foreground/10"
                            }`}
                            style={selectedEvent?.type === "sport" ? { backgroundColor: "var(--primary)" } : {}}
                        >
                            {selectedEvent?.type === "sport" ? "Sport" : "Défi"}
                        </span>
                        {selectedEvent?.date && (
                            <span className="text-sm text-muted-foreground ml-1">
                                {new Date(selectedEvent.date).toLocaleDateString("fr-CH", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                })}
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground bg-card rounded-2xl border border-border">
                            <div className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mb-2" />
                            <p className="text-sm">Chargement des résultats...</p>
                        </div>
                    ) : eventResults.length > 0 ? (
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-border">
                            <table className="w-full text-sm bg-card">
                                <thead>
                                    <tr className="border-b-2 border-border bg-muted/50">
                                        <th className="px-5 py-3 text-left font-bold text-muted-foreground text-xs uppercase tracking-widest w-20">
                                            Rang
                                        </th>
                                        <th className="px-5 py-3 text-left font-bold text-muted-foreground text-xs uppercase tracking-widest">
                                            Participant
                                        </th>
                                        <th className="px-5 py-3 text-center font-bold text-muted-foreground text-xs uppercase tracking-widest">
                                            Résultat
                                        </th>
                                        <th className="px-5 py-3 text-center font-bold text-muted-foreground text-xs uppercase tracking-widest">
                                            Points MS
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eventResults.map((result, index) => (
                                        <tr
                                            key={index}
                                            className={`border-b border-border transition-colors hover:bg-muted/30 ${
                                                result.rank === 1 ? "bg-(--accent)/5" : ""
                                            }`}
                                        >
                                            <td className="px-5 py-3">
                                                <div className={getRankStyle(result.rank)}>
                                                    {getRankLabel(result.rank)}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-foreground">
                                                        {result.userName ?? result.guestName}
                                                    </span>
                                                    {result.guestId && (
                                                        <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-medium">
                                                            Invité
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-center text-foreground/60 font-medium">
                                                {result.result ?? "—"}
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                {result.guestId ? (
                                                    <span className="text-foreground/20 text-xs">—</span>
                                                ) : (
                                                    <span className="font-black" style={{ color: "var(--primary)" }}>
                                                        {result.points}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground bg-card rounded-2xl border border-border">
                            <p className="text-sm">Aucun résultat enregistré pour cet événement.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
