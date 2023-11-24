interface PlayerPoints {
    [playerId: string]: number;
};

export interface BracketMatch {
    l: number | null;
    m: number;
    r: number;
    p?: number | null;
    t1: number;
    t2: number;
    t1_from?: {
      w?: number | null;
      l?: number | null;
    } | null;
    t2_from?: {
      w?: number | null;
      l?: number | null;
    } | null;
    w: number | null;
  }
  
  
export interface Match {
  starters_points: number[];
  starters: string[];
  roster_id: number;
  points: number;
  players_points: PlayerPoints;
  players: string[];
  matchup_id: number;
  custom_points: null | any;
};

export interface PlayoffRuns {
    bracket: BracketMatch[];
    season: string;
    games: Match[][];
};