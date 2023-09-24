import { ReactNode } from 'react';
import { Roster, League } from "."

export interface ChildrenProps {
    children: ReactNode;
};

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

export interface PowerRankingProps {
    season: string;
};

export interface RankingRowProps {
    roster: Roster;
    season: string;
};

export interface StandingProps {
    season:string; 
    playoffs: boolean;
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