import {
  cornerStats,
  GlobalStats,
  League,
  Match,
  MatchDetailsPerSeason,
  redCardStats,
  SeasonGoals,
  SeasonResults,
  ShotsStats,
  Team,
  TeamMatch,
  yellowCardStats,
} from "./types";

const BASE_URL = "http://localhost/football";

export async function fetchLeagues(): Promise<League[]> {
  const response = await fetch(`${BASE_URL}/league`);
  if (!response.ok) throw new Error("Failed to fetch leagues");
  return response.json();
}

export async function fetchTeamsByLeague(leagueID: number): Promise<Team[]> {
  const response = await fetch(
    `${BASE_URL}/teamPerLeague?leagueID=${leagueID}`
  );
  if (!response.ok) throw new Error("Failed to fetch teams");
  return response.json();
}

export async function fetchTeamMatches(teamID: number): Promise<Match[]> {
  const response = await fetch(`${BASE_URL}/matchesByTeamID?teamID=${teamID}`);
  if (!response.ok) throw new Error("Failed to fetch matches");
  return response.json();
}

export async function fetchGlobalStats(teamID: number): Promise<GlobalStats> {
  const response = await fetch(
    `${BASE_URL}/globalStatsByTeamID?teamID=${teamID}`
  );
  if (!response.ok) throw new Error("Failed to fetch global stats");
  return response.json();
}

export async function fetchSeasonGoals(teamID: number): Promise<SeasonGoals[]> {
  const response = await fetch(
    `${BASE_URL}/avgGoalsPerSeason?teamID=${teamID}`
  );
  if (!response.ok) throw new Error("Failed to fetch season goals");
  return response.json();
}

export async function fetchSeasonResults(
  teamID: number
): Promise<SeasonResults[]> {
  const response = await fetch(`${BASE_URL}/resultsPerSeason?teamID=${teamID}`);
  if (!response.ok) throw new Error("Failed to fetch season results");
  return response.json();
}

export async function fetchShotsStats(teamID: number): Promise<ShotsStats[]> {
  const response = await fetch(
    `${BASE_URL}/shotsStatsPerSeason?teamID=${teamID}`
  );
  if (!response.ok) throw new Error("Failed to fetch shots stats");
  return response.json();
}

export async function fetchTeamMatchesBySeason(
  teamID: number,
  season: number
): Promise<TeamMatch[]> {
  const response = await fetch(
    `${BASE_URL}/teamMatchesBySeason?teamID=${teamID}&season=${season}`
  );
  if (!response.ok) throw new Error("Failed to fetch team matches");
  return response.json();
}

export async function fetchYellowCardsStats(
  teamID: number
): Promise<yellowCardStats[]> {
  const response = await fetch(
    `${BASE_URL}/yellowCardsPerSeason?teamID=${teamID}`
  );
  if (!response.ok) throw new Error("Failed to fetch shots stats");
  return response.json();
}

export async function fetchRedCardsStats(
  teamID: number
): Promise<redCardStats[]> {
  const response = await fetch(
    `${BASE_URL}/redCardsPerSeason?teamID=${teamID}`
  );
  if (!response.ok) throw new Error("Failed to fetch shots stats");
  return response.json();
}
export async function fetchCornerStats(
  teamID: number
): Promise<cornerStats[]> {
  const response = await fetch(
    `${BASE_URL}/cornerPerSeason?teamID=${teamID}`
  );
  if (!response.ok) throw new Error("Failed to fetch shots stats");
  return response.json();
}
export async function fetchMatchDetailsPerSeason(
  teamID: number,
  season: number
): Promise<MatchDetailsPerSeason[]> {
  const response = await fetch(
    `${BASE_URL}/matchDetailsPerSeason?teamID=${teamID}&season=${season}`
  );
  if (!response.ok) throw new Error("Failed to fetch shots stats");
  return response.json();
}