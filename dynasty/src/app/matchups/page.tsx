"use client";
import LeagueMatchupSlider from "@/components/sliders/LeagueMatchups"
import { SeasonProvider, useLeagueContext } from "@/context";
import MatchupsLayout from "@/layouts/Matchups";

export default function Matchups() {
    const { legacyLeague } = useLeagueContext();

    return (
        <SeasonProvider season={legacyLeague[0].season || ""}>
            <MatchupsLayout>
                <LeagueMatchupSlider />
                <p>Awards per week</p>
                <p>select Season, Week</p>
                <p>Select Matchups</p>
                <p>SideBar of custom matchups: Carlos Bowl</p>
            </MatchupsLayout>
        </SeasonProvider>
    );
};