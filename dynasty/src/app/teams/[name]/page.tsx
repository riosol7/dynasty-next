"use client";
import TeamMatchupSlider from "@/components/sliders/TeamMatchups";
import PerformanceInsightsWidget from "@/components/widgets/PerformanceInsights";
import * as Interfaces from "@/interfaces";
import WeeklyStatsChart from "@/components/charts/LineCharts/WeeklyStats";
import TeamHeader from "@/components/headers/Team";
import { useLeagueContext, useSeasonContext } from "@/context";
import { findLeagueByTeamName, findUserByName, findRosterByOwnerID, findLeagueBySeason, findUserByRosterID } from "@/utils";

export default function Team({ params: { name }}: Interfaces.TeamParams) {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason } = useSeasonContext()!;
    const foundLeagueByTeamName: Interfaces.League = findLeagueByTeamName(name, legacyLeague);
    const userByTeamName: Interfaces.Owner = findUserByName(name, foundLeagueByTeamName);
    const rosterByTeamName: Interfaces.Roster = findRosterByOwnerID(userByTeamName.user_id, foundLeagueByTeamName); 
    const rID: number = rosterByTeamName?.roster_id;
    const foundLeagueBySzn: Interfaces.League = findLeagueBySeason(selectSeason, legacyLeague);
    const userByRID: Interfaces.Owner = findUserByRosterID(rID, foundLeagueBySzn);
    const nameBySeason: string = userByRID.display_name; 
    return (
        <>
            <div className="pb-5">
                <TeamHeader name={nameBySeason}/>
            </div>
            {foundLeagueBySzn.status === "pre_draft" ? 
            <></> :
            <>
            <TeamMatchupSlider name={nameBySeason}/>
            <WeeklyStatsChart name={nameBySeason}/>
            </>   
            }
            <PerformanceInsightsWidget name={nameBySeason}/>
        </>
    );
};
