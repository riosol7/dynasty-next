"use client";
import styles from "./TeamNav.module.css";
import React from "react";
import * as Interfaces from "@/interfaces";
import { Icon } from "@iconify-icon/react";
import { 
    useDynastyProcessContext, 
    useFantasyCalcContext, 
    useFantasyMarket, 
    useFantasyProContext, 
    useKTCContext, 
    useLeagueContext, 
    usePlayerContext, 
    useSeasonContext, 
    useSuperFlexContext } from "@/context";
import { 
    findLeagueByTeamName, 
    findRosterByOwnerID, 
    findUserByName, 
    getTeamStats, 
    processPlayers } from "@/utils";
import { POSITIONS, POSITION_COLORS } from "@/constants";

export default function TeamNav({ name }: Interfaces.TeamNavProps) {
    const { selectSeason, onChange } = useSeasonContext();
    const { legacyLeague } = useLeagueContext();
    const { fantasyMarket } = useFantasyMarket()!;
    const { players } = usePlayerContext();
    const { ktc, loadKTC } = useKTCContext();
    const { superFlex, loadSuperFlex } = useSuperFlexContext();
    const { fc, loadFC } = useFantasyCalcContext();
    const { dp, loadDP } = useDynastyProcessContext();
    const { fantasyPro, loadFantasyPro } = useFantasyProContext();
    const foundLeague: Interfaces.League = findLeagueByTeamName(name, legacyLeague);
    const foundUser: Interfaces.Owner = findUserByName(name, foundLeague);
    const foundRoster: Interfaces.Roster = findRosterByOwnerID(foundUser.user_id, foundLeague);
    const rID:number = foundRoster?.roster_id;
    const processedPlayers: Interfaces.Player[] = processPlayers(players, ktc, superFlex, fc, dp, fantasyPro);
    const foundStats = getTeamStats(rID, selectSeason, legacyLeague, fantasyMarket, processedPlayers)!;
    // const qbStats = foundStats?.qb;
    // const rbStats = foundStats?.rb;
    // const wrStats = foundStats?.wr;
    // const teStats = foundStats?.te;
    // const defStats = foundStats?.def;
    // const kStats = foundStats?.k;
    const teamStats = foundStats?.team;
    
    return (
        <div className={`${styles.teamNav}`}>
            <div className={styles.selectSeasonContainer}>
                <Icon icon="fluent:box-multiple-search-24-regular" className={`${styles.icon}`} style={{fontSize:"1.7rem"}}/>
                <select id={styles.selectSeason} onChange={onChange} value={selectSeason}>
                    <option value={"All Time"}>All Time Season Insights</option>
                    {legacyLeague.map((league, idx) => (
                        <option key={idx} value={league.season}>{`${league.season} - Season Insights`}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-center pl-5 text-sm font-bold">
                <div className="flex items-center mr-5 pr-3">
                    <Icon icon="material-symbols:avg-pace-sharp" className={styles.icon}/>
                    <p>Avg. Age
                        <span className={`pl-2 ${styles.value}`}>{teamStats.age}</span>
                        <span className="pl-2 font-light text-[darkgray]">?nd youngest</span>
                    </p>
                </div>
                <div className="flex items-center mr-5 pr-3">
                    <Icon icon="fluent:person-tag-20-regular" className={styles.icon}/>
                    <p>
                        <span className={styles.label}>Dynasty Value</span> 
                        <span className={`pl-2 ${styles.value}`}>{teamStats.value}</span>
                        <span className="pl-2 font-light text-[darkgray]">?nd ranked</span>
                    </p>
                </div>
                <div className="flex items-center">
                    <Icon icon="fluent:people-team-16-filled" className={styles.icon}/>
                    <p>Players <span className={`pl-1 ${styles.value}`}>{teamStats.players}</span></p>
                    {POSITIONS.map((position, i) =>
                        <div key={i} className="pl-5">
                            <p style={{ color: POSITION_COLORS[position as keyof typeof POSITION_COLORS]}}>
                                {`${position}`}
                                <span className={`${styles.value} text-[white] pl-1`}
                                >{(foundStats[position.toLocaleLowerCase() as keyof typeof foundStats] as Interfaces.TeamStatDepthInterface)?.players}</span>
                                {/* <span className="text-xs text-[lightgray] font-light pl-1">qty</span> */}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
