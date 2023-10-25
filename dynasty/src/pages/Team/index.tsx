"use client";
import TeamLayout from "@/layouts/Team";
import TeamMatchupSlider from "@/components/sliders/TeamMatchups";
import * as Interfaces from "@/interfaces";
import { SeasonProvider, useLeagueContext } from "@/context";
import PerformanceInsightsWidget from "@/components/widgets/PerformanceInsights";

export default function TeamPage({ name }: Interfaces.TeamParamProps) {
    const { legacyLeague } = useLeagueContext();

    return (
        <SeasonProvider season={legacyLeague[0].season || ""}>
            <TeamLayout name={name}>
                <TeamMatchupSlider name={name}/>
                <PerformanceInsightsWidget name={name}/>
            </TeamLayout>
        </SeasonProvider>
    );
};