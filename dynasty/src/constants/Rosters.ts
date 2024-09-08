import * as Interfaces from "@/interfaces";
import { initOwner } from "./Owner";

export const initRoster: Interfaces.Roster = {
    taxi: [],
    starters: [],
    settings: {
        all_time: {
            season: {
                fpts: 0,
                fpts_against: 0,
                ppts: 0,
                wins: 0,
                losses: 0,
                win_rate: 0,
                ties: 0,
            },
            total: {
                fpts: 0,
                fpts_against: 0,
                ppts: 0,
                wins: 0,
                losses: 0,
                win_rate: 0,
                ties: 0,
            },
            playoffs: {
                fpts: 0,
                fpts_against: 0,
                ppts: 0,
                wins: 0,
                losses: 0,
                win_rate: 0,
                ties: 0,
            },
        },
        all_play_wins: 0,
        all_play_ties: 0,
        all_play_losses: 0,
        all_play_win_rate: 0,
        wins: 0,
        waiver_position: 0,
        waiver_budget_used: 0,
        total_moves: 0,
        ties: 0,
        ppts_decimal: 0,
        ppts: 0,
        losses: 0,
        fpts_decimal: 0,
        fpts_against_decimal: 0,
        fpts_against: 0,
        fpts: 0,
        division: 0,
        rank: 0,
        totalPtsPerGame: 0
    },
    roster_id: 0,
    reserve: null,
    players: [],
    player_map: null,
    power_rank: 0,
    owner_id: '',
    owner: initOwner,
    metadata: {},
    league_id: '',
    keepers: null,
    co_owners: null,
    ktc: {
        rank: 0,
        team: 0,
        qb: 0,
        rb: 0,
        wr: 0,
        te: 0,
    },
    fc: {
        rank: 0,
        team: 0,
        qb: 0,
        rb: 0,
        wr: 0,
        te: 0,
    },
    dp: {
        rank: 0,
        team: 0,
        qb: 0,
        rb: 0,
        wr: 0,
        te: 0,
    },
};