import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Calendar, Trophy } from "lucide-react";
import type {
  GlobalStats,
  SeasonGoals,
  SeasonResults,
  ShotsStats,
  yellowCardStats,
  redCardStats,
  cornerStats,
  TeamMatch,
} from "../types";
import { fetchMatchDetailsPerSeason, fetchTeamMatchesBySeason } from "../api";

interface TeamStatsProps {
  teamName: string;
  globalStats: GlobalStats;
  seasonGoals: SeasonGoals[];
  seasonResults: SeasonResults[];
  shotsStats: ShotsStats[];
  yellowCardsStats: yellowCardStats[];
  redCardStats:redCardStats[];
  cornerStats:cornerStats[];
  teamId: number;
}

export function TeamStats({
  teamName,
  globalStats,
  seasonGoals,
  seasonResults,
  shotsStats,
  yellowCardsStats,
  redCardStats,
  cornerStats,
  teamId,
}: TeamStatsProps) {
  const [seasonMatches, setSeasonMatches] = useState<TeamMatch[]>([]);
  const [matchDetails, setMatchDetails] = useState<any | null>(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [currentPage, setCurrentPage] = useState(0);
  
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null); // Initialize with null or a default value
console.log(matchDetails);

  const matchesPerPage = 8;
  console.log("season results", seasonResults);
  const availableSeasons = seasonResults.map((season) => season.season);
console.log("available seasons", availableSeasons);

  const handleSeasonClick = async (season: number) => {
    console.log("click mandeha ");

    try {
      const matches = await fetchTeamMatchesBySeason(teamId, season);

      setSeasonMatches(matches);
      setSelectedSeason(season);
    } catch (error) {
      console.error("Failed to fetch season matches:", error);
    }
  };

  const handleMatchDetailClick = async (teamId: number, season: any) => {
    try {
      if (!teamId) return; // Assure-toi que teamID est défini dans ton composant
      const matchDetailsList = await fetchMatchDetailsPerSeason(teamId, season);
      setSelectedSeason(season); // Set selected season
      setMatchDetails(matchDetailsList); // Set match details
      setCurrentPage(0); // Reset to first page
      setIsModalOpen(true); // Open modal
    } catch (error) {
      console.error("Error fetching match details:", error);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setMatchDetails(null);
    setCurrentPage(0);
  };

  // Calculate pagination
  const totalPages = matchDetails
    ? Math.ceil(matchDetails.length / matchesPerPage)
    : 0;
  const currentMatches = matchDetails?.slice(
    currentPage * matchesPerPage,
    (currentPage + 1) * matchesPerPage
  );

  // Transform shots stats for radar chart
  const radarData = shotsStats.map((stat) => ({
    season: stat.season.toString(),
    shots: parseFloat(stat.avg_shots),
    "shots on target": parseFloat(stat.avg_shots_on_target),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900">{teamName}</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Global Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {globalStats.avgGoals}
            </p>
            <p className="text-sm text-gray-600">Avg Goals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {globalStats.avgXGoals.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Avg xGoals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {globalStats.avgShots}
            </p>
            <p className="text-sm text-gray-600">Avg Shots</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {globalStats.totalGames}
            </p>
            <p className="text-sm text-gray-600">Total Games</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Goals per Season</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={seasonGoals}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="season" />
              <YAxis /> {/* Set max for Y-axis */}
              <Tooltip />
              <Line
                type="monotone"
                dataKey="avg_goals"
                stroke="#2563eb"
                name="Avg Goals"
                dot={{ r: 4 }}
                activeDot={{
                  r: 8,
                  onClick: (data: any) =>
                    handleSeasonClick(data.payload.season),
                }}
              />
              <Line
                type="monotone"
                dataKey="avg_xGoals"
                stroke="#16a34a"
                name="Avg xGoals"
                dot={{ r: 4 }}
                activeDot={{
                  r: 8,
                  onClick: (data: any) =>
                    handleSeasonClick(data.payload.season),
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Results per Season</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={seasonResults}
              onClick={(data: any) =>
                // log le season dans le paylod
                handleMatchDetailClick(
                  teamId,
                  data.activePayload[0].payload.season
                )
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="season"
                onClick={() => console.log("click season")}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="wins" fill="#16a34a" name="Wins" />
              <Bar dataKey="draws" fill="#eab308" name="Draws" />
              <Bar dataKey="losses" fill="#dc2626" name="Losses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Shots Statistics</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="season" />
              <PolarRadiusAxis />
              <Radar
                name="Shots"
                dataKey="shots"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
              <Radar
                name="Shots on Target"
                dataKey="shots on target"
                stroke="#ec4899"
                fill="#ec4899"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {selectedSeason && seasonMatches.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold">
              Season {selectedSeason} Matches
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Goals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    xGoals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shots
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shots on Target
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {seasonMatches.map((match) => (
                  <tr key={`${match.gameID}-${match.teamName}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(match.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {match.teamName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {match.goals}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {match.xGoals.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {match.shots}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {match.shotsOnTarget}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Yellow card per Season</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yellowCardsStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="season" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="yellow_cards"
                stroke="#16a34a"
                name="Avg Yellow Cards"
                dot={{ r: 4 }}
                activeDot={{
                  r: 8,
                  onClick: (data: any) =>
                    // handleSeasonClick(data.payload.season),
                    console.log("Yellow card season clicked"),
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Red card per Season</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={redCardStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="season" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="red_cards"
                stroke="#16a34a"
                name="Avg Red Cards"
                dot={{ r: 4 }}
                activeDot={{
                  r: 8,
                  onClick: (data: any) =>
                    // handleSeasonClick(data.payload.season),
                    console.log("red card season clicked"),
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Corner per Season</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cornerStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="season" />
              <YAxis domain={[0, 500]} />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="corner"
                stroke="#16a34a"
                name="Avg corner"
                dot={{ r: 4 }}
                activeDot={{
                  r: 8,
                  onClick: (data: any) =>
                    // handleSeasonClick(data.payload.season),
                    console.log("corner season clicked"),
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      {isModalOpen && matchDetails && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">
                {teamName} Season {matchDetails[0].season} -{" "}
                {matchDetails[0].season + 1} Matches
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-2">
              <label htmlFor="season-select" className="text-sm text-gray-600 mr-2">
                Choose season:
              </label>
              <select
                id="season-select"
                value={selectedSeason || ""}
  
                onChange={(e) => {
                    const season = Number(e.target.value);
                    setSelectedSeason(season);
                    handleMatchDetailClick(teamId, season); // Appel de la fonction
                }}                
                className="px-3 py-1 border rounded-md text-sm"
              >
                  {availableSeasons.map((season) => (
                    <option key={season} value={season}>
                      {season} - {season + 1}
                    </option>
                  ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Opponent
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Result
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Goals
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      xG
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Shots (On Target)
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Cards
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Other Stats
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentMatches?.map((match: any) => (
                    <tr key={match.gameID} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center  whitespace-nowrap text-sm">
                        {new Date(match.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center  whitespace-nowrap text-sm font-medium">
                        {match.opponent}
                      </td>
                      <td className="px-4 py-3 text-center  whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            match.result === "W"
                              ? "bg-green-100 text-green-800"
                              : match.result === "L"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {match.result === "W"
                            ? "Win"
                            : match.result === "L"
                            ? "Loss"
                            : "Draw"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center  whitespace-nowrap text-sm">
                        {match.goals}
                      </td>
                      <td className="px-4 py-3 text-center  whitespace-nowrap text-sm">
                        {match.xGoals.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center  whitespace-nowrap text-sm">
                        {match.shots} ({match.shotsOnTarget})
                      </td>
                      <td className="px-4 py-3 text-center  whitespace-nowrap text-sm">
                        <span className="text-yellow-500">
                          {match.yellowCards} 🟨
                        </span>
                        {match.redCards > 0 && (
                          <span className="text-red-500 ml-2">
                            {match.redCards} 🟥
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap text-sm">
                        <div className="flex gap-2 justify-center">
                          {/* <span title="PPDA">📊 {match.ppda.toFixed(2)}</span>*/}
                          <span title="Deep Completions">🎯 {match.deep}</span>  
                          <span title="Corners">⛳ {match.corners}</span>
                          <span title="Fouls">🚫 {match.fouls}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 bg-gray-100 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                  }
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1 bg-gray-100 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
