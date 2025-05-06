export interface League {
  leagueID: number;
  name: string;
}

export interface Team {
  totalPoints: any;
  teamID: number;
  name: string;
}

// Add the missing TeamStats export
export interface TeamStats {
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface Match {
  gameID: number;
  date: string;
  goals: number;
  xGoals: number;
  shots: number;
  shotsOnTarget: number;
  result: string;
}

export interface GlobalStats {
  avgGoals: string;
  avgXGoals: number;
  avgShots: string;
  avgFouls: string;
  totalGames: number;
}

export interface SeasonGoals {
  season: number;
  avg_goals: string;
  avg_xGoals: number;
}

export interface SeasonResults {
  season: number;
  total_matches: number;
  wins: string;
  losses: string;
  draws: string;
}

export interface ShotsStats {
  season: number;
  avg_shots: string;
  avg_shots_on_target: string;
}

export interface TeamMatch {
  gameID: number;
  date: string;
  goals: number;
  xGoals: number;
  shots: number;
  shotsOnTarget: number;
  teamName: string;
}
export interface yellowCardStats {
  season: number;
  totalYellowCard: number;
}
export interface redCardStats {
  season: number;
  totalRedCard: number;
}
export interface cornerStats {
  season: number;
  totalCorner: number;
}
export interface MatchDetailsPerSeason {
  gameID: number;
  teamID: number;
  date: string;
  location: string;
  goals: number;
  xGoals: number;
  shots: number;
  shotsOnTarget: number;
  result: string;
  opponent: string;
  ppda: number;
  deep: number;
  yellowCards: number;
  redCards: number;
  fouls: number;
  corners: number;
}
