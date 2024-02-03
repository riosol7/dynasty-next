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
    week: number;
    season: string;
};