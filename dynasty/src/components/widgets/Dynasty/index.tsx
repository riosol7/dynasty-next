"use client";
import styles from "./DynastyWidget.module.css";
import React, { useState } from "react";
import { useDynastyProcessContext, useFantasyCalcContext, useFantasyMarket, useFantasyProContext, useKTCContext, useLeagueContext, usePlayerContext } from "@/context";
import { findLeagueBySeason, placementRankings, processPlayers, processRosters, sortDynastyRostersByMarket } from "@/utils";
import * as Interfaces from "@/interfaces";
import { POSITION_COLORS, SLEEPER_AVATAR_BASE_URL } from "@/constants";

export default function DynastyWidget() {
    const { fantasyMarket } = useFantasyMarket()!;
    const { legacyLeague, loadLegacyLeague } = useLeagueContext(); 
    const { players, loadPlayers } = usePlayerContext();
    const { ktc, loadKTC } = useKTCContext();
    const { fc, loadFC } = useFantasyCalcContext();
    const { dp, loadDP } = useDynastyProcessContext();
    const { fantasyPro, loadFantasyPro } = useFantasyProContext();
    const [showTeam, setShowTeam] = useState<boolean>(false);
    const [sort, setSort] = useState<string>("TEAM");
    const [asc, setAsc] = useState<boolean>(false);
    const processedPlayers: Interfaces.Player[] = processPlayers(players, ktc, fc, dp, fantasyPro);
    const processedRosters: Interfaces.Roster[] = processRosters(legacyLeague[0], processedPlayers);
    
    const findPositionRank = (rID: number) => {
        const sortedQBDynastyRosters: Interfaces.Roster[] = sortDynastyRostersByMarket(processedRosters, asc, "QB", fantasyMarket)
        .map((roster, i) => {return {...roster, settings:{...roster.settings, rank: i + 1}}});
        const sortedRBDynastyRosters: Interfaces.Roster[] = sortDynastyRostersByMarket(processedRosters, asc, "RB", fantasyMarket)
        .map((roster, i) => {return {...roster, settings:{...roster.settings, rank: i + 1}}});
        const sortedWRDynastyRosters: Interfaces.Roster[] = sortDynastyRostersByMarket(processedRosters, asc, "WR", fantasyMarket)
        .map((roster, i) => {return {...roster, settings:{...roster.settings, rank: i + 1}}});
        const sortedTEDynastyRosters: Interfaces.Roster[] = sortDynastyRostersByMarket(processedRosters, asc, "TE", fantasyMarket)
        .map((roster, i) => {return {...roster, settings:{...roster.settings, rank: i + 1}}});
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
                        <div className="flex items-center">
                            <p>{idx+ 1}. {player.first_name} {player.last_name}</p>
                            <p className={styles.injuredIcon}>{player.injury_status === "IR" ? player.injury_status : ""}</p>
                        </div>
                        {/* <p>age {player.age}</p> */}

                        <p>{(player[fantasyMarket as keyof typeof player] as Interfaces.MarketContent)?.value}</p>
                    </div>
                </div>
                )}
            </div>
        );
    };
    const recentSeason: string = legacyLeague && legacyLeague[0].season; 
    const numberOfDivisions = legacyLeague[0].settings.divisions || 0;
    const initialDivisionStates = Array.from({ length: numberOfDivisions }, () => (Interfaces.sortingConfig));
    const [divisionStates, setDivisionStates] = useState(initialDivisionStates);
    const [selectSeason, setSelectSeason] = useState<string>(recentSeason);
    const foundRostersBySeason = findLeagueBySeason(selectSeason, legacyLeague).rosters;

    const findDivisionRosters = (division: number) => {
        return foundRostersBySeason?.filter(roster => roster.settings.division === division)
        .map((roster, i) => { return {...roster, settings:{...roster.settings, rank: i + 1}}});
    };
    const calculateRosterStats = (rosters: Interfaces.Roster[], division?: number) => {
        const foundRosters = division ? findDivisionRosters(division) : rosters;
        const initialValue = {
            wins: 0,
            losses: 0,
            ties: 0,
            ppts: 0,
            fpts: 0,
            pa: 0,
          };
        const totals = foundRosters.reduce((acc, roster) => {
            acc.wins += roster.settings.wins || 0;
            acc.losses += roster.settings.losses || 0;
            acc.ties += roster.settings.ties || 0;
            acc.ppts += roster.settings.ppts || 0;
            acc.fpts += roster.settings.fpts || 0;
            acc.pa += roster.settings.fpts_against || 0;
            return acc;
        }, initialValue);

        return totals;
    };
    return (
        <div>
            {/* <div className="text-sm py-4">
                <div className={`pb-3 ${styles.performanceHeader} font-bold`} style={{borderBottom:"2px solid #2a2c3e", fontSize:".7rem", color:"#7d91a6"}}>
                    <p className="w-7/12">DIVISIONS</p>
                    <p className="w-2/12">RECORD</p>
                    <p className="w-1/12">PF</p>
                    <p className="w-1/12">MAX PF</p>
                    <p className="w-1/12">PA</p>
                </div>
                {divisionStates.map((_, idx) => 
                <div key={idx} className={`${styles.performanceSubTitleRow}`}>
                    <p className="w-7/12">Division {idx + 1}</p>
                    <p className="w-2/12">{calculateRosterStats(foundRostersBySeason, idx + 1).wins}
                    -{calculateRosterStats(foundRostersBySeason, idx + 1).losses}
                    -{calculateRosterStats(foundRostersBySeason, idx + 1).ties}</p>
                    <p className="w-1/12">{calculateRosterStats(foundRostersBySeason, idx + 1).fpts}</p>
                    <p className="w-1/12">{calculateRosterStats(foundRostersBySeason, idx + 1).ppts}</p>
                    <p className="w-1/12">{calculateRosterStats(foundRostersBySeason, idx + 1).pa}</p>
                </div>)}
                <div className={styles.performanceEndTitleRow}>
                    <p className="w-7/12">Total</p>
                    <p className="w-2/12">{calculateRosterStats(foundRostersBySeason).wins}
                    -{calculateRosterStats(foundRostersBySeason).losses}
                    -{calculateRosterStats(foundRostersBySeason).ties}</p>
                    <p className="w-1/12">{calculateRosterStats(foundRostersBySeason).fpts}</p>
                    <p className="w-1/12">{calculateRosterStats(foundRostersBySeason).ppts}</p>
                    <p className="w-1/12">{calculateRosterStats(foundRostersBySeason).pa}</p>
                </div>
            </div> */}
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
                        <div className="flex items-start">
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
