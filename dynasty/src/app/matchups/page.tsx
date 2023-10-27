"use client";
import LeagueMatchupSlider from "@/components/sliders/LeagueMatchups"
// import MatchupWidget from "@/components/widgets/Matchup";
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
                {/* <MatchupWidget matchup={}/> */}
                <p>SideBar: list of custom matchups, List Highest Scoring Games</p>
            </MatchupsLayout>
        </SeasonProvider>
    );
};