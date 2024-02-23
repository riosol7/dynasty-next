import { ReactNode } from "react";
import { Roster, League, Match, BracketMatch, Transaction, Player } from ".";
import { Waivers } from "@/types";

export interface MVPSlideProps {
    legacyLeague: League[];
    roster: Roster;
    mvpType: string;
};

export interface LeagueMatchupSliderProps {
    matchup: Match[];
    selectMatchup: (
        game: Match[], 
        event: React.MouseEvent,
        selectWeek: string,
        selectSeason: string,
    ) => void;
};

export interface PerformerSliderProps {
    matchup: Match[];
}

export interface DynastyRowProps {
    roster: Roster;
    sort: string;
    fantasyMarket: string;
};

export interface SeasonProps {
    season: string;
};

export interface RankingRowProps {
    roster: Roster;
    season: string;
};

export interface StandingProps {
    season:string; 
    tournament: boolean;
};

export interface StandingTableHeaderProps {
    label?: string;
    sort: string;
    asc: boolean;
    updateOverallStandings?: (newSortingConfig: SortingConfigProps) => void;
    updateDivisionState?: (divisionIndex: number, newSort: string, newAsc: boolean) => void;
    division?: number;
};

export interface SortProps {
    label: string;
    sort: string;
    asc: boolean;
    setAsc: React.Dispatch<React.SetStateAction<boolean>>;
    setSort: React.Dispatch<React.SetStateAction<string>>;
};

export interface SortIconProps {
    asc: boolean;
    label?: string;
    onClick: () => void;
};

export interface SortingConfigProps {
    sort: string;
    asc: boolean;
};

export const sortingConfig: SortingConfigProps = {
    sort: 'rank',
    asc: true,
};

export interface BracketProps {
    season: string;
    sectionTitle: string;
    children?: ReactNode;
};

export interface WeekLabelProps {
    season: string;
    weekNumber: number;
};

export interface RosterHUDProps {
    roster: Roster;
    type: string
};

export interface PostSeasonMatchProps {
    match: BracketMatch;
    matchKey: number;
    round: number;
    season: string;
    sectionTitle: string;
};

export interface SelectSeasonProps {
    name: string;
    selectSeason: string;
};

export interface TeamMatchupSlideProps {
    idx: number;
    name: string;
    matchup: Match[];
};

export interface HighScoreRecord {
    roster_id?: number;
    season: string;
    week: number;
    starter?: string;
    points: number;
    opponent_points?: number;
    opponent_rID?: number;
    rank?: number | undefined;
};

export interface HighScoreRecordProps {
    record: HighScoreRecord;
    type?: string;
    index: number;
    max: number;
};

export interface TrendChartProps {
    waivers: Transaction[];
    height: number;
    width?: number;
}

export interface MarketWidgetProps {
    waivers: Waivers;
    selectSeason: string;
}

export interface MatchupWidgetProps {
    matchup: Match[];
}

export interface WeeklyStatsProps {
    name: string
}

export interface PlayerRowProps {
    record: Transaction;
    sort: string;
}

export interface PlayerHeaderProps {
    asc: boolean;
    currentPage: number;
    handleOwner: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handlePosition?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    plus: boolean;
    recordsPerPage: number;
    selectOwner: string;
    selectPosition?: string;
    setAsc: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    setRecordsPerPage: React.Dispatch<React.SetStateAction<number>>;
    setSort: React.Dispatch<React.SetStateAction<string>>;
    sort: string;
    waiverBids: Transaction[];
}

export interface LegacyMatchupProps {
    matchup?: Match[];
    legacy?: boolean;
    selectMatchup: (
        game: Match[], 
        event: React.MouseEvent,
        selectWeek: string,
        selectSeason: string,
    ) => void;}