"use client";

import { useEffect, useState } from "react";

interface User {
    id: string;
    name: string | null;
    email: string | null;
    role: "member" | "admin";
    createdAt: string;
}

const emptyForm = {
    name: "",
    email: "",
    password: "",
    role: "member" as "member" | "admin"
};

export default function AdminMembersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function load() {
        const res = await fetch("/api/admin/members");
        const data = await res.json();
        setUsers(data);
    }

    useEffect(() => {
        load();
    }, []);

    async function handleCreate() {
        setError("");
        if (!form.email || !form.password) {
            setError("Email et mot de passe requis.");
            return;
        }
        setSaving(true);

        const res = await fetch("/api/admin/members", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error ?? "Une erreur est survenue.");
            setSaving(false);
            return;
        }

        setSaving(false);
        setAdding(false);
        setForm(emptyForm);
        load();
    }

    async function handleDelete(user: User) {
        if (!confirm(`Supprimer le compte de ${user.name ?? user.email} ?`)) return;

        const res = await fetch("/api/admin/members", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: user.id })
        });

        const data = await res.json();
        if (!res.ok) {
            alert(data.error);
            return;
        }

        load();
    }

    const members = users.filter((u) => u.role === "member");
    const admins = users.filter((u) => u.role === "admin");

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Comptes</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {users.length} compte{users.length !== 1 ? "s" : ""} au total
                    </p>
                </div>
                <button
                    onClick={() => {
                        setAdding(true);
                        setError("");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + Nouveau compte
                </button>
            </div>

            {/* Create form */}
            {adding && (
                <div className="bg-white rounded-xl shadow border border-gray-100 p-6 max-w-md">
                    <h2 className="font-semibold text-gray-800 mb-4">Nouveau compte</h2>
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                                Nom (optionnel)
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Jean Dupont"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                                Email <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="jean@example.com"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                                Mot de passe <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Min. 8 caractères"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                                Rôle
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, role: "member" })}
                                    className={`py-2 text-sm font-semibold rounded-lg border transition-colors ${
                                        form.role === "member"
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    Membre
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, role: "admin" })}
                                    className={`py-2 text-sm font-semibold rounded-lg border transition-colors ${
                                        form.role === "admin"
                                            ? "bg-gray-800 text-white border-gray-800"
                                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    Admin
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={handleCreate}
                                disabled={saving}
                                className="flex-1 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {saving ? "Création..." : "Créer le compte"}
                            </button>
                            <button
                                onClick={() => {
                                    setAdding(false);
                                    setError("");
                                    setForm(emptyForm);
                                }}
                                className="flex-1 py-2 border text-sm rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Admins */}
            <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
                    Administrateurs — {admins.length}
                </h2>
                <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                    {admins.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">Aucun administrateur.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                                    <th className="px-5 py-3 text-left">Nom</th>
                                    <th className="px-5 py-3 text-left">Email</th>
                                    <th className="px-5 py-3 text-left">Créé le</th>
                                    <th className="px-5 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {admins.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3 font-medium text-gray-800">
                                            {user.name ?? <span className="text-gray-400 italic">Sans nom</span>}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600">{user.email}</td>
                                        <td className="px-5 py-3 text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString("fr-CH", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="text-xs px-3 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>

            {/* Members */}
            <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
                    Membres — {members.length}
                </h2>
                <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                    {members.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">Aucun membre.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                                    <th className="px-5 py-3 text-left">Nom</th>
                                    <th className="px-5 py-3 text-left">Email</th>
                                    <th className="px-5 py-3 text-left">Créé le</th>
                                    <th className="px-5 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {members.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3 font-medium text-gray-800">
                                            {user.name ?? <span className="text-gray-400 italic">Sans nom</span>}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600">{user.email}</td>
                                        <td className="px-5 py-3 text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString("fr-CH", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="text-xs px-3 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </div>
    );
}
