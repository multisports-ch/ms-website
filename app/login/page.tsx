"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Status = "idle" | "loading" | "error";

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<Status>("idle");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false
        });

        if (result?.error) {
            setStatus("error");
            return;
        }

        const res = await fetch("/api/auth/session");
        const session = await res.json();

        if (session?.user?.role === "admin") {
            router.push("/admin/dashboard");
        } else {
            router.push("/dashboard");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
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
                    {/* Header */}
                    <div className="mb-6">
                        <div className="w-8 h-1 rounded-full mb-3" style={{ backgroundColor: "var(--accent)" }} />
                        <h1 className="text-2xl font-black text-foreground">Connexion</h1>
                        <p className="text-muted-foreground text-sm mt-1">Espace réservé aux membres Multisports.</p>
                    </div>

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

                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-foreground">Mot de passe</label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                            />
                        </div>

                        {status === "error" && (
                            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                Email ou mot de passe incorrect.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="mt-1 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50"
                            style={{ backgroundColor: "var(--primary)" }}
                        >
                            {status === "loading" ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Connexion en cours...
                                </>
                            ) : (
                                "Se connecter"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    <Link href="/" className="hover:text-foreground transition-colors">
                        ← Retour au site
                    </Link>
                </p>
            </div>
        </div>
    );
}
