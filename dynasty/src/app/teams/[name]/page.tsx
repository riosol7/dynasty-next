"use client";
import TeamLayout from "@/layouts/Team";
import TeamMatchupSlider from "@/components/sliders/TeamMatchups";
import { SeasonProvider, useLeagueContext } from "@/context";
import PerformanceInsightsWidget from "@/components/widgets/PerformanceInsights";
import * as Interfaces from "@/interfaces";

export default function Team({ params: { name }}: Interfaces.TeamParams) {
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
