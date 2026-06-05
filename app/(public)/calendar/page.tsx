import { getCurrentSeason } from "@/lib/queries";
import { getUpcomingEvents, getSeasonEventsAll, getVisibleNews } from "@/lib/queries";
import UpcomingEvents from "@/components/public/calendar/UpcomingEvents";
import NewsCard from "@/components/public/NewsCard";

export default async function CalendarPage() {
    const currentSeason = await getCurrentSeason();

    const [upcomingEvents, allEvents, newsItems] = await Promise.all([
        currentSeason ? getUpcomingEvents(currentSeason.id) : Promise.resolve([]),
        currentSeason ? getSeasonEventsAll(currentSeason.id) : Promise.resolve([]),
        getVisibleNews()
    ]);

    const upcomingSport = upcomingEvents.find((e) => e.type === "sport") ?? null;
    const upcomingDefi = upcomingEvents.find((e) => e.type === "defi") ?? null;

    return (
        <div className="px-6 md:px-12 py-16 flex flex-col gap-16">
            {/* Header */}
            <div>
                <div className="w-10 h-1 rounded-full mb-3" style={{ backgroundColor: "var(--accent)" }} />
                <h1 className="text-5xl font-black tracking-tight text-foreground">Calendrier</h1>
                {currentSeason && (
                    <p className="text-muted-foreground mt-2 text-lg">
                        Saison <span className="text-foreground font-semibold">{currentSeason.name}</span>
                    </p>
                )}
            </div>

            {/* Upcoming events */}
            <UpcomingEvents
                upcomingSport={
                    upcomingSport
                        ? {
                              ...upcomingSport,
                              date: upcomingSport.date ? new Date(upcomingSport.date).toISOString() : null
                          }
                        : null
                }
                upcomingDefi={
                    upcomingDefi
                        ? {
                              ...upcomingDefi,
                              date: upcomingDefi.date ? new Date(upcomingDefi.date).toISOString() : null
                          }
                        : null
                }
            />

            {/* Season schedule table */}
            {allEvents.length > 0 && (
                <section>
                    <h2 className="text-2xl font-black text-foreground mb-6">Programme de la saison</h2>
                    <div className="rounded-2xl overflow-hidden border border-border shadow">
                        <table className="w-full text-sm bg-card">
                            <thead>
                                <tr style={{ backgroundColor: "var(--primary)" }}>
                                    <th className="px-5 py-3 text-left text-white text-xs font-bold uppercase tracking-widest">
                                        Date
                                    </th>
                                    <th className="px-5 py-3 text-left text-white text-xs font-bold uppercase tracking-widest">
                                        Événement
                                    </th>
                                    <th className="px-5 py-3 text-left text-white text-xs font-bold uppercase tracking-widest">
                                        Type
                                    </th>
                                    <th className="px-5 py-3 text-left text-white text-xs font-bold uppercase tracking-widest hidden md:table-cell">
                                        Lieu
                                    </th>
                                    <th className="px-5 py-3 text-center text-white text-xs font-bold uppercase tracking-widest hidden sm:table-cell">
                                        Membres
                                    </th>
                                    <th className="px-5 py-3 text-center text-white text-xs font-bold uppercase tracking-widest hidden sm:table-cell">
                                        Invités
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {allEvents.map((event) => {
                                    const isPast = event.date && new Date(event.date) < new Date();
                                    return (
                                        <tr
                                            key={event.id}
                                            className={`transition-colors hover:bg-muted/50 ${isPast ? "opacity-50" : ""}`}
                                        >
                                            <td className="px-5 py-3 text-foreground font-medium whitespace-nowrap">
                                                {event.date
                                                    ? new Date(event.date).toLocaleDateString("fr-CH", {
                                                          day: "numeric",
                                                          month: "short"
                                                      })
                                                    : "—"}
                                                {event.time && (
                                                    <span className="text-muted-foreground text-xs ml-1">
                                                        {event.time}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 font-semibold text-foreground">{event.name}</td>
                                            <td className="px-5 py-3">
                                                <span
                                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                        event.type === "sport"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-purple-100 text-purple-700"
                                                    }`}
                                                >
                                                    {event.type === "sport" ? "Sport" : "Défi"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                                                {event.location ?? "—"}
                                            </td>
                                            <td className="px-5 py-3 text-center text-muted-foreground hidden sm:table-cell">
                                                {event.memberPrice
                                                    ? `CHF ${(event.memberPrice / 100).toFixed(2)}`
                                                    : "—"}
                                            </td>
                                            <td className="px-5 py-3 text-center text-muted-foreground hidden sm:table-cell">
                                                {event.guestPrice ? `CHF ${(event.guestPrice / 100).toFixed(2)}` : "—"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* News section */}
            {newsItems.length > 0 && (
                <section>
                    <h2 className="text-2xl font-black text-foreground mb-6">Actualités</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newsItems.map((item) => (
                            <NewsCard
                                key={item.id}
                                item={{
                                    ...item,
                                    publishedAt: item.publishedAt.toISOString()
                                }}
                            />
                        ))}
                    </div>
                </section>
            )}

            {newsItems.length === 0 && (
                <section>
                    <h2 className="text-2xl font-black text-foreground mb-6">Actualités</h2>
                    <p className="text-muted-foreground">Aucune actualité pour le moment.</p>
                </section>
            )}
        </div>
    );
}
