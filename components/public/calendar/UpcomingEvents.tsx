"use client";

import { useState } from "react";
import GuestSignupModal from "@/components/public/GuestSignupModal";

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
    upcomingSport: Event | null;
    upcomingDefi: Event | null;
}

function EventCard({ event }: { event: Event }) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <div
                className={`bg-card border-2 rounded-2xl p-6 flex flex-col gap-4 ${
                    event.type === "sport" ? "border-primary" : "border-purple-400"
                }`}
            >
                {/* Type badge */}
                <div className="flex items-center justify-between">
                    <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                            event.type === "sport" ? "text-white" : "bg-purple-100 text-purple-700"
                        }`}
                        style={event.type === "sport" ? { backgroundColor: "var(--primary)" } : {}}
                    >
                        {event.type === "sport" ? "⚽ Prochain sport" : "🎯 Prochain défi"}
                    </span>
                    {event.date && new Date(event.date) > new Date() && (
                        <span
                            className="text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
                        >
                            À venir
                        </span>
                    )}
                </div>

                {/* Name */}
                <h3 className="text-2xl font-black text-foreground">{event.name}</h3>

                {/* Details */}
                <div className="flex flex-col gap-2 text-sm">
                    {event.date && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span>📅</span>
                            <span>
                                {new Date(event.date).toLocaleDateString("fr-CH", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                })}
                                {event.time && ` à ${event.time}`}
                            </span>
                        </div>
                    )}
                    {event.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span>📍</span>
                            <span>{event.location}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-4 mt-1">
                        {event.memberPrice !== null && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Membres
                                </span>
                                <span className="font-bold text-foreground">
                                    CHF {(event.memberPrice / 100).toFixed(2)}
                                </span>
                            </div>
                        )}
                        {event.guestPrice !== null && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Invités
                                </span>
                                <span className="font-bold text-foreground">
                                    CHF {(event.guestPrice / 100).toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Signup button for guests */}
                <button
                    onClick={() => setModalOpen(true)}
                    className="mt-auto w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "var(--primary)" }}
                >
                    S'inscrire comme invité
                </button>
            </div>

            {modalOpen && (
                <GuestSignupModal eventId={event.id} eventName={event.name} onClose={() => setModalOpen(false)} />
            )}
        </>
    );
}

export default function UpcomingEvents({ upcomingSport, upcomingDefi }: Props) {
    if (!upcomingSport && !upcomingDefi) {
        return (
            <section>
                <h2 className="text-2xl font-black text-foreground mb-6">Prochains événements</h2>
                <p className="text-muted-foreground">Aucun événement à venir pour le moment.</p>
            </section>
        );
    }

    return (
        <section>
            <h2 className="text-2xl font-black text-foreground mb-6">Prochains événements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingSport && <EventCard event={upcomingSport} />}
                {upcomingDefi && <EventCard event={upcomingDefi} />}
            </div>
        </section>
    );
}
