interface PlayerPoints {
    [playerId: string]: number;
};

export interface BracketMatch {
    l: number | null;
    m: number;
    r: number;
    t1: number;
    t2: number;
    w: number | null;
};
  
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
    bracket: {
        w: number | null;
        t2: number;
        t1: number;
        r: number;
        m: number;
        l: number | null;
    }[];
    season: string;
    games: Match[][];
};