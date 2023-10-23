"use client";
import LeagueMatchupSlider from "@/components/sliders/LeagueMatchups"
import { useLeagueContext, useSeasonContext } from "@/context";


export default function Matchups() {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason } = useSeasonContext();
    
    return (
        <div>
            <LeagueMatchupSlider />
            <p>Awards per week</p>
            <p>select Season, Week</p>
            <p>Select Matchups</p>
            <p>SideBar of custom matchups: Carlos Bowl</p>
        </div>
    );
};