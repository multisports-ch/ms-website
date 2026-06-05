"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DesktopNav from "@/components/public/DesktopNav";
import MobileDrawer from "@/components/public/MobileDrawer";

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

    const sponsors = [
        {
            name: "Focus Water",
            href: "https://focuswater.ch/",
            logo: "/images/focuswater-logo-blau.webp",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
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
                                href="/login"
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

            <main className="flex-1 pt-16">{children}</main>

            <footer className="bg-primary text-white">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto py-8 grid gap-6 sm:grid-cols-2">
                        <div>
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-200">Nos sponsors</h2>
                            <ul className="mt-3 space-y-4 text-sm">
                                {sponsors.map((sponsor) => (
                                    <li key={sponsor.name} className="flex items-center gap-3">
                                        <Link href={sponsor.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 hover:opacity-90">
                                            <Image src={sponsor.logo} alt={`${sponsor.name} logo`} width={160} height={60} className="h-14 w-auto object-contain" />
                                            <span className="text-sm text-gray-100">{sponsor.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-200">Nous suivre</h2>
                            <div className="mt-4 flex flex-col gap-3">
                                <Link href="https://www.instagram.com/ms.multisports/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-sm font-medium text-gray-100 hover:opacity-90">
                                    <Image src="/icons/instagram-logo.webp" alt="Instagram" width={24} height={24} className="h-6 w-6 object-contain" />
                                    Instagram
                                </Link>
                                <Link href="https://www.tiktok.com/@ms.multisports" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-sm font-medium text-gray-100 hover:opacity-90">
                                    <Image src="/icons/tiktok-logo.png" alt="TikTok" width={24} height={24} className="h-6 w-6 object-contain" />
                                    TikTok
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/20 mt-6 pt-4 text-sm text-gray-200 flex items-center justify-between gap-4">
                        <p>© {new Date().getFullYear()} Association Multisports. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
