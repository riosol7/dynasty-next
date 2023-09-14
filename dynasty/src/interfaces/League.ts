export interface League {
  total_rosters: number;
  status: "pre_draft" | "complete" | "in_season";  
  sport: string;
  shard: number;
  settings: {
    daily_waivers_last_ran: number;
    reserve_allow_cov: number;
    reserve_slots: number;
    daily_waivers_base: number;
    leg: number;
    offseason_adds: number;
    bench_lock: number;
    trade_review_days: number;
    league_average_match: number;
    waiver_type: number;
    max_keepers: number;
    type: number;
    pick_trading: number;
    disable_trades: number;
    daily_waivers: number;
    taxi_years: number;
    trade_deadline: number;
    veto_show_votes: number;
    reserve_allow_sus: number;
    reserve_allow_out: number;
    playoff_round_type: number;
    waiver_day_of_week: number;
    taxi_allow_vets: number;
    reserve_allow_dnr: number;
    veto_auto_poll: number;
    reserve_allow_doubtful: number;
    waiver_clear_days: number;
    playoff_week_start: number;
    daily_waivers_days: number;
    last_scored_leg: number;
    taxi_slots: number;
    playoff_type: number;
    daily_waivers_hour: number;
    num_teams: number;
    squads: number;
    position_limit_qb: number;
    veto_votes_needed: number;
    playoff_teams: number;
    playoff_seed_type: number;
    start_week: number;
    reserve_allow_na: number;
    draft_rounds: number;
    taxi_deadline: number;
    waiver_bid_min: number;
    capacity_override: number;
    divisions: number;
    disable_adds: number;
    waiver_budget: number;
    last_report: number;
    best_ball: number;
  };
  season_type: string;
  season: string;
  scoring_settings: {
    st_ff: number;
    pts_allow_7_13: number;
    def_st_ff: number;
    rec_yd: number;
    fum_rec_td: number;
    pts_allow_35p: number;
    pts_allow_28_34: number;
    fum: number;
    rush_yd: number;
    pass_td: number;
    blk_kick: number;
    pass_yd: number;
    safe: number;
    def_td: number;
    fgm_50p: number;
    def_st_td: number;
    fum_rec: number;
    rush_2pt: number;
    xpm: number;
    pts_allow_21_27: number;
    fgm_20_29: number;
    pts_allow_1_6: number;
    fum_lost: number;
    def_st_fum_rec: number;
    int: number;
    fgm_0_19: number;
    pts_allow_14_20: number;
    rec: number;
    ff: number;
    fgmiss: number;
    st_fum_rec: number;
    rec_2pt: number;
    rush_td: number;
    xpmiss: number;
    fgm_30_39: number;
    rec_td: number;
    st_td: number;
    pass_2pt: number;
    pts_allow_0: number;
    pass_int: number;
    fgm_yds: number;
    fgm_40_49: number;
    sack: number;
  };
  roster_positions: string[];
  previous_league_id: string;
  name: string;
  metadata: {
    latest_league_winner_roster_id: string;
    keeper_deadline: string;
    division_2: string;
    division_1: string;
    auto_continue: string;
  };
  loser_bracket_id: string | null;
  league_id: string;
  last_read_id: string | null;
  last_pinned_message_id: string;
  last_message_time: number;
  last_message_text_map: any; // Update this type as per your data
  last_message_id: string;
  last_message_attachment: any; // Update this type as per your data
  last_author_is_bot: boolean;
  last_author_id: string;
  last_author_display_name: string;
  last_author_avatar: string | null;
  group_id: string | null;
  draft_id: string;
  company_id: string | null;
  bracket_id: string | null;
  avatar: string;
  brackets: {
    playoffs: {
      w: number | null;
      t2: number;
      t1: number;
      r: number;
      m: number;
      l: number | null;
    }[];
    toiletBowl: {
      w: number | null;
      t2: number;
      t1: number;
      r: number;
      m: number;
      l: number | null;
    }[];
  };
  draft: {
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
    picks: {
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
    }[];
  };
  matchups: any[][]; // Update this type as per your data
  rosters: {
    taxi: string[];
    starters: string[];
    settings: {
      wins: number;
      waiver_position: number;
      waiver_budget_used: number;
      total_moves: number;
      ties: number;
      ppts_decimal: number;
      ppts: number;
      losses: number;
      fpts_decimal: number;
      fpts_against_decimal: number;
      fpts_against: number;
      fpts: number;
      division: number;
    };
    roster_id: number;
    reserve: string[];
    players: string[];
    player_map: null; // Update this type as per your data
    owner_id: string;
    metadata: {
      [key: string]: string;
    };
    league_id: string;
    keepers: null; // Update this type as per your data
    co_owners: null; // Update this type as per your data
  }[];
  transactions: {
    waiver_budget: any[]; // Update this type as per your data
    type: string;
    transaction_id: string;
    status_updated: number;
    status: string;
    settings: {
      waiver_bid: number;
      seq: number;
    };
    roster_ids: number[];
    metadata: {
      notes: string;
    };
    leg: number;
    drops: any[]; // Update this type as per your data
    draft_picks: any[]; // Update this type as per your data
    creator: string;
    created: number;
    consenter_ids: number[];
    adds: {
      [key: string]: number;
    };
  }[];
  users: {
    user_id: string;
    settings: null; // Update this type as per your data
    metadata: {
      [key: string]: string;
    };
    league_id: string;
    is_owner: boolean;
    is_bot: boolean;
    display_name: string;
    avatar: string;
  }[];
};
  
