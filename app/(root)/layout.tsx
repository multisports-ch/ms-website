"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DesktopNav from "@/components/root/DesktopNav";
import MobileDrawer from "@/components/root/MobileDrawer";

const Layout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Accueil" },
        { href: "/calendar", label: "Calendrier" },
        { href: "/leaderboard", label: "Classement" },
        { href: "/join", label: "Participer" },
        { href: "/contact", label: "Contact" },
    ];

    const isActive = (href: string) => pathname === href;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">
                        <div className="shrink-0">
                            <Link href="/">
                                <Image
                                    src="/images/logo_lettrine_bleu.svg"
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    className="h-10 w-auto"
                                />
                            </Link>
                        </div>

                        <DesktopNav navLinks={navLinks} isActive={isActive} />

                        <div className="shrink-0 hidden sm:block">
                            <Link
                                href="/sign-in"
                                className="bg-primary hover:opacity-90 text-white font-medium px-4 py-2 rounded-3xl transition-colors text-sm"
                            >
                                Connexion
                            </Link>
                        </div>

                        <div className="sm:hidden">
                            <button
                                aria-label="Open menu"
                                aria-expanded={mobileOpen}
                                onClick={() => setMobileOpen(true)}
                                className="p-2 rounded-md hover:bg-gray-100"
                            >
                                <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <MobileDrawer
                        mobileOpen={mobileOpen}
                        onClose={() => setMobileOpen(false)}
                        navLinks={navLinks}
                        isActive={isActive}
                    />
                </div>
            </header>

            <main className="flex-1">{children}</main>
        </div>
    );
};

export default Layout;
