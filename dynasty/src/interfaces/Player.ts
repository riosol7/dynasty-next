export interface MarketContent {
    rank: string | undefined;
    value: number | string;
    tier: string | null | undefined;
    trend: string | null | undefined;
    path: string | null | undefined;
    positionRank: string | undefined;
};

export interface Player {
    age: number;
    birth_date: string;
    cbs_id: string;
    college: string;
    depth_chart_order: number;
    dp: MarketContent;
    espn_id: number;
    fc: MarketContent;
    fantasy_calc_id: string;
    fantasy_data_id: number;
    fantasy_pro: FantasyProPlayerConcise;
    first_name: string;
    full_name: string;
    height: string;
    high_school: string;
    injury_status: string;
    ktc: MarketContent;
    last_name: string;
    mfl_id: string;
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

export interface FantasyProPlayer {
    page: string;
    page_pos: string;
    scrape_date: string;
    fantasypros_id: string;
    player_name: string;
    pos: string;
    team: string;
    rank: string;
    ecr: string;
    sd: string;
    best: string;
    worst: string;
    sportradar_id: string;
    yahoo_id: string;
    cbs_id: string;
    player_positions: string;
    player_short_name: string;
    player_eligibility: string;
    player_yahoo_positions: string;
    player_page_url: string;
    player_filename: string;
    player_square_image_url: string;
    player_image_url: string;
    player_bye_week: string;
    player_owned_avg: string;
    player_owned_espn: string;
    player_owned_yahoo: string;
    player_opponent: string;
    player_opponent_id: string;
    player_ecr_delta: string;
    pos_rank: string;
    start_sit_grade: string;
    r2p_pts: string;
};

export interface FantasyProPlayerConcise {
    fantasypros_id: string;
    rank: string;
    ecr: string;
    sd: string;
    best: string;
    worst: string;   
    player_page_url: string;
    player_image_url: string;
    player_bye_week: string;
    player_owned_avg: string;
    player_owned_espn: string;
    player_owned_yahoo: string;
    player_opponent: string;
    player_opponent_id: string;
    player_ecr_delta: string;
    pos_rank: string;
    start_sit_grade: string;
    r2p_pts: string;
};

export interface FantasyProContextType {
    fantasyPro: FantasyProPlayer[];
    loadFantasyPro: boolean;
};

export interface DynastyProcessPlayer {
    player: string;
    position: string;
    team: string;
    age: string;
    draft_year: string;
    ecr_1qb: string;
    ecr_2qb: string;
    ecr_pos: string;
    value_1qb: string;
    value_2qb: string;
    scrape_date: string;
    fp_id: string;  
};

export interface DynastyProcessContextType {
    dp: DynastyProcessPlayer[];
    loadDP: boolean;
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
};

export interface FantasyCalcPlayer {
    overallRank: string;
    name: string;
    team: string;
    position: string;
    positionRank: string;
    age: string;
    tier: string;
    trend30day: string;
    value: string;
    fantasycalcId: string;
    sleeperId: string;
    mflId: string;
};

export interface KTCContextType {
    ktc: PlayerMarket[];
    loadKTC: boolean;
};

export interface FantasyCalcContextType {
    fc: FantasyCalcPlayer[];
    loadFC: boolean;
};