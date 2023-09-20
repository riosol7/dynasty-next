interface PlayerPoints {
    [playerId: string]: number;
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

export const initialMatch = {
    starters_points: [],
    starters: [],
    roster_id: 0,
    points: 0,
    players_points: {"":0},
    players: [],
    matchup_id: 0,
    custom_points: null,
};