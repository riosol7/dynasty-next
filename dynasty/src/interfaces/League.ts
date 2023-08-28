export interface League {
  status: "pre_draft" | "complete" | "in_season";
  season: string;
  settings?: {
    divisions: string;
  };
  total_rosters: string;
  name: string;
  avatar: string;
};
  
export interface LeagueProps {
  league: League;
};

export interface LeagueContextType {
  league: League;
  loadLeague: boolean;
};