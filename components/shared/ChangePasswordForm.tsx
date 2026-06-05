"use client";

import { useState } from "react";

type Status = "idle" | "saving" | "success" | "error";

export default function ChangePasswordForm() {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [status, setStatus] = useState<Status>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg("");

        if (form.newPassword !== form.confirmPassword) {
            setErrorMsg("Les mots de passe ne correspondent pas.");
            return;
        }

        setStatus("saving");

        const res = await fetch("/api/auth/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            })
        });

        const data = await res.json();

        if (!res.ok) {
            setErrorMsg(data.error ?? "Une erreur est survenue.");
            setStatus("error");
            return;
        }

        setStatus("success");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setStatus("idle"), 3000);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">Mot de passe actuel</label>
                <input
                    type="password"
                    value={form.currentPassword}
                    onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">Nouveau mot de passe</label>
                <input
                    type="password"
                    value={form.newPassword}
                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">Confirmer le nouveau mot de passe</label>
                <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                />
            </div>

            {(status === "error" || errorMsg) && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{errorMsg}</p>
            )}

            {status === "success" && (
                <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    ✓ Mot de passe modifié avec succès.
                </p>
            )}

            <button
                type="submit"
                disabled={status === "saving"}
                className="self-start flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50"
                style={{ backgroundColor: "var(--primary)" }}
            >
                {status === "saving" ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enregistrement...
                    </>
                ) : (
                    "Changer le mot de passe"
                )}
            </button>
        </form>
    );
}
