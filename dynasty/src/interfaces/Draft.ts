export interface Draft {
    type: string;
    status: string;
    start_time: number;
    sport: string;
    slot_to_roster_id: {
        [key: string]: number;
    };
    settings: {
        teams: number;
        slots_wrrb_flex: number;
        slots_wr: number;
        slots_te: number;
        slots_super_flex: number;
        slots_rb: number;
        slots_qb: number;
        slots_k: number;
        slots_flex: number;
        slots_def: number;
        slots_bn: number;
        rounds: number;
        reversal_round: number;
        position_limit_qb: number;
        player_type: number;
        pick_timer: number;
        nomination_timer: number;
        enforce_position_limits: number;
        cpu_autopick: number;
        autostart: number;
        autopause_start_time: number;
        autopause_end_time: number;
        autopause_enabled: number;
        alpha_sort: number;
    };
    season_type: string;
    season: string;
    metadata: {
        scoring_type: string;
        name: string;
        description: string;
    };
    league_id: string;
    last_picked: number;
    last_message_time: number;
    last_message_id: string;
    draft_order: {
        [key: string]: number;
    };
    draft_id: string;
    creators: string[];
    created: number;
    picks: Pick[];
};


export interface Pick {
    round: number;
    roster_id: number;
    player_id: string;
    picked_by: string;
    pick_no: number;
    metadata: {
        years_exp: string;
        team: string;
        status: string;
        sport: string;
        position: string;
        player_id: string;
        number: string;
        news_updated: string;
        last_name: string;
        injury_status: string;
        first_name: string;
    };
    is_keeper: null;
    draft_slot: number;
    draft_id: string;
};