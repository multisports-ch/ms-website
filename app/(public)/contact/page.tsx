"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactPage() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: ""
    });
    const [status, setStatus] = useState<Status>("idle");

    function update(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("sending");

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: `${form.firstName} ${form.lastName}`.trim(),
                email: form.email,
                message: form.message
            })
        });

        setStatus(res.ok ? "success" : "error");
    }

    return (
        <div className="px-6 md:px-12 py-16 max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="w-10 h-1 rounded-full mb-3" style={{ backgroundColor: "var(--accent)" }} />
                <h1 className="text-5xl font-black tracking-tight text-foreground">Contact</h1>
                <p className="text-muted-foreground mt-3 text-lg">Une question ? N'hésitez pas à nous écrire.</p>
            </div>

            {status === "success" ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center flex flex-col items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                        style={{ backgroundColor: "var(--accent)" }}
                    >
                        ✓
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Message envoyé !</h2>
                    <p className="text-gray-500 text-sm">Nous vous répondrons dans les plus brefs délais.</p>
                    <button
                        onClick={() => {
                            setStatus("idle");
                            setForm({ firstName: "", lastName: "", email: "", message: "" });
                        }}
                        className="mt-2 text-sm font-medium underline text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        Envoyer un autre message
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Name row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-foreground">
                                Prénom <span style={{ color: "var(--accent)" }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={form.firstName}
                                onChange={(e) => update("firstName", e.target.value)}
                                required
                                placeholder="Jean"
                                className="border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-foreground">
                                Nom <span style={{ color: "var(--accent)" }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={form.lastName}
                                onChange={(e) => update("lastName", e.target.value)}
                                required
                                placeholder="Dupont"
                                className="border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-foreground">
                            Adresse email <span style={{ color: "var(--accent)" }}>*</span>
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            required
                            placeholder="jean.dupont@example.com"
                            className="border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                        />
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-foreground">
                            Message <span style={{ color: "var(--accent)" }}>*</span>
                        </label>
                        <textarea
                            value={form.message}
                            onChange={(e) => update("message", e.target.value)}
                            required
                            rows={6}
                            placeholder="Votre message..."
                            className="border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-none"
                        />
                    </div>

                    {status === "error" && (
                        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            Une erreur est survenue. Veuillez réessayer.
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="self-end flex items-center gap-2 px-8 py-3 rounded-3xl font-bold text-sm transition-all disabled:opacity-50 group"
                        style={{ backgroundColor: "var(--primary)", color: "white" }}
                    >
                        {status === "sending" ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                Envoyer
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14" />
                                    <path d="M12 5l7 7-7 7" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
