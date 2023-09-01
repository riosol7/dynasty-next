interface MarketContent {
    rank: string | undefined;
    value: number | string;
    tier: string | null | undefined;
    trend: string | null | undefined;
    path: string | null | undefined;
    positionRank: string | undefined;
}

export interface Player {
    age: number;
    birth_date: string;
    college: string;
    depth_chart_order: number;
    espn_id: number;
    fantasy_calc_id: string | null;
    fantasy_data_id: number;
    first_name: string;
    full_name: string;
    height: string;
    high_school: string;
    last_name: string;
    mfl_id: string | null;
    number: number;
    player_id: string;
    position: string;
    rank: string;
    rotowire_id: number;
    sportradar_id: string;
    team: string;
    weight: string;
    yahoo_id: number;
    years_exp: number;
    value: number;
    ktc: MarketContent;
    superFlex: MarketContent;
    fc: MarketContent;
};

export interface PlayerContextType {
    players: Player[];
    loadPlayers: boolean;
};

export interface PlayerMarket {
    rank: string;
    player: string;
    team: string;
    position: string;
    positionRank: string;
    age: number;
    tier: string;
    trend: string;
    value: number | string;
    fantasycalcId: string | null;
    sleeperId: string | null;
    mflId: string | null;
    path: string;
}

export interface KTCContextType {
    ktc: PlayerMarket[];
    loadKTC: boolean;
}

export interface SuperFlexContextType {
    superFlex: PlayerMarket[];
    loadSuperFlex: boolean;
}

export interface FantasyCalcContextType {
    fc: PlayerMarket[];
    loadFC: boolean;
}

export interface MVP {

}