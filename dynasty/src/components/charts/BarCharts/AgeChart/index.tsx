"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import * as Interfaces from "@/interfaces";
import { roundToHundredth } from "@/utils";
import { useFantasyMarket } from "@/context";

export default function AgeBarChart({ roster, rosters }: {roster: Interfaces.Roster, rosters: Interfaces.Roster[],}) {
    const { fantasyMarket } = useFantasyMarket()!;

    const avgLeagueAgeByPosition = (position: string) => {
        const totalRosters: number  = rosters.length;    

        const avgAge: number = rosters.map(team => {
            const validPlayers = team.players.filter((element): element is Interfaces.Player => typeof element !== 'string');
          
            const positionPlayers = validPlayers.filter(
                (player: Interfaces.Player) => player.position.toUpperCase() === position.toUpperCase()
            ).slice().sort((a, b) => {
                const aValue: number = Number((a[fantasyMarket as keyof typeof a] as Interfaces.MarketContent)?.value || 0);
                const bValue: number = Number((b[fantasyMarket as keyof typeof b] as Interfaces.MarketContent)?.value || 0);
                return bValue - aValue;    
            });  
            
            return roundToHundredth(positionPlayers.reduce((a,b) => a + Number(b.age), 0)/ positionPlayers.length)
        
        }).reduce((a,b) => a + b,0)/totalRosters;
        
        return avgAge;
    };

    const avgRosterAgeByPosition = (position: string) => {
        const validPlayers = roster.players.filter((element): element is Interfaces.Player => typeof element !== 'string');
          
        const positionPlayers = validPlayers.filter(
            (player: Interfaces.Player) => player.position.toUpperCase() === position.toUpperCase()
        ).slice().sort((a, b) => {
            const aValue: number = Number((a[fantasyMarket as keyof typeof a] as Interfaces.MarketContent)?.value || 0);
            const bValue: number = Number((b[fantasyMarket as keyof typeof b] as Interfaces.MarketContent)?.value || 0);
            return bValue - aValue;    
        });  
        
        return roundToHundredth(positionPlayers.reduce((a,b) => a + Number(b.age), 0)/ positionPlayers.length);
    };

    const avgQB = avgLeagueAgeByPosition("qb");
    const avgRB = avgLeagueAgeByPosition("rb");
    const avgWR = avgLeagueAgeByPosition("wr");
    const avgTE = avgLeagueAgeByPosition("te");

    const series = [{
        name:roster.owner.display_name,
        data:[roundToHundredth(roundToHundredth(
            avgRosterAgeByPosition("qb") + avgRosterAgeByPosition("rb") + avgRosterAgeByPosition("wr") + avgRosterAgeByPosition("te")
            )/4), 
            avgRosterAgeByPosition("qb"),
            avgRosterAgeByPosition("rb"),
            avgRosterAgeByPosition("wr"),
            avgRosterAgeByPosition("te")
        ]
    },{
        name:"League Average", 
        data: [roundToHundredth((avgQB + avgRB + avgWR + avgTE)/4),
            roundToHundredth(avgQB),
            roundToHundredth(avgRB), 
            roundToHundredth(avgWR), 
            roundToHundredth(avgTE)
        ]
    }];
    const options = {
        chart: {
            type: 'bar',
            foreColor: '#b0b0b2',
            toolbar: {
                show: false
            },
        },
        colors: ["#a9dfd8","#fccccb"],
        dataLabels: {
            enabled: false
        },
        fill: {
            opacity: 1
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
        plotOptions: {
            bar: {
                horizontal: true,
                columnHeight: '15',
                endingShape: 'rounded'
            },
        },
        stroke: {
            show: true,
            width: 3,
            colors: ['transparent']
        },
        tooltip: {
            theme:"dark",
            y:{
                formatter: function (val: any) {
                  return val + " years"
                },
            },
        },
        xaxis: {
            categories: ["All","QB","RB","WR","TE"]
        },
        yaxis: {
            title: {
                text: ""
            },
        },
    };

    return (
        <Chart
            type="bar"
            series={series}
            options={options}   
            width={280}
            height={280}
        />
    );
};