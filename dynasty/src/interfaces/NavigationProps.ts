import React from "react";
import { League } from ".";

export interface SideNavBarProps {
    isSidebarOpen: boolean;
}

export interface LeagueNavProps {
    league: League;
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}