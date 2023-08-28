export interface Player {
    age: number;
    birth_date: string;
    college: string;
    depth_chart_order: number;
    espn_id: number;
    fantasy_data_id: number;
    first_name: string;
    full_name: string;
    height: string;
    high_school: string;
    last_name: string;
    number: number;
    player_id: string;
    position: string;
    rotowire_id: number;
    sportradar_id: string;
    team: string;
    weight: string;
    yahoo_id: number;
    years_exp: number;
};

export interface PlayerContextType {
    players: Player[];
    loadPlayers: boolean;
};
  