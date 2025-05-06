import React, { useState, useEffect } from "react";
import { BarChart3, Loader2 } from "lucide-react";
import { LeagueSelector } from "./components/LeagueSelector";
import { TeamList } from "./components/TeamList";
import { TeamStats } from "./components/TeamStats";
import {
  fetchLeagues,
  fetchTeamsByLeague,
  fetchGlobalStats,
  fetchSeasonGoals,
  fetchSeasonResults,
  fetchShotsStats,
  fetchYellowCardsStats,
  fetchRedCardsStats,
  fetchCornerStats
} from "./api";
import type {
  League,
  Team,
  GlobalStats,
  SeasonGoals,
  SeasonResults,
  ShotsStats,
  yellowCardStats,
  redCardStats,
  MatchDetailsPerSeason,
  cornerStats,
} from "./types";
import { motion } from "framer-motion";

function App() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedTeamName, setSelectedTeamName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [seasonGoals, setSeasonGoals] = useState<SeasonGoals[]>([]);
  const [seasonResults, setSeasonResults] = useState<SeasonResults[]>([]);
  const [shotsStats, setShotsStats] = useState<ShotsStats[]>([]);
  const [yellowCardsStats, setYellowCardsStats] = useState<yellowCardStats[]>([]);
  const [cornerStats, setCornerStats] = useState<cornerStats[]>([]);

  const [redCardsStats, setRedCardsStats] = useState<redCardStats[]>([]);

  const [matchDetails, setMatchDetails] = useState<
    MatchDetailsPerSeason[] | null
  >(null);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const leagueData = await fetchLeagues();
        setLeagues(leagueData);
        const teamData = await fetchTeamsByLeague(leagueData[0].leagueID);
        setTeams(teamData);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    initializeData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        document.body.classList.add("mobile-view");
      } else {
        document.body.classList.remove("mobile-view");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobileView = document.body.classList.contains("mobile-view");

  const handleLeagueSelect = async (leagueId: number) => {
    setLoading(true);
    setSelectedLeague(leagueId);
    try {
      const teamData = await fetchTeamsByLeague(leagueId);
      setTeams(teamData);

      if (teamData.length > 0) {
        await handleTeamSelect(teamData[0].teamID, teamData[0].name);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
    setLoading(false);
  };

  const handleTeamSelect = async (teamId: number, teamName: string) => {
    setLoading(true);
    setSelectedTeam(teamId);
    setSelectedTeamName(teamName);
    try {
      const [stats, goals, results, shots, yellowCards, redCards, cornerStats] = await Promise.all([
        fetchGlobalStats(teamId),
        fetchSeasonGoals(teamId),
        fetchSeasonResults(teamId),
        fetchShotsStats(teamId),
        fetchYellowCardsStats(teamId), // Placeholder for yellow cards stats
        fetchRedCardsStats(teamId), // Placeholder for yellow cards stats
        fetchCornerStats(teamId), // Placeholder for yellow cards stats
      ]);
      setGlobalStats(stats);
      setSeasonGoals(goals);
      setSeasonResults(results);
      setShotsStats(shots);
      setYellowCardsStats(yellowCards); // Placeholder for yellow cards stats
      setRedCardsStats(redCards);
      setCornerStats(cornerStats); // Placeholder for yellow cards stats
    } catch (error) {
      console.error("Failed to fetch team statistics:", error);
    }
    setLoading(false);
  };

  return (

<div className="min-h-screen bg-gray-100">
  {/* Header */}
  <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
    <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">
          Football Statistics
        </h1>
      </div>
    </div>
  </header>
      
  {/* Grid container */}
  <div className="pt-16 h-[100vh]">
    <div
      className={` mx-auto h-full grid ${
        selectedTeam
          ? 'grid-cols-1 sm:grid-cols-[16rem_1fr] lg:grid-cols-[18rem_1fr_18rem]'
          : 'grid-cols-1 sm:grid-cols-[16rem_1fr]'
      }`}
    >
      {/* Sidebar gauche (toujours affiché sauf mobile) */}
      {!isMobileView && (
        <aside className="bg-white shadow-md p-4 overflow-y-auto hidden sm:block">
          <LeagueSelector
            leagues={leagues}
            selectedLeague={selectedLeague}
            onSelectLeague={handleLeagueSelect}
          />
        </aside>
      )}

      {/* Contenu principal (toujours visible) */}
      <main className="overflow-y-auto p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : selectedTeam && globalStats ? (
          <TeamStats
            teamName={selectedTeamName}
            globalStats={globalStats}
            seasonGoals={seasonGoals}
            seasonResults={seasonResults}
            shotsStats={shotsStats}
            teamId={selectedTeam}
            yellowCardsStats={yellowCardsStats}
            redCardStats={redCardsStats}
            cornerStats={cornerStats}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teams.map((team) => (
              <motion.button
                key={team.teamID}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleTeamSelect(team.teamID, team.name)}
                className="bg-white p-6 rounded-lg shadow-md text-left hover:bg-blue-50 transition-colors"
              >
                <h3 className="text-lg font-semibold">{team.name}</h3>
              </motion.button>
            ))}
          </div>
        )}
      </main>

      {/* Sidebar droit (uniquement si équipe sélectionnée) */}
      {selectedTeam && !isMobileView && (
        <aside className="bg-white shadow-md p-4 overflow-y-auto hidden lg:block">
          <h2 className="text-lg font-semibold mb-4">Teams</h2>
          <TeamList
            teams={teams}
            selectedTeam={selectedTeam}
            onSelectTeam={handleTeamSelect}
          />
        </aside>
      )}
    </div>
  </div>
</div>
)}

export default App;
