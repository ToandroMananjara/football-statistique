import React from "react";
import { motion } from "framer-motion";
import type { Team } from "../types";

interface TeamListProps {
  teams: Team[];
  selectedTeam: number | null;
  onSelectTeam: (teamId: number, teamName: string) => void;
}

export function TeamList({ teams, selectedTeam, onSelectTeam }: TeamListProps) {
  return (
    <div className="space-y-2">
      {teams.map((team) => (
        <motion.button
          key={team.teamID}
          whileHover={{ scale: 1.02 }}
          onClick={() => onSelectTeam(team.teamID, team.name)}
          className={`w-full p-3 rounded-lg text-left transition-colors ${
            selectedTeam === team.teamID
              ? "bg-blue-50 text-blue-700"
              : "hover:bg-gray-50"
          }`}
        >
          <span className="font-medium">{team.name} ({team.totalPoints} pts) </span>
        </motion.button>
      ))}
    </div>
  );
}
