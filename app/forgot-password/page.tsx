"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Status = "idle" | "sending" | "sent";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<Status>("idle");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("sending");
        // TODO: wire up email service
        await new Promise((r) => setTimeout(r, 1000));
        setStatus("sent");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <Image
                        src="/images/logo_lettrine_bleu.svg"
                        alt="Logo"
                        width={48}
                        height={48}
                        className="h-12 w-auto"
                    />
                </div>

                <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
                    <div className="mb-6">
                        <div className="w-8 h-1 rounded-full mb-3" style={{ backgroundColor: "var(--accent)" }} />
                        <h1 className="text-2xl font-black text-foreground">Mot de passe oublié</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Entrez votre email et nous vous enverrons un lien de réinitialisation.
                        </p>
                    </div>

                    {status === "sent" ? (
                        <div className="text-center flex flex-col items-center gap-3 py-4">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                                style={{ backgroundColor: "var(--accent)" }}
                            >
                                ✓
                            </div>
                            <p className="font-semibold text-foreground">Email envoyé !</p>
                            <p className="text-sm text-muted-foreground">
                                Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien dans quelques
                                minutes.
                            </p>
                            <Link
                                href="/login"
                                className="mt-2 text-sm font-medium underline text-muted-foreground hover:text-foreground"
                            >
                                Retour à la connexion
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-foreground">Adresse email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="jean.dupont@example.com"
                                    className="border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50"
                                style={{ backgroundColor: "var(--primary)" }}
                            >
                                {status === "sending" ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Envoi en cours...
                                    </>
                                ) : (
                                    "Envoyer le lien"
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    <Link href="/login" className="hover:text-foreground transition-colors">
                        ← Retour à la connexion
                    </Link>
                </p>
            </div>
        </div>
    );
}
