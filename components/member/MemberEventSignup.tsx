"use client";

import { useState } from "react";

interface Event {
    id: string;
    name: string | null;
    type: "sport" | "defi";
    date: string | null;
    time: string | null;
    location: string | null;
    memberPrice: number | null;
}

interface Props {
    event: Event;
    isSignedUp: boolean;
}

export default function MemberEventSignup({ event, isSignedUp: initialSignedUp }: Props) {
    const [isSignedUp, setIsSignedUp] = useState(initialSignedUp);
    const [loading, setLoading] = useState(false);

    async function handleToggle() {
        setLoading(true);

        const method = isSignedUp ? "DELETE" : "POST";
        await fetch(`/api/events/${event.id}/signup`, { method });

        setIsSignedUp(!isSignedUp);
        setLoading(false);
    }

    return (
        <div
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
                isSignedUp ? "border-green-300 bg-green-50" : "border-border bg-background"
            }`}
        >
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                    <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            event.type === "sport" ? "text-white" : "bg-purple-100 text-purple-700"
                        }`}
                        style={event.type === "sport" ? { backgroundColor: "var(--primary)" } : {}}
                    >
                        {event.type === "sport" ? "Sport" : "Défi"}
                    </span>
                    <span className="font-bold text-foreground">{event.name}</span>
                </div>
                {event.date && (
                    <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("fr-CH", {
                            weekday: "short",
                            day: "numeric",
                            month: "short"
                        })}
                        {event.time && ` à ${event.time}`}
                        {event.location && ` · ${event.location}`}
                    </p>
                )}
                {event.memberPrice !== null && (
                    <p className="text-xs text-muted-foreground">CHF {(event.memberPrice / 100).toFixed(2)}</p>
                )}
            </div>

            <button
                onClick={handleToggle}
                disabled={loading}
                className={`shrink-0 ml-4 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${
                    isSignedUp ? "bg-red-100 text-red-600 hover:bg-red-200" : "text-white hover:opacity-90"
                }`}
                style={!isSignedUp ? { backgroundColor: "var(--primary)" } : {}}
            >
                {loading ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin block" />
                ) : isSignedUp ? (
                    "Se désinscrire"
                ) : (
                    "S'inscrire"
                )}
            </button>
        </div>
    );
}
