"use client";
import styles from "./DynastyWidget.module.css";
import React, { useState } from "react";
import { useDynastyProcessContext, useFantasyCalcContext, useFantasyMarket, useFantasyProContext, useKTCContext, useLeagueContext, usePlayerContext, useSuperFlexContext } from "@/context";
import { placementRankings, processPlayers, processRosters, sortDynastyRosters } from "@/utils";
import * as Interfaces from "@/interfaces";
import { POSITION_COLORS, SLEEPER_AVATAR_BASE_URL } from "@/constants";
import AgeBarChart from "@/components/charts/BarCharts/AgeChart";
import ValueRadarChart from "@/components/charts/RadarCharts/ValueChart";

export default function DynastyWidget() {
    const { fantasyMarket } = useFantasyMarket()!;
    const { legacyLeague, loadLegacyLeague } = useLeagueContext(); 
    const { players, loadPlayers } = usePlayerContext();
    const { ktc, loadKTC } = useKTCContext();
    const { superFlex, loadSuperFlex } = useSuperFlexContext();
    const { fc, loadFC } = useFantasyCalcContext();
    const { dp, loadDP } = useDynastyProcessContext();
    const { fantasyPro, loadFantasyPro } = useFantasyProContext();
    const [showTeam, setShowTeam] = useState<boolean>(false);
    const [sort, setSort] = useState<string>("TEAM");
    const [asc, setAsc] = useState<boolean>(false);
    const processedPlayers: Interfaces.Player[] = processPlayers(players, ktc, superFlex, fc, dp, fantasyPro);
    const processedRosters: Interfaces.Roster[] = processRosters(legacyLeague[0], processedPlayers);
    const sortedDynastyRosters: Interfaces.Roster[] = sortDynastyRosters(processedRosters, asc, sort, fantasyMarket);
    
    const findPositionRank = (rID: number) => {
        const sortedQBDynastyRosters: Interfaces.Roster[] = sortDynastyRosters(processedRosters, asc, "QB", fantasyMarket).map((roster, i) => {return {...roster, settings:{...roster.settings, rank: i + 1}}});
        const sortedRBDynastyRosters: Interfaces.Roster[] = sortDynastyRosters(processedRosters, asc, "RB", fantasyMarket).map((roster, i) => {return {...roster, settings:{...roster.settings, rank: i + 1}}});
        const sortedWRDynastyRosters: Interfaces.Roster[] = sortDynastyRosters(processedRosters, asc, "WR", fantasyMarket).map((roster, i) => {return {...roster, settings:{...roster.settings, rank: i + 1}}});
        const sortedTEDynastyRosters: Interfaces.Roster[] = sortDynastyRosters(processedRosters, asc, "TE", fantasyMarket).map((roster, i) => {return {...roster, settings:{...roster.settings, rank: i + 1}}});
        const qbRank: number = sortedQBDynastyRosters.find(roster => roster.roster_id === rID)?.settings.rank!;
        const rbRank: number = sortedRBDynastyRosters.find(roster => roster.roster_id === rID)?.settings.rank!;
        const wrRank: number = sortedWRDynastyRosters.find(roster => roster.roster_id === rID)?.settings.rank!;
        const teRank: number = sortedTEDynastyRosters.find(roster => roster.roster_id === rID)?.settings.rank!;
        return {
            qb: qbRank,
            rb: rbRank,
            wr: wrRank,
            te: teRank,
        };
    };
    
    const sortedRosters = processedRosters.slice().sort((a, b) => {
        const aValue = (a[fantasyMarket as keyof typeof a] as Interfaces.DynastyValue).rank;
        const bValue = (b[fantasyMarket as keyof typeof b] as Interfaces.DynastyValue).rank;
        return aValue - bValue;    
    });

    const teamDetails = (position: string, dynastyValue: Interfaces.DynastyValue, roster: Interfaces.Roster) => {
        const rankings = findPositionRank(roster.roster_id);
        const validPlayers = roster.players.filter((element): element is Interfaces.Player => typeof element !== 'string');
          
        const positionPlayers = validPlayers.filter(
            (player: Interfaces.Player) => player.position.toUpperCase() === position.toUpperCase()
        ).slice().sort((a, b) => {
            const aValue: number = Number((a[fantasyMarket as keyof typeof a] as Interfaces.MarketContent)?.value || 0);
            const bValue: number = Number((b[fantasyMarket as keyof typeof b] as Interfaces.MarketContent)?.value || 0);
            return bValue - aValue;    
        });        
        return (
            <div className="w-3/12 px-3">
                <div className="flex justify-between">
                    <p className="font-bold" style={{color: POSITION_COLORS[position.toLocaleUpperCase() as keyof typeof POSITION_COLORS]}}>
                        {position.toLocaleUpperCase()}
                        <span style={{color:"lightgrey"}} className="mx-1 font-light">|</span>
                        <span style={{color:"white"}}>{placementRankings(rankings[position as keyof typeof rankings])}</span> 
                    </p> 
                    <p>{dynastyValue[position as keyof typeof dynastyValue]}</p>
                </div>
                {positionPlayers.map((player, idx) => 
                <div key={idx} className="my-1">
                    <div className="flex justify-between">
                        <p>{idx+ 1}. {player.first_name} {player.last_name}</p>
                        {/* <p>age {player.age}</p> */}

                        <p>{(player[fantasyMarket as keyof typeof player] as Interfaces.MarketContent)?.value}</p>
                    </div>
                </div>
                )}
            </div>
        );
    };
    
    return (
        <div>
            <div className="flex items-center py-2 text-xs text-[lightgray]">
                <p className="w-5/12">Team</p>
                <p className="w-1/12">Record</p>
                <p className="w-1/12">Overall</p>
                <p className="w-1/12">QB</p>
                <p className="w-1/12">RB</p>
                <p className="w-1/12">WR</p>
                <p className="w-1/12">TE</p>
                <p className="w-1/12">Draft</p>
            </div>
            {sortedRosters.map((roster, i) => {
                const dynastyValue = (roster[fantasyMarket as keyof typeof roster] as Interfaces.DynastyValue);
                const teamName = roster.owner.metadata.team_name;
                const displayName = roster.owner.display_name;
                const rankings = findPositionRank(roster.roster_id);
                return (
                <div key={i} className="border-[#0f0f0f] border-b-2">
                    <div className="flex items-center py-2" onClick={() => setShowTeam(!showTeam)}>
                        <div className="w-5/12 flex items-center">
                            <p className="w-4 text-center">{dynastyValue.rank}</p>
                            <div className={`mx-3 ${styles.avatar}`} style={{ backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${roster.owner.avatar})`}}></div>
                            <div className="text-sm">
                                <p>{displayName}</p>
                                <p>{displayName !== teamName ? roster.owner.metadata.team_name : ""}</p>
                            </div>
                        </div>
                        <p className="w-1/12">{roster.settings.wins}-{roster.settings.losses}-{roster.settings.ties}</p>
                        <p className="w-1/12">{dynastyValue.rank}</p>
                        <p className="w-1/12">{rankings.qb}</p>
                        <p className="w-1/12">{rankings.rb}</p>
                        <p className="w-1/12">{rankings.wr}</p>
                        <p className="w-1/12">{rankings.te}</p>
                        <p className="w-1/12">{0}</p>
                    </div>
                    {showTeam ?
                    <div className="py-3 text-xs border-t border-dashed border-[#0f0f0f]">
                        <div className="flex items-center">
                            <AgeBarChart roster={roster} rosters={sortedRosters}/>
                            <ValueRadarChart roster={roster} rosters={sortedRosters}/>
                        </div>
                        <div className="flex items-top">
                            {teamDetails("qb", dynastyValue, roster)}
                            {teamDetails("rb", dynastyValue, roster)}
                            {teamDetails("wr", dynastyValue, roster)}
                            {teamDetails("te", dynastyValue, roster)}
                        </div>
                    </div>
                    :<></>}
                </div>
                )}
            )}
        </div>
    );
};
