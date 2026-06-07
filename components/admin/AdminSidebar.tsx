"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/shared/SignOutButton";

const navItems = [
    { label: "Tableau de bord", href: "/admin/dashboard" },
    { label: "Contenu", href: "/admin/content" },
    { label: "Comité", href: "/admin/committee" },
    { label: "Actualités", href: "/admin/news" },
    { label: "Saisons & Classement", href: "/admin/leaderboard" },
    { label: "Membres", href: "/admin/members" },
    { label: "Contact", href: "/admin/contact" }
];

export default function AdminSidebar({ user }: { user: { name?: string | null; email?: string | null } }) {
    const pathname = usePathname();

    return (
        <aside className="w-full md:w-64 bg-white shadow flex flex-col md:min-h-screen">
            <div className="flex items-center justify-between gap-4 p-4 border-b md:flex-col md:items-start">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Espace admin</p>
                    <p className="font-semibold text-gray-800 mt-1 truncate">{user.name ?? user.email}</p>
                </div>
            </div>

            <nav className="flex flex-row md:flex-col flex-wrap gap-1 p-3 overflow-x-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            pathname === item.href ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t">
                <SignOutButton />
            </div>
        </aside>
    );
}