export interface LegacyLeagueProps {
  legacyLeague: League[];
};

export interface LeagueProps {
  league: League;
};

export interface LegacyLeagueContextType {
  legacyLeague: League[];
  loadLegacyLeague: boolean;
};

export const defaultLegacyLeague: League[] = [{
  status: "pre_draft",
  season: "",
  total_rosters: 0,
  name: "",
  avatar: "",
  sport: "",
  shard: 0,
  settings: {
    daily_waivers_last_ran: 0,
    reserve_allow_cov: 0,
    reserve_slots: 0,
    daily_waivers_base: 0,
    leg: 0,
    offseason_adds: 0,
    bench_lock: 0,
    trade_review_days: 0,
    league_average_match: 0,
    waiver_type: 0,
    max_keepers: 0,
    type: 0,
    pick_trading: 0,
    disable_trades: 0,
    daily_waivers: 0,
    taxi_years: 0,
    trade_deadline: 0,
    veto_show_votes: 0,
    reserve_allow_sus: 0,
    reserve_allow_out: 0,
    playoff_round_type: 0,
    waiver_day_of_week: 0,
    taxi_allow_vets: 0,
    reserve_allow_dnr: 0,
    veto_auto_poll: 0,
    reserve_allow_doubtful: 0,
    waiver_clear_days: 0,
    playoff_week_start: 0,
    daily_waivers_days: 0,
    last_scored_leg: 0,
    taxi_slots: 0,
    playoff_type: 0,
    daily_waivers_hour: 0,
    num_teams: 0,
    squads: 0,
    position_limit_qb: 0,
    veto_votes_needed: 0,
    playoff_teams: 0,
    playoff_seed_type: 0,
    start_week: 0,
    reserve_allow_na: 0,
    draft_rounds: 0,
    taxi_deadline: 0,
    waiver_bid_min: 0,
    capacity_override: 0,
    divisions: 0,
    disable_adds: 0,
    waiver_budget: 0,
    last_report: 0,
    best_ball: 0
  },
  season_type: "",
  scoring_settings: {
    st_ff: 0,
    pts_allow_7_13: 0,
    def_st_ff: 0,
    rec_yd: 0,
    fum_rec_td: 0,
    pts_allow_35p: 0,
    pts_allow_28_34: 0,
    fum: 0,
    rush_yd: 0,
    pass_td: 0,
    blk_kick: 0,
    pass_yd: 0,
    safe: 0,
    def_td: 0,
    fgm_50p: 0,
    def_st_td: 0,
    fum_rec: 0,
    rush_2pt: 0,
    xpm: 0,
    pts_allow_21_27: 0,
    fgm_20_29: 0,
    pts_allow_1_6: 0,
    fum_lost: 0,
    def_st_fum_rec: 0,
    int: 0,
    fgm_0_19: 0,
    pts_allow_14_20: 0,
    rec: 0,
    ff: 0,
    fgmiss: 0,
    st_fum_rec: 0,
    rec_2pt: 0,
    rush_td: 0,
    xpmiss: 0,
    fgm_30_39: 0,
    rec_td: 0,
    st_td: 0,
    pass_2pt: 0,
    pts_allow_0: 0,
    pass_int: 0,
    fgm_yds: 0,
    fgm_40_49: 0,
    sack: 0
  },
  roster_positions: [],
  previous_league_id: "",
  metadata: {
    latest_league_winner_roster_id: "",
    keeper_deadline: "",
    division_2: "",
    division_1: "",
    auto_continue: ""
  },
  loser_bracket_id: null,
  league_id: "",
  last_read_id: null,
  last_pinned_message_id: "",
  last_message_time: 0,
  last_message_text_map: undefined,
  last_message_id: "",
  last_message_attachment: undefined,
  last_author_is_bot: false,
  last_author_id: "",
  last_author_display_name: "",
  last_author_avatar: null,
  group_id: null,
  draft_id: "",
  company_id: null,
  bracket_id: null,
  brackets: {
    playoffs: [],
    toiletBowl: []
  },
  draft: {
    type: "",
    status: "",
    start_time: 0,
    sport: "",
    slot_to_roster_id: {},
    settings: {
      teams: 0,
      slots_wrrb_flex: 0,
      slots_wr: 0,
      slots_te: 0,
      slots_super_flex: 0,
      slots_rb: 0,
      slots_qb: 0,
      slots_k: 0,
      slots_flex: 0,
      slots_def: 0,
      slots_bn: 0,
      rounds: 0,
      reversal_round: 0,
      position_limit_qb: 0,
      player_type: 0,
      pick_timer: 0,
      nomination_timer: 0,
      enforce_position_limits: 0,
      cpu_autopick: 0,
      autostart: 0,
      autopause_start_time: 0,
      autopause_end_time: 0,
      autopause_enabled: 0,
      alpha_sort: 0
    },
    season_type: "",
    season: "",
    metadata: {
        scoring_type: "",
        name: "",
        description: ""
    },
    league_id: "",
    last_picked: 0,
    last_message_time: 0,
    last_message_id: "",
    draft_order: {},
    draft_id: "",
    creators: [],
    created: 0,
    picks: []
  },
  matchups: [],
  rosters: [],
  transactions: [],
  users: []
}];