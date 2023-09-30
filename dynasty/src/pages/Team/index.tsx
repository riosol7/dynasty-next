"use client";
import React, { useState, useEffect } from "react";
import TeamLayout from "@/layouts/Team";
import MatchupSlider from "@/components/sliders/Matchup";
import * as Interfaces from "@/interfaces";
import { SeasonProvider, useSeasonContext, useLeagueContext } from "@/context";
import PerformanceInsightsWidget from "@/components/widgets/PerformanceInsights";

// for summary & power let the all time stats be a comparison to the selected season.
export default function TeamPage({ name }: Interfaces.TeamParamProps) {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason, setSelectSeason } = useSeasonContext();
    const [tab, setTab] = useState("Summary");

    return (
        <SeasonProvider season={legacyLeague[0].season || ""}>
            <TeamLayout tab={tab} setTab={setTab} name={name}>
            {tab === "Summary" ? 
                <>
                <MatchupSlider name={name}/>
                <PerformanceInsightsWidget name={name}/>
                </>
            : tab === "Dynasty" ? 
            <></>
            : tab === "Power" ? <></> : <></>
            }
            </TeamLayout>
        </SeasonProvider>
    );
};