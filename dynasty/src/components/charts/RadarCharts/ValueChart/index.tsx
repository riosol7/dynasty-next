"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import * as Interfaces from "@/interfaces";
import { calculateAverage } from "@/utils";
import { useFantasyMarket } from "@/context";

export default function ValueRadarChart({ roster, rosters }: {roster: Interfaces.Roster, rosters: Interfaces.Roster[],}) {
    const { fantasyMarket } = useFantasyMarket()!;
    const totalRosters: number = rosters?.length || 0;
    const leagueAvgQBs: number = calculateAverage(rosters?.reduce((a,b) => a + (b[fantasyMarket as keyof typeof b] as Interfaces.DynastyValue)?.qb, 0), totalRosters);
    const leagueAvgRBs: number = calculateAverage(rosters?.reduce((a,b) => a + (b[fantasyMarket as keyof typeof b] as Interfaces.DynastyValue)?.rb, 0), totalRosters);
    const leagueAvgWRs: number = calculateAverage(rosters?.reduce((a,b) => a + (b[fantasyMarket as keyof typeof b] as Interfaces.DynastyValue)?.wr, 0), totalRosters);
    const leagueAvgTEs: number = calculateAverage(rosters?.reduce((a,b) => a + (b[fantasyMarket as keyof typeof b] as Interfaces.DynastyValue)?.te, 0), totalRosters);
    
    const dynastyMarket: Interfaces.DynastyValue = (roster && roster[fantasyMarket as keyof typeof roster] as Interfaces.DynastyValue)!;
    const qbMarketValue: number = dynastyMarket?.qb || 0;
    const rbMarketValue: number = dynastyMarket?.rb || 0;
    const wrMarketValue: number = dynastyMarket?.wr || 0;
    const teMarketValue: number = dynastyMarket?.te || 0;

    const series = [{
        name: roster?.owner?.display_name,
        data:[qbMarketValue, rbMarketValue, wrMarketValue, teMarketValue, 0],
    },
    {
        name:"League Average",
        data:[leagueAvgQBs,leagueAvgRBs,leagueAvgWRs,leagueAvgTEs, 0]
    }
    ]
    const options = {
        chart: {
            foreColor: 'none',
            toolbar: {
                show: false
            },
        },
        colors: ["#a9dfd8","#fccccb"],
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
        tooltip: {
            theme:"dark",
            y:{
                formatter: function (val: any) {
                  return val + " value"
                },
            },
        },
        xaxis: {
            categories: ['QB', 'RB', 'WR', 'TE', 'Draft']
        }
    };

    return (
        <Chart 
            type='radar'
            series={series}
            options={options}   
            width={280}
            height={290}
        />
    );
}