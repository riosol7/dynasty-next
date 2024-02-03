"use client";
import TeamMatchupSlider from "@/components/sliders/TeamMatchups";
import PerformanceInsightsWidget from "@/components/widgets/PerformanceInsights";
import * as Interfaces from "@/interfaces";
import WeeklyStatsChart from "@/components/charts/LineCharts/WeeklyStats";
import TeamHeader from "@/components/headers/Team";

export default function Team({ params: { name }}: Interfaces.TeamParams) {
   
    return (
        <>
            <TeamHeader name={name}/>
            <TeamMatchupSlider name={name}/>
            <WeeklyStatsChart name={name}/>
            <PerformanceInsightsWidget name={name}/>
        </>
    );
};
