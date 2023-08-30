import { Roster }from "./Roster";
import { Transaction } from "./Transaction";

interface LegacyLeague {
  year: string;
  matchups: any;
  league: League;
  rosters: Roster[];
  transactions: Transaction[];
}

export interface League {
  status: "pre_draft" | "complete" | "in_season";
  season: string;
  settings?: {
    divisions: string;
  };
  total_rosters: string;
  name: string;
  avatar: string;
  history: LegacyLeague[];
};
  
export interface LeagueProps {
  league: League;
};

export interface LeagueContextType {
  league: League;
  loadLeague: boolean;
};