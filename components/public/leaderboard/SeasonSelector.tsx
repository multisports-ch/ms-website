"use client";

import { useRouter } from "next/navigation";

interface Season {
    id: string;
    name: string;
    isCurrent: boolean;
}

interface Props {
    seasons: Season[];
    selectedSeasonId: string;
}

export default function SeasonSelector({ seasons, selectedSeasonId }: Props) {
    const router = useRouter();

    return (
        <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600">Saison :</label>
            <select
                value={selectedSeasonId}
                onChange={(e) => router.push(`/leaderboard?season=${e.target.value}`)}
                className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
                {seasons.map((season) => (
                    <option key={season.id} value={season.id}>
                        {season.name} {season.isCurrent ? "(en cours)" : ""}
                    </option>
                ))}
            </select>
        </div>
    );
}
