"use client";
import LeagueMatchupSlider from "@/components/sliders/LeagueMatchups"
import { SeasonProvider, useLeagueContext } from "@/context";
import MatchupsLayout from "@/layouts/Matchups";
import { useState } from "react";

export default function Matchups() {
    const { legacyLeague } = useLeagueContext();
    const [ selectWeek, setSelectWeek ] = useState<number>(1); 
    return (
        <SeasonProvider season={legacyLeague[0].season || ""}>
            <MatchupsLayout selectWeek={selectWeek} setSelectWeek={setSelectWeek}>
                <LeagueMatchupSlider selectWeek={selectWeek}/>
                <p>Awards per week</p>
                <p>select Season, Week</p>
                <p>Select Matchups</p>
                <p>SideBar of custom matchups: Carlos Bowl</p>
            </MatchupsLayout>
        </SeasonProvider>
    );
};