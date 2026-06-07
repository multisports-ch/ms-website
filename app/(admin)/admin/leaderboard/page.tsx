"use client";

import { useEffect, useState } from "react";
import SeasonManager from "@/components/admin/leaderboard/SeasonManager";
import EventManager from "@/components/admin/leaderboard/EventManager";
import ResultsManager from "@/components/admin/leaderboard/ResultsManager";

interface Season {
    id: string;
    name: string;
    isCurrent: boolean;
    startDate: string | null;
    endDate: string | null;
}

export default function AdminLeaderboardPage() {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    async function loadSeasons() {
        const res = await fetch("/api/admin/leaderboard/seasons");
        const data = await res.json();
        setSeasons(data);
        if (!selectedSeasonId) {
            const current = data.find((s: Season) => s.isCurrent);
            if (current) setSelectedSeasonId(current.id);
        }
    }

    useEffect(() => {
        loadSeasons();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Classement</h1>
                <p className="text-sm text-gray-500 mt-1">Gérez les saisons, événements et résultats.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <SeasonManager
                    seasons={seasons}
                    selectedSeasonId={selectedSeasonId}
                    onSelect={(id) => {
                        setSelectedSeasonId(id);
                        setSelectedEventId(null);
                    }}
                    onRefresh={loadSeasons}
                />

                {selectedSeasonId && (
                    <EventManager
                        seasonId={selectedSeasonId}
                        selectedEventId={selectedEventId}
                        onSelectEvent={setSelectedEventId}
                    />
                )}

                {selectedEventId && <ResultsManager eventId={selectedEventId} />}
            </div>
        </div>
    );
}
