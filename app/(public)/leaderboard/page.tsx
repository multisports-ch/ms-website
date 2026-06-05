import {
    getAllSeasons,
    getCurrentSeason,
    getSeasonLeaderboard,
    getSeasonEvents,
    getEventResults,
    getMemberEventPoints
} from "@/lib/queries";
import SeasonLeaderboard from "@/components/public/leaderboard/SeasonLeaderboard";
import SeasonSelector from "@/components/public/leaderboard/SeasonSelector";

interface Props {
    searchParams: Promise<{ season?: string }>;
}

export default async function LeaderboardPage({ searchParams }: Props) {
    const { season } = await searchParams;

    const [allSeasons, currentSeason] = await Promise.all([getAllSeasons(), getCurrentSeason()]);

    const selectedSeasonId = season ?? currentSeason?.id ?? allSeasons[0]?.id;

    if (!selectedSeasonId) {
        return (
            <div className="px-6 md:px-12 py-16">
                <h1 className="text-4xl font-bold mb-4">Classement</h1>
                <p className="text-muted-foreground">Aucune saison disponible pour le moment.</p>
            </div>
        );
    }

    const selectedSeason = allSeasons.find((s) => s.id === selectedSeasonId);

    const [leaderboard, seasonEvents, memberEventPoints] = await Promise.all([
        getSeasonLeaderboard(selectedSeasonId),
        getSeasonEvents(selectedSeasonId),
        getMemberEventPoints(selectedSeasonId)
    ]);

    const eventsWithResults = await Promise.all(
        seasonEvents.map(async (e) => {
            const results = await getEventResults(e.id);
            return { event: e, hasResults: results.length > 0 };
        })
    );
    const lastEventWithResults = eventsWithResults.filter((e) => e.hasResults).at(-1)?.event ?? null;
    const initialEventResults = lastEventWithResults ? await getEventResults(lastEventWithResults.id) : [];

    return (
        <div className="px-6 md:px-12 py-16 flex flex-col gap-10">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    {/* Accent bar above title */}
                    <div className="w-10 h-1 rounded-full mb-3" style={{ backgroundColor: "var(--accent)" }} />
                    <h1 className="text-5xl font-black tracking-tight text-foreground">Classement</h1>
                    {selectedSeason && (
                        <p className="text-muted-foreground mt-2 text-lg font-medium">
                            Saison <span className="text-foreground font-semibold">{selectedSeason.name}</span>
                            {selectedSeason.isCurrent && (
                                <span
                                    className="ml-2 text-xs font-bold px-2.5 py-1 rounded-full"
                                    style={{
                                        backgroundColor: "var(--accent)",
                                        color: "var(--accent-foreground)"
                                    }}
                                >
                                    En cours
                                </span>
                            )}
                        </p>
                    )}
                </div>

                {allSeasons.length > 1 && <SeasonSelector seasons={allSeasons} selectedSeasonId={selectedSeasonId} />}
            </div>

            {/* Leaderboard + Event Results */}
            <SeasonLeaderboard
                leaderboard={leaderboard}
                events={seasonEvents.map((e) => ({
                    ...e,
                    date: e.date ? new Date(e.date).toISOString() : null
                }))}
                memberEventPoints={memberEventPoints}
                initialEventResults={initialEventResults}
                initialEventId={lastEventWithResults?.id ?? null}
            />
        </div>
    );
}
