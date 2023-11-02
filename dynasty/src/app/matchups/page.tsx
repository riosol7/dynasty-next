"use client";
import LeagueMatchupSlider from "@/components/sliders/LeagueMatchups"
import MatchupWidget from "@/components/widgets/Matchup";
import { SeasonProvider, useLeagueContext } from "@/context";
import MatchupsLayout from "@/layouts/Matchups";
import { useState } from "react";
import * as Interfaces from "@/interfaces";
import { getMatchups } from "@/utils";
import AllTimeScoreWidget from "@/components/widgets/Matchup/AllTimeScores";

export default function Matchups() {
    const { legacyLeague } = useLeagueContext();
    const [ selectWeek, setSelectWeek ] = useState<number>(1);
    const matchups = getMatchups(legacyLeague[0].matchups);

    const [ matchup, setMatchup ] = useState<Interfaces.Match[]>(matchups[0] && matchups[0][0]);

    return (
        <SeasonProvider season={legacyLeague[0].season || ""}>
            <MatchupsLayout selectWeek={selectWeek} setSelectWeek={setSelectWeek}>
                <LeagueMatchupSlider selectWeek={selectWeek} setMatchup={setMatchup}/>
                <MatchupWidget matchup={matchup}/>
            </MatchupsLayout>
            <AllTimeScoreWidget/>
        </SeasonProvider>
    );
};