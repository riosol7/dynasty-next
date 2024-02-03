"use client";
import { useState, useEffect } from "react";
import AgeBarChart from "@/components/charts/BarCharts/AgeChart";
import ValueRadarChart from "@/components/charts/RadarCharts/ValueChart";
import DynastyWidget from "@/components/widgets/Dynasty";
import { useFantasyMarket, useLeagueContext, usePlayerContext, useKTCContext, useSuperFlexContext, useFantasyCalcContext, useDynastyProcessContext, useFantasyProContext } from "@/context";
import * as Interfaces from "@/interfaces";
import { processPlayers, processRosters, sortDynastyRostersByMarket } from "@/utils";
import TransactionList from "@/components/widgets/TransactionList";

export default function Teams() {
    const { fantasyMarket } = useFantasyMarket()!;
    const { legacyLeague, loadLegacyLeague } = useLeagueContext(); 
    const { players, loadPlayers } = usePlayerContext();
    const { ktc, loadKTC } = useKTCContext();
    const { superFlex, loadSuperFlex } = useSuperFlexContext();
    const { fc, loadFC } = useFantasyCalcContext();
    const { dp, loadDP } = useDynastyProcessContext();
    const { fantasyPro, loadFantasyPro } = useFantasyProContext();
    const [sort, setSort] = useState<string>("TEAM");
    const [asc, setAsc] = useState<boolean>(false);
    const processedPlayers: Interfaces.Player[] = processPlayers(players, ktc, superFlex, fc, dp, fantasyPro);
    const processedRosters: Interfaces.Roster[] = processRosters(legacyLeague[0], processedPlayers);
    const sortedDynastyRosters: Interfaces.Roster[] = sortDynastyRostersByMarket(processedRosters, asc, sort, fantasyMarket);


    const [selectedTeam1, setSelectedShowTeam1] = useState<string>(sortedDynastyRosters[0]?.owner?.display_name || "");
    const [selectedTeam2, setSelectedShowTeam2] = useState<string>("");
    // console.log("selectedTeam1: ", selectedTeam1)
    const sortedRosters: Interfaces.Roster[] = processedRosters.slice().sort((a, b) => {
        const aValue = (a[fantasyMarket as keyof typeof a] as Interfaces.DynastyValue).rank;
        const bValue = (b[fantasyMarket as keyof typeof b] as Interfaces.DynastyValue).rank;
        return aValue - bValue;    
    });
    const selectedRoster1: Interfaces.Roster = sortedDynastyRosters?.find(roster => roster.owner.display_name === selectedTeam1)!;

    const handleSelectTeam1 = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const { value } = event.target;
        console.log("value: ", value)
        setSelectedShowTeam1(value);
    };

    useEffect(() => {
        if (selectedTeam1 === undefined || selectedTeam1 === "") {
            setSelectedShowTeam1(sortedDynastyRosters[0]?.owner?.display_name);
        }
    }, [sortedDynastyRosters, selectedTeam1])
    
    return (
        <div className="flex items-start">
            <div className="w-full">
                <div>
                    <select onChange={handleSelectTeam1} value={selectedTeam1} style={{background: "black"}}>
                    {sortedDynastyRosters.filter(roster => roster.owner.display_name !== selectedTeam2).map((roster, i) => 
                        <option key={i} value={roster.owner.display_name}>{roster.owner.display_name}</option>
                    )}
                    </select>
                    <div className="flex items-center">
                        <AgeBarChart roster={selectedRoster1} rosters={sortedRosters}/>
                        <ValueRadarChart roster={selectedRoster1} rosters={sortedRosters}/>
                    </div>
                </div>
                <DynastyWidget/>
            </div>
            <div className="w-3/12 pl-5">
                <TransactionList/>
            </div>
        </div>
    );
};