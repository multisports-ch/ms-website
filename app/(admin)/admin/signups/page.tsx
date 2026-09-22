import Link from "next/link";
import { db } from "@/db";
import { eventSignups, events, seasons } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import RemoveGuestSignupButton from "@/components/admin/RemoveGuestSignupButton";

async function getEventSignupOverview() {
    const eventRows = await db
        .select({ event: events, seasonName: seasons.name })
        .from(events)
        .leftJoin(seasons, eq(events.seasonId, seasons.id))
        .orderBy(asc(events.date));

    return Promise.all(
        eventRows.map(async ({ event, seasonName }) => ({
            event,
            seasonName,
            signups: await db.query.eventSignups.findMany({
                where: eq(eventSignups.eventId, event.id),
                with: {
                    user: { columns: { name: true, email: true } },
                    guest: { columns: { name: true, email: true } }
                }
            })
        }))
    );
}

export default async function AdminSignupsPage() {
    const eventOverviews = await getEventSignupOverview();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inscriptions aux événements</h1>
                    <p className="text-sm text-gray-500 mt-1">Tous les événements et leurs membres ou invités inscrits.</p>
                </div>
                <Link href="/admin/leaderboard" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                    Gérer les événements
                </Link>
            </div>

            {eventOverviews.length === 0 ? (
                <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400">
                    Aucun événement.
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    {eventOverviews.map(({ event, seasonName, signups }) => (
                        <section key={event.id} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow">
                            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        {seasonName ?? "Sans saison"}
                                    </p>
                                    <h2 className="mt-1 font-bold text-gray-800">{event.name ?? "Événement sans nom"}</h2>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {event.date
                                            ? new Date(event.date).toLocaleDateString("fr-CH", {
                                                  weekday: "short",
                                                  day: "numeric",
                                                  month: "short",
                                                  year: "numeric"
                                              })
                                            : "Date non définie"}
                                        {event.time && ` · ${event.time}`}
                                    </p>
                                </div>
                                <div className="flex shrink-0 flex-col items-end gap-1">
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700">
                                        {signups.length} inscrit{signups.length !== 1 ? "s" : ""}
                                    </span>
                                    <span className={`text-xs font-medium ${event.signupOpen ? "text-green-600" : "text-red-500"}`}>
                                        {event.signupOpen ? "Ouvert" : "Fermé"}
                                    </span>
                                </div>
                            </div>
                            {signups.length === 0 ? (
                                <p className="px-5 py-6 text-sm text-gray-400">Aucune inscription.</p>
                            ) : (
                                <ul className="divide-y divide-gray-50">
                                    {signups.map((signup) => (
                                        <li key={signup.id} className="flex items-center justify-between gap-4 px-5 py-3">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-gray-800">
                                                    {signup.user?.name ?? signup.guest?.name ?? "Sans nom"}
                                                </p>
                                                <p className="truncate text-xs text-gray-400">
                                                    {signup.user?.email ?? signup.guest?.email ?? ""}
                                                </p>
                                                {signup.guest?.phone && (
                                                    <p className="truncate text-xs text-gray-400">{signup.guest.phone}</p>
                                                )}
                                            </div>
                                            <div className="flex shrink-0 items-center gap-3">
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${signup.user ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                                                    {signup.user ? "Membre" : "Invité"}
                                                </span>
                                                {signup.guest && <RemoveGuestSignupButton signupId={signup.id} />}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}