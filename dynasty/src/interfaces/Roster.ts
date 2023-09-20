import { Owner, Player } from ".";

export interface DynastyValue {
    rank: number;
    team: number;
    qb: number;
    rb: number;
    wr: number;
    te: number;
};

export interface Roster {
    taxi: string[];
    starters: string[];
    settings: {
        all_play_wins: number,
        all_play_losses: number,
        all_play_rate: number,
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