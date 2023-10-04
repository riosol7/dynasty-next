import Image from "next/image";
import styles from "./PerformanceInsights.module.css";
import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import {
    findLeagueBySeason,
    findUserByName,
    findRosterByOwnerID,
    getAllPlayStats, 
    getAllTimeLeagueStats,
    getAllTimeRosterStats,
    getRosterPostSeasonStats,
    getPowerRankings,
    overallHighScoreRanking, 
    lineupEfficiency, 
    roundToHundredth,
    totalPtsPerGame, 
    winPCT, 
    findSeasonStats,
    findPlayerByID,
    getRivalryStats,
    sortAllTimeRostersByType,
    sortSeasonalRostersByType,
} from "@/utils";
import { PLAYER_BASE_URL } from "@/constants";
import { useLeagueContext, usePlayerContext, useSeasonContext } from "@/context";
import * as Interfaces from "@/interfaces";
import RivalryRecord from "./RivalryRecord";
import HighScoreRecord from "./HighScoreRecord";

export default function PerformanceInsightsWidget({ name }: Interfaces.TeamParamProps) {
    const { legacyLeague } = useLeagueContext();
    const { players } = usePlayerContext();
    const { selectSeason } = useSeasonContext();
    const [ showTopScoringPlayers, setShowTopScoringPlayers ] = useState<Boolean>(false);
    const [ selectVS, setSelectVS ] = useState<string>("Rivalry");
    const foundLeague = findLeagueBySeason(selectSeason, legacyLeague);
    const foundUser = findUserByName(name, foundLeague);
    const foundRoster = findRosterByOwnerID(foundUser.user_id, foundLeague); 
    const rID: number = foundRoster.roster_id;
    const seasonalLineupEfficiency = sortSeasonalRostersByType(foundLeague.rosters, "Lineup Efficiency");
    const seasonalLineupEfficiencyRank = seasonalLineupEfficiency?.find(roster => roster.roster_id === rID)?.settings.rank;
    const myAllTimeBest = sortAllTimeRostersByType(legacyLeague, "Best")?.find(roster => roster.roster_id === rID);
    const allTimeBestStats = myAllTimeBest?.settings.all_time.best;
    const allTimeBestRankings = myAllTimeBest?.settings?.rank;
    const allTimeRankings = sortAllTimeRostersByType(legacyLeague, "All Time")?.find(roster => roster.roster_id === rID)?.settings.rank;
    const allTimePlayoffsRankings = sortAllTimeRostersByType(legacyLeague, "All Time w/ Playoffs")?.find(roster => roster.roster_id === rID)?.settings.rank;
    const allPlaySeasonStats = getAllPlayStats(rID, selectSeason, legacyLeague);
    const allPlayAllTimeStats = getAllPlayStats(rID, "All Time", legacyLeague);
    const allTimeLeagueStats = getAllTimeLeagueStats(legacyLeague);
    const allTimeRosterStats = getAllTimeRosterStats(rID, legacyLeague);
    const postSeasonStats = getRosterPostSeasonStats(rID, legacyLeague, selectSeason);
    const seasonFPTS: number = Number(foundRoster.settings.fpts + "." + foundRoster.settings.fpts_decimal);
    const allTimeTotalWins: number = allTimeRosterStats.wins + allTimeRosterStats.playoffs.wins || 0;
    const allTimeTotalLosses: number = allTimeRosterStats.losses + allTimeRosterStats.playoffs.losses || 0;
    const totalSeasonWins: number = foundRoster.settings.wins + postSeasonStats.wins || 0;
    const totalSeasonLosses: number = foundRoster.settings.losses + postSeasonStats.losses || 0;
    const myHighestScoringPlayer = allTimeRosterStats.topPlayerScores[0];
    const rivalryStats = getRivalryStats(rID, legacyLeague);
    const foundPlayer = findPlayerByID(myHighestScoringPlayer?.starter, players);
    const mySeasonalPowerRank = getPowerRankings(selectSeason, legacyLeague)?.find(roster => roster.roster_id === rID)?.power_rank;
    const myAllTimePowerRank = getPowerRankings("All Time", legacyLeague)?.find(roster => roster.roster_id === rID)?.power_rank;
    const handleSelectVS = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectVS(event.target.value);
    };

    return (
        <div className="" style={{minWidth:"300px"}}>
            <div className="flex items-center justify-between py-3">
                <p className="font-bold" style={{color:"lightgrey"}}>PERFORMANCE INSIGHTS</p>
            </div>
            <div className="">
                <div style={{fontSize:"14px"}}>
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
                            <p className="w-2/12 flex justify-end">{foundRoster.settings.rank}</p> 
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
                                <p className="w-2/12 flex justify-end">{postSeasonStats.playoff_rank}</p>
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
                                <p className="w-2/12 flex justify-end">{foundRoster.settings.rank < 7 ? postSeasonStats.playoff_rank : foundRoster.settings.rank}</p>
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
                            <p className="w-2/12 flex justify-end">{mySeasonalPowerRank}</p>
                        </div>
                    </div>
                    <div className={styles.performanceTitleRow}>
                        <p className="w-8/12">All Time Record</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12">{allTimeRosterStats.wins}-{allTimeRosterStats.losses}</p>
                            <p className="w-5/12 flex items-center">
                                {winPCT(allTimeRosterStats.wins, allTimeRosterStats.losses) || 0}
                                <Icon icon="material-symbols:percent" style={{ color:"#a9dfd8", fontSize:"1em" }}/>
                            </p>
                            <p className="w-2/12 flex justify-end">{allTimeRankings}</p>
                        </div>
                    </div>
                    <div>
                        {allTimeRosterStats.playoffs.appearances > 0 ?
                        <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                            <p className="w-8/12">w/ Playoffs</p>   
                            <div className="w-4/12 flex items-center">
                                <p className="w-5/12">{allTimeTotalWins}-{allTimeTotalLosses}</p>
                                <p className="w-5/12 flex items-center"> 
                                    {winPCT(allTimeTotalWins, allTimeTotalLosses)}
                                    {winPCT(allTimeTotalWins, allTimeTotalLosses).toString().length === 2 ? ".00" : ""}
                                    <Icon icon="material-symbols:percent" style={{ color:"#a9dfd8", fontSize:"1em" }}/>
                                </p>
                                <p className="w-2/12 flex justify-end">{allTimePlayoffsRankings}</p>
                            </div>
                        </div>
                        : <></>}
                        <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                            <p className="w-8/12">Best</p>
                            <div className="w-4/12 flex items-center">
                                <p className="w-5/12">{allTimeRosterStats.best.record}</p>
                                <p className="w-5/12 flex items-center">
                                    {allTimeRosterStats.best.winRate}
                                    <Icon icon="material-symbols:percent" style={{ color:"#a9dfd8", fontSize:"1em" }}/>
                                </p>
                                <p className="w-2/12 flex justify-end">{allTimeBestRankings}</p>
                            </div>
                        </div>
                        <div className={`${styles.performanceSubEndTitleRow} ${styles.fontHover}`}>
                            <p className="w-8/12">All Play</p>
                            <div className="w-4/12 flex items-center"> 
                                <p className="w-5/12">{allPlayAllTimeStats.wins}-{allPlayAllTimeStats.losses}</p>
                                <p className="w-5/12 flex items-center">{winPCT(allPlayAllTimeStats.wins, allPlayAllTimeStats.losses)}   
                                    <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                                </p>
                                <p className="w-2/12 flex justify-end">{myAllTimePowerRank}</p>
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
                            <p className="w-2/12 flex justify-end">{seasonalLineupEfficiencyRank}</p>
                        </div>
                    </div>
                    <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">Best</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <p className="w-5/12 flex items-center">
                            <p>{lineupEfficiency(allTimeBestStats?.fpts!, allTimeBestStats?.ppts!)}</p>
                                <Icon icon="material-symbols:percent" style={{ color:"#a9dfd8", fontSize:"1em" }}/>
                            </p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className={`${styles.performanceSubEndTitleRow} ${styles.fontHover}`}>
                        <p className="w-8/12">All Time</p>
                        <div className="w-4/12 flex items-center">
                            <p className="w-5/12"></p>
                            <div className="w-5/12 flex items-center">
                                <p>{lineupEfficiency(allTimeRosterStats.fpts, allTimeRosterStats.ppts)}</p>
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
                            <p>{roundToHundredth(winPCT(allTimeRosterStats.wins, allTimeRosterStats.losses)-winPCT(allPlayAllTimeStats.wins, allPlayAllTimeStats.losses))}</p>
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
                                <p className="w-5/12">{totalPtsPerGame(rID, allTimeRosterStats.fpts, legacyLeague, undefined, true)}</p>
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
                                        <p className="w-5/12">{roundToHundredth(allTimeRosterStats.playoffs.fpts / allTimeRosterStats.playoffs.totalGames)}</p>
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
                            <p className="w-5/12">{allTimeRosterStats.best.score}</p>
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
                            <p className="w-5/12">{allTimeRosterStats.playoffs.highestScore}</p>
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
                            <p className="w-5/12">{allTimeRosterStats.fpts}</p>
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
                            <p className="w-5/12">{allTimeRosterStats.playoffs.fpts}</p>
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
                            <p className="w-5/12">{allTimeRosterStats.ppts}</p>
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
                            <p className="w-5/12">{allTimeRosterStats.pa}</p>
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
                            <p className="w-5/12">{allTimeRosterStats.playoffs.pa}</p>
                            <p className="w-2/12 flex justify-end">0</p>
                        </div>
                    </div>
                    <div className="py-5">
                        <div className={`${styles.performanceHeader}`}> 
                            <p className="w-10/12">General</p>
                            <p className="w-2/12 flex justify-end"></p>
                        </div>
                        <div className={`${styles.performanceRow}`} style={{paddingBlock: "1em"}}>
                            <p>Toilet Bowl</p>
                            <p style={{ color:"whitesmoke" }}>{allTimeRosterStats.toiletBowls}</p>
                        </div>
                        <div className={styles.performanceRow} style={{paddingBlock: "1em"}}>
                            <p>Playoff Appearances</p>
                            <p style={{ color:"whitesmoke" }}>{allTimeRosterStats.playoffs.appearances}</p>
                        </div>
                        <div className={styles.performanceRow} style={{paddingBlock: "1em"}}>
                            <p>Finals</p>
                            <p style={{ color:"whitesmoke" }}>{allTimeRosterStats.playoffs.finals}</p>
                        </div>
                    </div>
                    <div className="py-5">
                        <div className={`${styles.performanceHeader}`}> 
                            <p className="w-8/12">Highest Team Score</p>
                            <div className="w-4/12 flex items-center">
                                <p className="w-4/12">Week</p>
                                <p className="w-4/12">Season</p>
                                <p className="w-4/12 flex justify-end">Overall Rank</p>
                            </div>
                        </div>
                        {allTimeRosterStats.topTeamScore.slice(0, 10).map((record, i) => (
                            <HighScoreRecord key={i} record={record} type="team"/>
                        ))}
                    </div>
                    <div className="py-5">
                        <div className={`${styles.performanceHeader}`}> 
                            <p className="w-8/12">Highest Scoring Player(s)</p>
                            <div className="w-4/12 flex items-center">
                                <p className="w-3/12">Week</p>
                                <p className="w-3/12">Season</p>
                                <p className="w-3/12">Points</p>
                                <p className="w-3/12 flex justify-end">Overall Rank</p>
                            </div>
                        </div>
                        <div className={styles.performanceRow} style={{ paddingTop: ".8em"}}>
                            <div className="w-8/12 flex items-center">
                                <Icon onClick={() => setShowTopScoringPlayers(!showTopScoringPlayers)} 
                                style={{fontSize:"21.5px", width:"25px", color: "lightgray"}} 
                                icon={!showTopScoringPlayers ? "mingcute:square-arrow-down-line" : "mingcute:square-arrow-up-line"}
                                />
                                <Image className={styles.playerImage} src={`${PLAYER_BASE_URL}${myHighestScoringPlayer?.starter}.jpg`} alt="player" width={60} height={60}/>
                                <div>
                                    <p className="font-bold">{foundPlayer?.first_name} {foundPlayer.last_name}</p>
                                    <p className="font-light text-xs">{foundPlayer.position}</p>
                                </div>
                            </div>
                            <div style={{ color:"whitesmoke" }} className="w-4/12 flex items-center">
                                <p className="w-3/12">{myHighestScoringPlayer?.week}</p>
                                <p className="w-3/12">{myHighestScoringPlayer?.season}</p>
                                <p className="w-3/12">{myHighestScoringPlayer?.points}</p>
                                <p className="w-3/12 flex justify-end">{overallHighScoreRanking(myHighestScoringPlayer?.points!, allTimeLeagueStats?.playerHighScores!)?.rank}</p>
                            </div>
                        </div>
                        {showTopScoringPlayers ?
                        allTimeRosterStats.topPlayerScores.slice(1,11).map((record: Interfaces.HighScoreRecord, i) => 
                            <HighScoreRecord key={i} record={record} type="player"/>)
                        :<></>}
                    </div>
                    <div className="py-5">
                        <div className={`pb-2 ${styles.performanceHeader}`}> 
                            <p className="w-8/12">Most Wins / Losses Against
                                (<select className={styles.selectVS} onChange={handleSelectVS} value={selectVS}>
                                    <option value={"Rivalry"}>Rivalry</option>
                                    <option value={"All Play"}>All Play</option>
                                </select>)
                            </p>
                            <div className="w-4/12 flex items-center">
                                <p className="w-3/12">Wins</p>
                                <p className="w-3/12">Losses</p>
                                <p className="w-3/12">Rate</p>
                                <p className="w-3/12">GP</p>
                            </div>
                        </div>
                        {selectVS === "Rivalry" ?
                            rivalryStats.records.map(((record, i) => 
                                <RivalryRecord key={i} record={record}/>
                            ))
                        : allPlayAllTimeStats.opponents.map((record, i) =>
                                <RivalryRecord key={i} record={record}/>
                        )}
                    </div>


                    <div>

                    </div>



                </div>
            </div>
        </div>
    );
};