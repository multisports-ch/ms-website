"use client";

import { useState } from "react";

interface Props {
    eventId: string;
    eventName: string | null;
    onClose: () => void;
}

type Status = "idle" | "sending" | "success" | "error";

export default function GuestSignupModal({ eventId, eventName, onClose }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("sending");
        setErrorMsg("");

        const res = await fetch(`/api/events/${eventId}/guest-signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email })
        });

        const data = await res.json();

        if (!res.ok) {
            setErrorMsg(data.error ?? "Une erreur est survenue.");
            setStatus("error");
            return;
        }

        setStatus("success");
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6 z-10">
                {status === "success" ? (
                    <div className="text-center flex flex-col items-center gap-3 py-4">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                            style={{ backgroundColor: "var(--accent)" }}
                        >
                            ✓
                        </div>
                        <h2 className="text-xl font-bold text-foreground">Inscription confirmée !</h2>
                        <p className="text-sm text-muted-foreground">
                            Vous êtes inscrit(e) à <strong>{eventName}</strong>.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-2 px-6 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
                            style={{ backgroundColor: "var(--primary)" }}
                        >
                            Fermer
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <h2 className="text-xl font-bold text-foreground">S'inscrire comme invité</h2>
                                <p className="text-sm text-muted-foreground mt-0.5">{eventName}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-foreground">
                                    Nom complet <span style={{ color: "var(--accent)" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Jean Dupont"
                                    className="border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-foreground">
                                    Email <span style={{ color: "var(--accent)" }}>*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="jean@example.com"
                                    className="border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {status === "error" && (
                                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                    {errorMsg}
                                </p>
                            )}

                            <div className="flex gap-3 mt-1">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={status === "sending"}
                                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-colors"
                                    style={{ backgroundColor: "var(--primary)" }}
                                >
                                    {status === "sending" ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Inscription...
                                        </span>
                                    ) : (
                                        "S'inscrire"
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
