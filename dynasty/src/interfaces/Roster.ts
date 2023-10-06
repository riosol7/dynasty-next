import { Owner, Player } from ".";

export interface DynastyValue {
    rank: number;
    team: number;
    qb: number;
    rb: number;
    wr: number;
    te: number;
};

interface RosterStats {
    fpts: number;
    fpts_against: number;
    ppts: number;
    wins: number;
    losses: number;
    win_rate: number;
    ties?: number;
    score?: number;
}

export interface BestOverview {
    fpts?: BestStats;
    pa?: BestStats;
    ppts?: BestStats;
    score?: number;
    wins?: BestStats;
    losses?: BestStats;
}

interface BestStats {
    score: number;
    season: string;
}

export interface Roster {
    taxi: string[];
    starters: string[];
    settings: {
        all_time : {
            season: RosterStats;
            total: RosterStats;
            playoffs: RosterStats;
        };
        all_play_wins: number;
        all_play_ties: number;
        all_play_losses: number;
        all_play_win_rate: number;
        wins: number;
        waiver_position: number;
        waiver_budget_used: number;
        total_moves: number;
        totalPtsPerGame: number
        ties: number;
        ppts_decimal: number;
        ppts: number;
        losses: number;
        fpts_decimal: number;
        fpts_against_decimal: number;
        fpts_against: number;
        fpts: number;
        division: number;
        rank: number;
        best?: BestOverview;
    };
    roster_id: number;
    reserve: string[] | null;
    players: string[] | Player[];
    player_map: Record<string, string> | null;
    power_rank: number;
    owner_id: string;
    owner: Owner;
    metadata: {
        [key: string]: string;
    };
    league_id: string;
    keepers: string[] | null;
    co_owners: string[] | null;
    ktc: DynastyValue; // KeepTradeCut
    sf: DynastyValue; // SuperFlex
    fc: DynastyValue; // FantasyCalc
    dp: DynastyValue; // DynastyProcess
};

export interface RosterProps {
    roster: Roster;
};