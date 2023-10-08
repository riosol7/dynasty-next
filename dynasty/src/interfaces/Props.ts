import { ReactNode } from "react";
import { Roster, League, Match, BracketMatch } from ".";

export interface MVPSlideProps {
    legacyLeague: League[];
    roster: Roster 
};

export interface SideNavBarProps {
    isSidebarOpen: boolean;
};

export interface LeagueNavProps {
    league: League;
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

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

export interface TeamLayoutProps {
    children: ReactNode;
    name: string;
};

export interface SelectSeasonProps {
    name: string;
    selectSeason: string;
};

export interface MatchupSlideProps {
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
    rank?: number | undefined;
};

export interface HighScoreRecordProps {
    record: HighScoreRecord;
    type?: string;
    index: number;
    max: number;
};