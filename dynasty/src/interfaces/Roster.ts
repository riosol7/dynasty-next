import { Player } from ".";
export interface Roster {
    taxi: string[];
    starters: string[];
    settings: {
        wins: number;
        waiver_position: number;
        waiver_budget_used: number;
        total_moves: number;
        ties: number;
        losses: number;
        fpts: number;
        division: number;
    };
    roster_id: number;
    reserve: string[] | null;
    players: string[];
    player_map: Record<string, string> | null;
    owner_id: string;
    metadata: Record<string, string>;
    league_id: string;
    keepers: string[] | null;
    co_owners: string[] | null;
    ktc: {
        qb: {
            players: Player[];
            value: number;
        };
        rb: {
            players: Player[];
            value: number;
        };
        wr: {
            players: Player[];
            value: number;
        };
        te: {
            players: Player[];
            value: number;
        };
    }
}

export interface RosterContextType {
    rosters: Roster[];
    loadRosters: boolean;
}