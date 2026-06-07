"use client";

import { useEffect, useState } from "react";

interface Submission {
    id: string;
    name: string;
    email: string;
    message: string;
    submittedAt: string;
    read: boolean;
}

export default function AdminContactPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [selected, setSelected] = useState<Submission | null>(null);

    async function load() {
        const res = await fetch("/api/admin/contact");
        const data = await res.json();
        // Most recent first
        setSubmissions(data.reverse());
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSelect(submission: Submission) {
        setSelected(submission);
        if (!submission.read) {
            await fetch("/api/admin/contact", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: submission.id, read: true })
            });
            setSubmissions((prev) => prev.map((s) => (s.id === submission.id ? { ...s, read: true } : s)));
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Supprimer ce message ?")) return;
        await fetch("/api/admin/contact", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        if (selected?.id === id) setSelected(null);
        load();
    }

    const unreadCount = submissions.filter((s) => !s.read).length;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-800">Messages de contact</h1>
                {unreadCount > 0 && (
                    <span
                        className="px-2.5 py-0.5 text-xs font-bold rounded-full text-white"
                        style={{ backgroundColor: "var(--primary)" }}
                    >
                        {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {submissions.length === 0 ? (
                <div className="text-center py-16 text-gray-400 bg-white rounded-xl shadow">
                    Aucun message reçu pour le moment.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* List */}
                    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden lg:col-span-1">
                        <div className="divide-y divide-gray-50">
                            {submissions.map((submission) => (
                                <div
                                    key={submission.id}
                                    onClick={() => handleSelect(submission)}
                                    className={`flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors ${
                                        selected?.id === submission.id
                                            ? "bg-blue-50 border-l-4 border-l-blue-500"
                                            : "hover:bg-gray-50 border-l-4 border-l-transparent"
                                    }`}
                                >
                                    {/* Unread dot */}
                                    <div className="mt-1.5 shrink-0">
                                        {submission.read ? (
                                            <div className="w-2 h-2 rounded-full bg-gray-200" />
                                        ) : (
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: "var(--primary)" }}
                                            />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p
                                                className={`text-sm truncate ${
                                                    submission.read
                                                        ? "font-medium text-gray-700"
                                                        : "font-bold text-gray-900"
                                                }`}
                                            >
                                                {submission.name}
                                            </p>
                                            <p className="text-xs text-gray-400 shrink-0">
                                                {new Date(submission.submittedAt).toLocaleDateString("fr-CH", {
                                                    day: "numeric",
                                                    month: "short"
                                                })}
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-400 truncate">{submission.email}</p>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">{submission.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detail view */}
                    <div className="lg:col-span-2">
                        {selected ? (
                            <div className="bg-white rounded-xl shadow border border-gray-100 p-6 flex flex-col gap-5">
                                {/* Meta */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{selected.name}</h2>
                                        <a
                                            href={`mailto:${selected.email}`}
                                            className="text-sm text-blue-500 hover:underline"
                                        >
                                            {selected.email}
                                        </a>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(selected.submittedAt).toLocaleDateString("fr-CH", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            })}
                                            {" à "}
                                            {new Date(selected.submittedAt).toLocaleTimeString("fr-CH", {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(selected.id)}
                                        className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                                    >
                                        Supprimer
                                    </button>
                                </div>

                                <hr className="border-gray-100" />

                                {/* Message */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                                        Message
                                    </p>
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {selected.message}
                                    </p>
                                </div>

                                <hr className="border-gray-100" />

                                {/* Reply button */}
                                <a
                                    href={`mailto:${selected.email}?subject=Re: votre message Multisports`}
                                    className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                                    style={{ backgroundColor: "var(--primary)" }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 10l9-7 9 7v11a1 1 0 01-1 1H4a1 1 0 01-1-1V10z"
                                        />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
                                    </svg>
                                    Répondre par email
                                </a>
                            </div>
                        ) : (
                            <div className="text-center py-16 text-gray-400 bg-white rounded-xl shadow border border-gray-100">
                                <p className="text-sm">Sélectionnez un message pour le lire.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
