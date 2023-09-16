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