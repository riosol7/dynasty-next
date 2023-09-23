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

export interface PowerRowProps {
    roster: Roster;
    season: string;
};

export interface StandingProps {
    season:string; 
    playoffs: boolean;
};

export interface TableHeaderProps {
    label: string;
    sortKey: string;
    sort: string;
    asc: boolean;
    setAsc: React.Dispatch<React.SetStateAction<boolean>>;
    setSort:  React.Dispatch<React.SetStateAction<string>>;
};