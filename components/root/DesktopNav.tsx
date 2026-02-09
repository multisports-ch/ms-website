"use client";

import Link from "next/link";

type NavLink = { href: string; label: string };

export default function DesktopNav({
    navLinks,
    isActive,
}: {
    navLinks: NavLink[];
    isActive: (href: string) => boolean;
}) {
    return (
        <nav className="hidden sm:flex flex-1 justify-center">
            <div className="flex gap-8">
                {navLinks.map((link) => (
                    <div key={link.href} className="relative group h-16 flex items-center">
                        <Link
                            href={link.href}
                            className={`font-medium transition-colors ${
                                isActive(link.href) ? "text-[#FECE17]" : "text-gray-700 hover:text-gray-900"
                            }`}
                        >
                            {link.label}
                        </Link>
                        {isActive(link.href) && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t-lg"></div>
                        )}
                    </div>
                ))}
            </div>
        </nav>
    );
}
