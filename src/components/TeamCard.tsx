import React from "react";
import { motion } from "framer-motion";
import type { Team, TeamStats } from "../types";

interface TeamCardProps {
  team: Team;
  stats: TeamStats;
  onClick: () => void;
}

export function TeamCard({ team, stats, onClick }: TeamCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-4 mb-4">
        <div>
          <h3 className="text-xl font-semibold">{team.name}</h3>
          {/* <p className="text-gray-500">Founded: {team.founded}</p> */}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-green-600">{stats.wins}</p>
          <p className="text-sm text-gray-600">Wins</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-yellow-600">{stats.draws}</p>
          <p className="text-sm text-gray-600">Draws</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-red-600">{stats.losses}</p>
          <p className="text-sm text-gray-600">Losses</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span>Goals For: {stats.goalsFor}</span>
          <span>Goals Against: {stats.goalsAgainst}</span>
        </div>
      </div>
    </motion.div>
  );
}
