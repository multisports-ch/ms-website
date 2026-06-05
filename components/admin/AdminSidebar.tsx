"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Content", href: "/admin/content" },
    { label: "Committee", href: "/admin/committee" },
    { label: "News & Events", href: "/admin/news" },
    { label: "Leaderboard", href: "/admin/leaderboard" },
    { label: "Documents", href: "/admin/documents" },
    { label: "Members", href: "/admin/members" }
];

export default function AdminSidebar({ user }: { user: { name?: string | null; email?: string | null } }) {
    const pathname = usePathname();

    return (
        <aside className="w-64 min-h-screen bg-white shadow flex flex-col">
            <div className="p-6 border-b">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Admin Panel</p>
                <p className="font-semibold text-gray-800 mt-1 truncate">{user.name ?? user.email}</p>
            </div>

            <nav className="flex-1 p-4 flex flex-col gap-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            pathname === item.href ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                >
                    Sign out
                </button>
            </div>
        </aside>
    );
}
