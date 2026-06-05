import { auth } from "@/lib/auth";
import Link from "next/link";
import { db } from "@/db";
import { eventSignups, events, users, guests, seasons } from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";
import ChangePasswordForm from "@/components/shared/ChangePasswordForm";

const cards = [
    { label: "Content Blocks", href: "/admin/content", description: "Éditer les textes et images" },
    { label: "Comité", href: "/admin/committee", description: "Gérer les membres du comité" },
    { label: "Actualités", href: "/admin/news", description: "Créer et éditer les actualités" },
    { label: "Leaderboard", href: "/admin/leaderboard", description: "Gérer les classements" },
    { label: "Documents", href: "/admin/documents", description: "Gérer les fichiers" },
    { label: "Comptes", href: "/admin/members", description: "Gérer les membres" }
];

async function getUpcomingSignups() {
    const now = new Date();

    // Get current season
    const currentSeason = await db.select().from(seasons).where(eq(seasons.isCurrent, true)).limit(1);

    if (!currentSeason[0]) return { sport: null, defi: null };

    // Get upcoming events
    const upcomingEvents = await db
        .select()
        .from(events)
        .where(and(eq(events.seasonId, currentSeason[0].id), gte(events.date, now)))
        .orderBy(events.date);

    const upcomingSport = upcomingEvents.find((e) => e.type === "sport") ?? null;
    const upcomingDefi = upcomingEvents.find((e) => e.type === "defi") ?? null;

    async function getSignupsForEvent(event: typeof upcomingSport) {
        if (!event) return null;

        const signups = await db.query.eventSignups.findMany({
            where: eq(eventSignups.eventId, event.id),
            with: {
                user: { columns: { id: true, name: true, email: true } },
                guest: { columns: { id: true, name: true, email: true } }
            }
        });

        return { event, signups };
    }

    const [sportSignups, defiSignups] = await Promise.all([
        getSignupsForEvent(upcomingSport),
        getSignupsForEvent(upcomingDefi)
    ]);

    return { sport: sportSignups, defi: defiSignups };
}

export default async function AdminDashboardPage() {
    const session = await auth();
    const { sport, defi } = await getUpcomingSignups();

    return (
        <div className="flex flex-col gap-10">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    Bonjour, {session?.user.name ?? session?.user.email}
                </h1>
                <p className="text-gray-500 text-sm">Utilisez la barre latérale pour gérer le site.</p>
            </div>

            {/* Quick nav cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <Link
                        key={card.href}
                        href={card.href}
                        className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow"
                    >
                        <p className="font-semibold text-gray-800">{card.label}</p>
                        <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                    </Link>
                ))}
            </div>

            {/* Upcoming signups */}
            {(sport || defi) && (
                <div className="flex flex-col gap-6">
                    <h2 className="text-lg font-bold text-gray-800">Inscriptions aux prochains événements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[sport, defi].filter(Boolean).map((item) => (
                            <div
                                key={item!.event.id}
                                className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden"
                            >
                                {/* Event header */}
                                <div
                                    className="px-5 py-3 flex items-center justify-between"
                                    style={{
                                        backgroundColor: item!.event.type === "sport" ? "var(--primary)" : "#7c3aed"
                                    }}
                                >
                                    <div>
                                        <p className="font-bold text-white">{item!.event.name}</p>
                                        {item!.event.date && (
                                            <p className="text-xs text-white/70 mt-0.5">
                                                {new Date(item!.event.date).toLocaleDateString("fr-CH", {
                                                    weekday: "short",
                                                    day: "numeric",
                                                    month: "short"
                                                })}
                                                {item!.event.time && ` à ${item!.event.time}`}
                                            </p>
                                        )}
                                    </div>
                                    <span className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full">
                                        {item!.signups.length} inscrit{item!.signups.length !== 1 ? "s" : ""}
                                    </span>
                                </div>

                                {/* Signups list */}
                                {item!.signups.length === 0 ? (
                                    <p className="text-sm text-gray-400 text-center py-6">
                                        Aucune inscription pour le moment.
                                    </p>
                                ) : (
                                    <ul className="divide-y divide-gray-50">
                                        {item!.signups.map((signup) => (
                                            <li key={signup.id} className="flex items-center justify-between px-5 py-3">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {signup.user?.name ?? signup.guest?.name ?? "—"}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {signup.user?.email ?? signup.guest?.email ?? ""}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                        signup.user
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    {signup.user ? "Membre" : "Invité"}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Change password */}
            <div className="bg-white rounded-xl shadow p-6 max-w-md">
                <h2 className="text-lg font-bold text-gray-800 mb-1">Changer le mot de passe</h2>
                <p className="text-sm text-gray-500 mb-6">Choisissez un mot de passe d'au moins 8 caractères.</p>
                <ChangePasswordForm />
            </div>
        </div>
    );
}
