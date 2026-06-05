"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CommitteeMemberForm from "@/components/admin/CommitteeMemberForm";

interface Member {
    id: string;
    name: string;
    role: string;
    photoUrl?: string | null;
    order: number;
}

export default function AdminCommitteePage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [editing, setEditing] = useState<Member | null>(null);
    const [adding, setAdding] = useState(false);

    async function load() {
        const res = await fetch("/api/admin/committee");
        const data = await res.json();
        setMembers(data);
    }

    useEffect(() => {
        load();
    }, []);

    async function handleDelete(id: string) {
        if (!confirm("Delete this member?")) return;
        await fetch("/api/admin/committee", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        load();
    }

    function handleSaved() {
        setEditing(null);
        setAdding(false);
        load();
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Committee Members</h1>
                <button
                    onClick={() => setAdding(true)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + Add member
                </button>
            </div>

            {adding && (
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h2 className="font-semibold text-gray-800 mb-4">New Member</h2>
                    <CommitteeMemberForm onSave={handleSaved} onCancel={() => setAdding(false)} />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map((member) => (
                    <div key={member.id} className="bg-white rounded-xl shadow p-6">
                        {editing?.id === member.id ? (
                            <CommitteeMemberForm
                                initial={member}
                                onSave={handleSaved}
                                onCancel={() => setEditing(null)}
                            />
                        ) : (
                            <div className="flex items-center gap-4">
                                {member.photoUrl ? (
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                                        <Image src={member.photoUrl} alt={member.name} fill className="object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                        <span className="text-gray-400 text-lg font-bold">{member.name[0]}</span>
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800">{member.name}</p>
                                    <p className="text-sm text-gray-500">{member.role}</p>
                                    <p className="text-xs text-gray-400">Order: {member.order}</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => setEditing(member)}
                                        className="px-3 py-1 text-xs border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="px-3 py-1 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
