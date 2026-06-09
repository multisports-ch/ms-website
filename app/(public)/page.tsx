import Image from "next/image";
import Link from "next/link";
import { getContentBlock, getCommitteeMembers } from "@/lib/queries";
import ComiteCard from "@/components/public/ComiteCard";

export default async function Home() {
    const [heroImage, heroTitle, heroSubtitle, aboutText, members] = await Promise.all([
        getContentBlock("home_hero_image"),
        getContentBlock("home_hero_title"),
        getContentBlock("home_hero_subtitle"),
        getContentBlock("home_about_text"),
        getCommitteeMembers()
    ]);

    return (
        <div className="flex flex-col">
            {/* ── HERO ─────────────────────────────────────────────── */}
            <section className="relative md:min-h-[85vh] flex flex-col md:flex-row overflow-hidden">
                {/* Image — full bleed left, no gradient */}
                <div className="relative w-full md:w-3/5 min-h-[50vw] md:min-h-0">
                    <Image
                        src={heroImage?.imageUrl ?? "/images/multisports.jpg"}
                        alt={heroImage?.imageAlt ?? "Multisports"}
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

                {/* Text panel */}
                <div className="w-full md:w-2/5 flex flex-col justify-center px-8 md:px-14 py-14 md:py-0">
                    <div className="w-12 h-1.5 rounded-full mb-6" style={{ backgroundColor: "var(--accent)" }} />
                    <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black leading-tight tracking-tight text-foreground">
                        {heroTitle?.text ?? "Multisports : la découverte sportive sans routine"}
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground mt-5 leading-relaxed max-w-md">
                        {heroSubtitle?.text ??
                            "Venez essayer un sport différent toutes les 6 semaines et gardez le plaisir de bouger toute l'année."}
                    </p>
                </div>
            </section>

            {/* ── LE CONCEPT ───────────────────────────────────────── */}
            <section className="relative px-6 md:px-12 py-20 md:py-28">
                <span
                    className="absolute right-6 top-8 text-[10rem] font-black leading-none select-none pointer-events-none hidden md:block"
                    style={{ color: "var(--accent)", opacity: 0.12 }}
                >
                    MS
                </span>

                <div className="max-w-3xl relative z-10">
                    <div className="w-8 h-1 rounded-full mb-4" style={{ backgroundColor: "var(--accent)" }} />
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mb-6">Le Concept</h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        {aboutText?.text ?? "Nouveaux sports et défis toutes les 6 semaines..."}
                    </p>

                    {/* Buttons moved here from hero */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                        <Link href="/join">
                            <button
                                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base text-white transition-all hover:opacity-90 active:scale-95 group"
                                style={{ backgroundColor: "var(--primary)" }}
                            >
                                Viens essayer
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14" />
                                    <path d="M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </Link>
                        <Link href="/calendar">
                            <button className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base border-2 border-border text-foreground hover:bg-muted transition-colors">
                                Calendrier
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Stats strip */}
                <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl">
                    {[
                        { value: "7", label: "sports par saison" },
                        { value: "6", label: "semaines par sport" },
                        { value: "7", label: "défis associés" }
                    ].map((stat) => (
                        <div key={stat.label} className="flex flex-col gap-1">
                            <span className="text-4xl font-black" style={{ color: "var(--primary)" }}>
                                {stat.value}
                            </span>
                            <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── LE COMITÉ ────────────────────────────────────────── */}
            <section className="px-6 md:px-12 py-20 md:py-28" style={{ backgroundColor: "var(--secondary)" }}>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="w-8 h-1 rounded-full mb-4" style={{ backgroundColor: "var(--accent)" }} />
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">Le Comité</h2>
                    </div>
                    <Link
                        href="/contact"
                        className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 shrink-0 mb-1"
                    >
                        Nous contacter
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {members.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {members.map((member) => (
                            <ComiteCard
                                key={member.id}
                                src={member.photoUrl ?? "/images/placeholder.jpg"}
                                alt={member.name}
                                name={member.name}
                                role={member.role}
                                description={member.description ?? undefined}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">Aucun membre du comité pour le moment.</p>
                )}
            </section>
        </div>
    );
}
