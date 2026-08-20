import { getJoinPageContent } from "@/lib/queries";
import { getCurrentSeason, getUpcomingEvents } from "@/lib/queries";
import UpcomingEvents from "@/components/public/calendar/UpcomingEvents";
import LinkedText from "@/components/shared/LinkedText";

function DownloadButton({ url, label }: { url: string | null | undefined; label: string }) {
    if (!url) return null;
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors group"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
            </svg>
            {label}
        </a>
    );
}

export default async function JoinPage() {
    const [content, currentSeason] = await Promise.all([getJoinPageContent(), getCurrentSeason()]);
    const upcomingEvents = currentSeason ? await getUpcomingEvents(currentSeason.id) : [];
    const upcomingSport = upcomingEvents.find((event) => event.type === "sport") ?? null;
    const upcomingDefi = upcomingEvents.find((event) => event.type === "defi") ?? null;

    return (
        <div className="px-4 sm:px-6 md:px-12 py-10 sm:py-16 flex flex-col gap-12 sm:gap-16">
            <div>
                <div className="w-10 h-1 rounded-full mb-3" style={{ backgroundColor: "var(--accent)" }} />
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">Rejoindre Multisports</h1>
                <p className="text-muted-foreground mt-2 text-base sm:text-lg">Découvrez le prochain sport et défi de la saison.</p>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 sm:gap-10">
                <div className="flex flex-col gap-8">
                    <div>
                        <div className="w-8 h-1 rounded-full mb-4" style={{ backgroundColor: "var(--accent)" }} />
                        <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-4">L'association</h2>
                        <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            <LinkedText
                                text={
                                    content["join_association_text"]?.text ??
                                    "Multisports permet de découvrir régulièrement de nouveaux sports dans une ambiance conviviale. Pour devenir membre, consultez les documents officiels, prenez connaissance des règles et remplissez le formulaire en ligne. Les frais et les conditions de participation sont précisés dans les informations de l'association et ses statuts."
                                }
                            />
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-black text-foreground mb-4">Règles et frais</h2>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            La participation aux activités se fait dans le respect des règles de l'association. Les frais
                            de membre et les éventuels frais liés aux activités sont indiqués dans les documents officiels.
                        </p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 flex flex-col gap-5 h-fit">
                    <div>
                        <h2 className="text-2xl font-black text-foreground">Devenir membre</h2>
                        <p className="text-sm text-muted-foreground mt-2">Lisez les documents officiels, puis remplissez le formulaire en ligne.</p>
                    </div>
                    <div className="flex flex-col items-start gap-3">
                        <DownloadButton url={content["join_statuts_document"]?.fileUrl} label="Télécharger les statuts" />
                        <DownloadButton url={content["join_rules_document"]?.fileUrl} label="Télécharger les règles" />
                    </div>
                    {content["join_membership_form"]?.fileUrl && (
                        <a
                            href={content["join_membership_form"].fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-bold text-white text-center hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: "var(--primary)" }}
                        >
                            Remplir le formulaire pour devenir membre
                        </a>
                    )}
                </div>
            </section>

            <UpcomingEvents
                upcomingSport={
                    upcomingSport
                        ? { ...upcomingSport, date: upcomingSport.date ? new Date(upcomingSport.date).toISOString() : null }
                        : null
                }
                upcomingDefi={
                    upcomingDefi
                        ? { ...upcomingDefi, date: upcomingDefi.date ? new Date(upcomingDefi.date).toISOString() : null }
                        : null
                }
            />
        </div>
    );
}
