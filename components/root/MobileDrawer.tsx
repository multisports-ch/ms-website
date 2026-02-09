"use client";

import Link from "next/link";

type NavLink = { href: string; label: string };

export default function MobileDrawer({
    mobileOpen,
    onClose,
    navLinks,
    isActive,
}: {
    mobileOpen: boolean;
    onClose: () => void;
    navLinks: NavLink[];
    isActive: (href: string) => boolean;
}) {
    return (
        <div className={`fixed inset-0 z-50 ${mobileOpen ? "" : "pointer-events-none"}`}>
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/50 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"}`}
            />

            <aside
                role="dialog"
                aria-modal="true"
                className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transform transition-transform ${
                    mobileOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-end p-4 border-b">
                    <button onClick={onClose} aria-label="Close menu" className="p-2 rounded-md hover:bg-gray-100">
                        <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className={`block px-3 py-2 rounded-md text-sm font-medium ${
                                isActive(link.href) ? "text-accent font-semibold" : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto p-4 border-t">
                    <Link href="/sign-in" onClick={onClose} className="block w-full text-center bg-primary text-white px-4 py-2 rounded-3xl">
                        Connexion
                    </Link>
                </div>
            </aside>
        </div>
    );
}
