import React from "react";
import { Trophy } from "lucide-react";
import type { League } from "../types";

interface LeagueSelectorProps {
  leagues: League[];
  selectedLeague: number | null;
  onSelectLeague: (leagueId: number) => void;
}

export function LeagueSelector({
  leagues,
  selectedLeague,
  onSelectLeague,
}: LeagueSelectorProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Leagues</h2>
      </div>
      <div className="space-y-2">
        {leagues.map((league) => (
          <button
            key={league.leagueID}
            onClick={() => onSelectLeague(league.leagueID)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              selectedLeague === league.leagueID
                ? "bg-blue-50 text-blue-700"
                : "hover:bg-gray-50"
            }`}
          >
            <span className="font-medium">{league.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
