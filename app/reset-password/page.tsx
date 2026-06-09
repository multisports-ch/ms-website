"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Status = "idle" | "saving" | "success" | "error";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!token) setErrorMsg("Lien invalide. Veuillez faire une nouvelle demande.");
    }, [token]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg("");

        if (password !== confirm) {
            setErrorMsg("Les mots de passe ne correspondent pas.");
            return;
        }

        setStatus("saving");

        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password })
        });

        const data = await res.json();

        if (!res.ok) {
            setErrorMsg(data.error ?? "Une erreur est survenue.");
            setStatus("error");
            return;
        }

        setStatus("success");
        setTimeout(() => router.push("/login"), 3000);
    }

    return (
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
            <div className="mb-6">
                <div className="w-8 h-1 rounded-full mb-3" style={{ backgroundColor: "var(--accent)" }} />
                <h1 className="text-2xl font-black text-foreground">Nouveau mot de passe</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Choisissez un mot de passe d'au moins 8 caractères.
                </p>
            </div>

            {status === "success" ? (
                <div className="text-center flex flex-col items-center gap-3 py-4">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                        style={{ backgroundColor: "var(--accent)" }}
                    >
                        ✓
                    </div>
                    <p className="font-semibold text-foreground">Mot de passe modifié !</p>
                    <p className="text-sm text-muted-foreground">
                        Vous allez être redirigé vers la page de connexion...
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-foreground">Nouveau mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            disabled={!token}
                            className="border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-foreground">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                            placeholder="••••••••"
                            disabled={!token}
                            className="border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                    </div>

                    {(status === "error" || errorMsg) && (
                        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            {errorMsg}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={status === "saving" || !token}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-50"
                        style={{ backgroundColor: "var(--primary)" }}
                    >
                        {status === "saving" ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Enregistrement...
                            </>
                        ) : (
                            "Enregistrer le mot de passe"
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
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
                <Suspense
                    fallback={
                        <div className="bg-card border border-border rounded-2xl shadow-lg p-8 text-center text-muted-foreground text-sm">
                            Chargement...
                        </div>
                    }
                >
                    <ResetPasswordForm />
                </Suspense>
                <p className="text-center text-xs text-muted-foreground mt-6">
                    <Link href="/login" className="hover:text-foreground transition-colors">
                        ← Retour à la connexion
                    </Link>
                </p>
            </div>
        </div>
    );
}
