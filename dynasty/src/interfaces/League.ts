import { BracketMatch, Draft, Match, Owner, Roster, Transaction } from ".";

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
    playoffs: BracketMatch[];
    toiletBowl: BracketMatch[];
  };
  draft: Draft;
  matchups: Match[][]; // Update this type as per your data
  rosters: Roster[];
  transactions: Transaction[];
  users: Owner[]
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