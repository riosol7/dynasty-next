"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import * as Interfaces from "@/interfaces";
import { findLeagueBySeason, findRosterByName, getMatchups, getRosterPostSeasonStats, seasonStats } from "@/utils";
import { useLeagueContext, useSeasonContext } from "@/context";

export default function WeeklyStatsChart({ name }: Interfaces.WeeklyStatsProps) {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason } = useSeasonContext();
    const allTime: boolean = selectSeason === "All Time"; 
    const league: Interfaces.League = findLeagueBySeason(selectSeason, legacyLeague);
    const foundRoster: Interfaces.Roster = findRosterByName(name, league);
    const rID: number = foundRoster.roster_id;
    const postSeasonStats = getRosterPostSeasonStats(rID, legacyLeague, selectSeason);
    const weeklyLeagueAvgPts: number[] = seasonStats(selectSeason, legacyLeague).weeklyAvgPts;
    const toiletBowlGame: Interfaces.BracketMatch = league.brackets.toiletBowl[5];
    const toiletBowlMatch: boolean = 
    toiletBowlGame?.t1 === rID ||
    toiletBowlGame?.t2 === rID
    const byeWeek: boolean = postSeasonStats?.bracket?.filter(game => game.t1 === rID && !game.t1_from).length === 1; 
    const postSeasonLabels: string[] = postSeasonStats?.appearance ? 
    [`Divisional`, `Semi-finals`, `${
        postSeasonStats.playoff_rank === 3 || 
        postSeasonStats.playoff_rank === 4 ? 
        `3rd Place` : `Finals`}`] :
    [`Bottom 6`, `Bottom 4`, `${
        toiletBowlMatch ? `9th Place`: `ToiletBowl`
    }`]
    const extendedSeason: boolean = Number(selectSeason) > 2020;
    const weekLabels: string[] = Array.from({ length: extendedSeason ? 14 : 13}, 
    (_, index) => `Wk ${index + 1}`).concat(postSeasonLabels);
    const seasonMatchups:Interfaces.Match[][] = league.matchups;
    const myMatchups: Interfaces.Match[][] = getMatchups(league.matchups, rID);
    const myPts: number[] = seasonMatchups?.map(m => m.filter(t => t.roster_id === Number(rID)).map(s => s.points)[0]);
    const opponentPts: number[] = myMatchups?.map(m => m.filter(t => t.roster_id !== Number(rID)).map(s => s.points)[0]);
    const indexToAddAt = extendedSeason ? 14 : 13;
    const byeWeekPA = [...opponentPts.slice(0, indexToAddAt), 0, ...opponentPts.slice(indexToAddAt)];
    const pointsAgainstData: number[] = byeWeek ? byeWeekPA : opponentPts;
        
    const series = [
        {
            name:foundRoster?.owner?.display_name,
            data: myPts
        },
        {
            name: "Points Against",
            data: pointsAgainstData
        },
        {
            name:"League Average",
            data: weeklyLeagueAvgPts
        },
    ];   
    const options = {
        chart: {
            animations: {
                enabled: false,
                dynamicAnimation: {
                    speed: 1000
                }
            },
            background: 'inherit',
            dropShadow: {
                enabled: true,
                top: 5,
                left: 7,
                blur: 5,
                opacity: 1,
            },
            foreColor: '#fff',
            toolbar: {
                show: false
            },
            stacked: false,
        },
        colors:[
            "#a9dfd8","#bda9df","#dab0af"
        ],
        dataLabels: {
            enabled: false
        },
        grid: {
            show: false,
            padding: {
              bottom: 0
            }
          },
        legend:{
            show:false
        },
        markers: {
            size: 0,
            strokeWidth: 3,
            hover: {
                size: 4
            }
        },
        stroke: {
            // curve: 'smooth',
            width: 4
        },
        theme: {
            // mode: 'dark', 
        },
        // title:{
        //     text:"Dynasty Growth",
        //     align:"left"
        // },
        tooltip: {
            x: {
                format: 'MM/dd/yy'
            },
        },
        xaxis: { 
            // type: 'category',
            categories: weekLabels
        },
        zoom: {
            enabled: false
        }
    };
    return (
        allTime ? <></> :
        <Chart
            options={options} 
            series={series} 
            type="line" 
            height={350}
            width={"100%"} 
        />
    );
};