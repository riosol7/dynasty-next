import { Match } from ".";

export interface TeamNavProps {
    name: string;
}

export interface SideNavBarProps {
    isSidebarOpen: boolean;
};

export interface LeagueNavProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface MatchupNavProps {
    // week: number;
    // season: string;
    matchup: Match[];
    selectMatchup: (
        game: Match[], 
        event: React.MouseEvent,
        selectWeek: string,
        selectSeason: string,
    ) => void;
};