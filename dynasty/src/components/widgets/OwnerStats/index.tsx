import styles from "./OwnerStats.module.css";
import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import {
    findLeagueBySeason,
    findUserByName,
    findRosterByOwnerID,
    getAllPlayStats, 
    getAllTimeStats,
    getPostSeasonStats, 
    lineupEfficiency, 
    roundToHundredth,
    totalPtsPerGame, 
    winPCT, 
    findSeasonStats
} from "@/utils";
import { useLeagueContext, useSeasonContext } from "@/context";
import * as Interfaces from "@/interfaces";

export default function OwnerStatsWidget({ name }: Interfaces.TeamParamProps) {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason } = useSeasonContext();
    const [ showTopScoringPlayers, setShowTopScoringPlayers ] = useState<Boolean>(false);
    const foundLeague = findLeagueBySeason(selectSeason, legacyLeague);
    const foundUser = findUserByName(name, foundLeague);
    const foundRoster = findRosterByOwnerID(foundUser.user_id, foundLeague); 
    const rID = foundRoster.roster_id;
    const allPlaySeasonStats = getAllPlayStats(rID, selectSeason, legacyLeague);
    const allPlayAllTimeStats = getAllPlayStats(rID, "All Time", legacyLeague);
    const allTimeStats = getAllTimeStats(rID, legacyLeague);
    const postSeasonStats = getPostSeasonStats(rID, legacyLeague, selectSeason);
    const seasonFPTS = Number(foundRoster.settings.fpts + "." + foundRoster.settings.fpts_decimal);
    const allTimeTotalWins: number = allTimeStats.wins + allTimeStats.playoffs.wins || 0;
    const allTimeTotalLosses: number = allTimeStats.losses + allTimeStats.playoffs.losses || 0;
    const totalSeasonWins: number = foundRoster.settings.wins + postSeasonStats.wins || 0;
    const totalSeasonLosses: number = foundRoster.settings.losses + postSeasonStats.losses || 0;

    return (
        <div className="py-4" style={{minWidth:"300px"}}>
            <div className="flex items-center justify-between" style={{marginBottom:"8px"}}>
                <p className="font-bold" style={{color:"lightgrey"}}>PERFORMANCE INSIGHTS</p>
            </div>
            <div className="mt-5">
                <div style={{fontSize:"14px"}}>
                    <div className="pb-5">
                        <div className={styles.performanceHeader}> 
                            <p>General</p>
                        </div>
                        <div>
                            {/* Make a dropdown list of the your top performing players */}
                            <div className={styles.performanceRow}>
                                <div className="flex items-center">
                                    <Icon onClick={() => setShowTopScoringPlayers(!showTopScoringPlayers)} 
                                    style={{fontSize:"21px", marginRight:"6px", color: "lightgray"}} 
                                    icon={!showTopScoringPlayers ? "mingcute:square-arrow-down-line" : "mingcute:square-arrow-up-line"}
                                    />
                                    <p>Top Scoring Player w/ Yr, Week</p>
                                </div>
                                <p style={{ color:"whitesmoke" }}>{allTimeStats.topScorerList[0].points}</p>
                            </div>
                            { showTopScoringPlayers ?
                            allTimeStats.topScorerList.slice(1,11).map((record, i) => 
                                <div key={i}>
                                    <p>{record.points}</p>       
                                </div>
                            ):<></>}
                            {/* Make a dropdown list by using the rivalry component. */}
                            <div className={styles.performanceRow}>
                                <p>Most Wins against</p>
                                <p style={{ color:"whitesmoke" }}>{0}</p>
                            </div>
                            {/* Make a dropdown list by using the rivalry component. */}
                            <div className={styles.performanceRow}>
                                <p>Most Losses against</p>
                                <p style={{ color:"whitesmoke" }}>{0}</p>
                            </div>
                            <div className={styles.performanceRow}>
                                <p>Toilet Bowl</p>
                                <p style={{ color:"whitesmoke" }}>{allTimeStats.toiletBowls}</p>
                            </div>
                            <div className={styles.performanceRow}>
                                <p>Playoff Appearances</p>
                                <p style={{ color:"whitesmoke" }}>{allTimeStats.playoffs.appearances}</p>
                            </div>
                            <div className={styles.performanceRow}>
                                <p>Finals</p>
                                <p style={{ color:"whitesmoke" }}>{allTimeStats.playoffs.finals}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.performanceHeader}> 
                        <p className="w-8/12">{foundLeague.season} Season</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12">Record</p>
                            <p className="w-5/12">Rate</p>
                            <p className="w-2/12 flex justify-end">Rank</p>
                        </div>
                    </div>
                    <div className={styles.performanceTitleRow}>
                        <p className="w-8/12">Record</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12">{foundRoster.settings.wins}-{foundRoster.settings.losses}</p>
                            <p className="w-5/12 flex items-center">
                                {winPCT(foundRoster.settings.wins, foundRoster.settings.losses)}
                                <Icon icon="material-symbols:percent" style={{ color:"#a9dfd8", fontSize:"1em" }}/>
                            </p>
                            {/* Get Standings */}
                            <p className="w-2/12 flex justify-end">1st</p> 
                        </div>
                    </div>
                    {postSeasonStats.appearance ?
                    <>
                        <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                            <p className="w-8/12">Playoffs</p>   
                            <div className="flex items-center w-4/12">
                                <p className="w-5/12">{postSeasonStats.wins}-{postSeasonStats.losses}</p>
                                <p className="w-5/12 flex items-center"> 
                                    {winPCT(postSeasonStats.wins, postSeasonStats.losses)}
                                    {winPCT(postSeasonStats.wins, postSeasonStats.losses).toString().length === 2 ? ".00" : ""}
                                    <Icon icon="material-symbols:percent" style={{ color:"#a9dfd8", fontSize:"1em" }}/>
                                </p>
                                {/* compare playoff records: Get the playoff bracket and compare the wins and place */}
                                <p className="w-2/12 flex justify-end">1st</p>
                            </div>
                        </div>
                        <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                            <p className="w-8/12">w/ Playoffs</p>   
                            <div className="flex items-center w-4/12">
                                <p className="w-5/12">{totalSeasonWins}-{totalSeasonLosses}</p>
                                <p className="w-5/12 flex items-center"> 
                                    {winPCT(totalSeasonWins, totalSeasonLosses)}
                                    {winPCT(totalSeasonWins, totalSeasonLosses).toString().length === 2 ? ".00" : ""}
                                    <Icon icon="material-symbols:percent" style={{ color:"#a9dfd8", fontSize:"1em" }}/>
                                </p>
                                {/* compare w/playoff records: standings + Get the playoff bracket and compare the wins and place */}
                                <p className="w-2/12 flex justify-end">1st</p>
                            </div>
                        </div>
                    </>
                    : <></>}
                    <div className={`${styles.performanceSubEndTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">All Play</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12">{allPlaySeasonStats.wins}-{allPlaySeasonStats.losses}</p>
                            <p className="w-5/12 flex items-center">{winPCT(allPlaySeasonStats.wins, allPlaySeasonStats.losses)}   
                                <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                            </p>
                            {/* get PowerRankings */}
                            <p className="w-2/12 flex justify-end">1st</p>
                        </div>
                    </div>
                    <div className={styles.performanceTitleRow}>
                        <p className="w-8/12">All Time Record</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12">{allTimeStats.wins}-{allTimeStats.losses}</p>
                            <p className="w-5/12 flex items-center">
                                {winPCT(allTimeStats.wins, allTimeStats.losses) || 0}
                                <Icon icon="material-symbols:percent" style={{ color:"#a9dfd8", fontSize:"1em" }}/>
                            </p>
                            {/* get allTimeStandings */}
                            <p className="w-2/12 flex justify-end">1st</p>
                        </div>
                    </div>
                    <div>
                        {allTimeStats.playoffs.appearances > 0 ?
                        <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                            <p className="w-8/12">w/ Playoffs</p>   
                            <div className="w-4/12 flex items-center">
                                <p className="w-5/12">{allTimeTotalWins}-{allTimeTotalLosses}</p>
                                <p className="w-5/12 flex items-center"> 
                                    {winPCT(allTimeTotalWins, allTimeTotalLosses)}
                                    {winPCT(allTimeTotalWins, allTimeTotalLosses).toString().length === 2 ? ".00" : ""}
                                    <Icon icon="material-symbols:percent" style={{ color:"#a9dfd8", fontSize:"1em" }}/>
                                </p>
                                {/* get allTimeStandings + all Playoffs wins / losses and rank among the rest */}
                                <p className="w-2/12 flex justify-end">1st</p>
                            </div>
                        </div>
                        : <></>}
                        <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                            <p className="w-8/12">Best</p>
                            <div className="w-4/12 flex items-center">
                                <p className="w-5/12">{allTimeStats.best.record}</p>
                                <p className="w-5/12 flex items-center">
                                    {allTimeStats.best.winRate}
                                    <Icon icon="material-symbols:percent" style={{ color:"#a9dfd8", fontSize:"1em" }}/>
                                </p>
                                <p className="w-2/12 flex justify-end">1st</p>
                            </div>
                        </div>
                        <div className={`${styles.performanceSubEndTitleRow} ${styles.fontHover}`}>
                            <p className="w-8/12">All Play</p>
                            <div className="w-4/12 flex items-center"> 
                                <p className="w-5/12">{allPlayAllTimeStats.wins}-{allPlayAllTimeStats.losses}</p>
                                <p className="w-5/12 flex items-center">{winPCT(allPlayAllTimeStats.wins, allPlayAllTimeStats.losses)}   
                                    <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                                </p>
                                <p className="w-2/12 flex justify-end">1st</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.performanceTitleRow}>
                        <p className="w-8/12">Lineup Efficiency</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12 flex items-center">{lineupEfficiency(Number(foundRoster.settings.fpts + "." + foundRoster.settings.fpts_decimal), Number(foundRoster.settings.ppts + "." + foundRoster.settings.ppts_decimal))}
                            <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                            </p>
                            <p className="w-2/12 flex justify-end">1st</p>
                        </div>
                    </div>
                    <div className={`${styles.performanceSubEndTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">All Time</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <div className="w-5/12 flex items-center">
                                <p>{lineupEfficiency(allTimeStats.fpts, allTimeStats.ppts)}</p>
                                <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                            </div>                                
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={styles.performanceTitleRow}>
                        <p className="w-8/12">Luck Rate</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <div className="w-5/12 flex items-center">
                                <p>{roundToHundredth(winPCT(foundRoster.settings.wins, foundRoster.settings.losses)-winPCT(allPlaySeasonStats.wins, allPlaySeasonStats.losses))}</p>
                                <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                            </div>                                
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={`${styles.performanceEndTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">All Time</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <div className="w-5/12 flex items-center">
                            <p>{roundToHundredth(winPCT(allTimeStats.wins, allTimeStats.losses)-winPCT(allPlayAllTimeStats.wins, allPlayAllTimeStats.losses))}</p>
                                <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                            </div>                                
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={`pt-5 ${styles.performanceHeader}`}> 
                        <p className="w-8/12">Scoring</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">Points</p>
                            <p className="w-2/12 flex justify-end">Rank</p>
                        </div>
                    </div>
                    <div>
                        <div className={styles.performanceTitleRow}>
                            <p className="w-8/12">Total Points Per Game</p>
                            <div className="w-4/12 flex items-center">
                                <p className="w-5/12"></p>
                                <p className="w-5/12">{totalPtsPerGame(rID, seasonFPTS, legacyLeague, selectSeason)}</p>
                                <p className="w-2/12 flex justify-end">0</p>
                            </div>
                        </div>
                        <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                            <p className="w-8/12">All Time</p>
                            <div className="w-4/12 flex items-center">
                                <p className="w-5/12"></p>
                                <p className="w-5/12">{totalPtsPerGame(rID, allTimeStats.fpts, legacyLeague, undefined, true)}</p>
                                <p className="w-2/12 flex justify-end">0</p>
                            </div>
                        </div>
                        {postSeasonStats.appearance ?
                            <>
                                <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                                    <p className="w-8/12">Playoffs</p>
                                    <div className="w-4/12 flex items-center">
                                        <p className="w-5/12"></p>
                                        <p className="w-5/12">{roundToHundredth(postSeasonStats.fpts / postSeasonStats.totalGames)}</p>
                                        <p className="w-2/12 flex justify-end">0</p>
                                    </div>
                                </div>
                                <div className={`${styles.performanceSubEndTitleRow} ${styles.fontHover}`}>
                                    <p className="w-8/12">All Time w/ Playoffs</p>
                                    <div className="w-4/12 flex items-center">
                                        <p className="w-5/12"></p>
                                        <p className="w-5/12">{roundToHundredth(allTimeStats.playoffs.fpts / allTimeStats.playoffs.totalGames)}</p>
                                        <p className="w-2/12 flex justify-end">0</p>
                                    </div>
                                </div>
                            </>
                        :<></>}

                    </div>
                    <div className={styles.performanceTitleRow}>
                        <p className="w-8/12">Highest Score</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">{findSeasonStats(rID, selectSeason, legacyLeague)?.bestScore}</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">All Time</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">{allTimeStats.best.score}</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">Playoffs</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">{postSeasonStats.highestScore}</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={`${styles.performanceSubEndTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">All Time w/ Playoffs</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">{allTimeStats.playoffs.highestScore}</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={styles.performanceTitleRow}>
                        <p className="w-8/12">PF</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">{foundRoster.settings.fpts}.{foundRoster.settings.fpts_decimal}</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">All Time</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">{allTimeStats.fpts}</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">Playoffs</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">{postSeasonStats.fpts}</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={`${styles.performanceSubEndTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">All Time w/ Playoffs</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">{allTimeStats.playoffs.fpts}</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>

                    <div className={styles.performanceTitleRow}>
                        <p className="w-8/12">MAX PF</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">{foundRoster.settings.ppts}.{foundRoster.settings.ppts_decimal}</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">All Time</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">{allTimeStats.ppts}</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">Playoffs</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">0</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={`${styles.performanceSubEndTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">All Time w/ Playoffs</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">0</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={styles.performanceTitleRow}>
                        <p className="w-8/12">PA</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">{foundRoster.settings.fpts_against}.{foundRoster.settings.fpts_against_decimal}</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">All Time</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">{allTimeStats.pa}</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">Playoffs</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">{postSeasonStats.pa || 0}</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={`${styles.performanceEndTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">All Time w/ Playoffs</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12">{allTimeStats.playoffs.pa}</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};