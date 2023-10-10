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
    totalPointsPerGame,
    winPCT, 
    findSeasonStats,
    findPlayerByID,
    getRivalryStats,
    sortAllTimeRostersByType,
    sortSeasonalRostersByType,
    findRosterByRosterID,
} from "@/utils";
import { useLeagueContext, usePlayerContext, useSeasonContext } from "@/context";
import * as Interfaces from "@/interfaces";
import RivalryRecord from "./RivalryRecord";
import HighScoreRecord from "./HighScoreRecord";
import Roster from "./Roster";

export default function PerformanceInsightsWidget({ name }: Interfaces.TeamParamProps) {
    const { legacyLeague } = useLeagueContext();
    const { players } = usePlayerContext();
    const { selectSeason } = useSeasonContext();
    const [ showSeasonalAllPlay, setShowSeasonalAllPlay ] = useState<Boolean>(false);
    const [ showAllTimeAllPlay, setShowAllTimeAllPlay ] = useState<Boolean>(false);
    const [ showWeeklyHighScores, setShowWeeklyHighScores ] = useState<Boolean>(false);
    const [ showPlayerHighScores, setShowPlayerHighScores ] = useState<Boolean>(false);
    const [ showMostWinsAgainst, setShowMostWinsAgainst ] = useState<Boolean>(false);
    const foundLeague = findLeagueBySeason(selectSeason, legacyLeague);
    const foundUser = findUserByName(name, foundLeague);
    const foundRoster = findRosterByOwnerID(foundUser.user_id, foundLeague);
    const rID: number = foundRoster.roster_id;

    const sortedByAllTimeLuckRate = sortAllTimeRostersByType(legacyLeague, "Luck Rate");    
    const sortedByLuckRate = sortSeasonalRostersByType(foundLeague.rosters, "Seasonal Luck Rate", legacyLeague);
    const sortedByBestLuckRate = sortSeasonalRostersByType(foundLeague.rosters, "Best Luck Rate", legacyLeague);
    const sortedByTotalPtsPerGame = sortSeasonalRostersByType(foundLeague.rosters, "Total Pts Per Game", legacyLeague);
    const sortedByBestTotalPtsPerGame = sortAllTimeRostersByType(legacyLeague, "Best Total Pts Per Game")!;
    const sortedByAllTimeTotalPtsPerGame = sortAllTimeRostersByType(legacyLeague, "All Time Total Pts Per Game")!;
    const sortedPostSeasonStats = sortSeasonalRostersByType(foundLeague.rosters, "Total Playoff Pts Per Game", legacyLeague);
    const sortedBestPFStats = sortSeasonalRostersByType(sortAllTimeRostersByType(legacyLeague, "Best")!, "Best PF", legacyLeague);
    const sortedBestMAXPFStats = sortSeasonalRostersByType(sortAllTimeRostersByType(legacyLeague, "Best")!, "Best MAX PF", legacyLeague);
    const sortedBestPAStats = sortSeasonalRostersByType(sortAllTimeRostersByType(legacyLeague, "Best")!, "Best PA", legacyLeague);
    const sortedBySeasonalHighestScore = sortSeasonalRostersByType(foundLeague.rosters, "Seasonal Highest Score", legacyLeague);
    const sortedAllTimeTotalPlayoffPtsPerGame = sortAllTimeRostersByType(legacyLeague, "All Time Total Playoff Pts Per Game");
    const sortedPostSeasonHighestScore = sortSeasonalRostersByType(foundLeague.rosters, "Post Season Highest Score");
    const sortedAllTimeHighestScore = sortAllTimeRostersByType(legacyLeague, "All Time Highest Score");
    const sortedAllTimeHighestPlayoffScore = sortAllTimeRostersByType(legacyLeague, "All Time Highest Playoff Score");
    const sortedBySeasonalPF = sortSeasonalRostersByType(foundLeague.rosters, "Seasonal PF", legacyLeague);
    const sortedByPlayoffPF = sortSeasonalRostersByType(foundLeague.rosters, "Playoff PF", legacyLeague);
    const sortedByAllTimePF = sortAllTimeRostersByType(legacyLeague, "All Time PF");
    const sortedByAllTimePlayoffPF = sortAllTimeRostersByType(legacyLeague, "All Time Playoff PF");
    const sortedBySeasonalMAXPF = sortSeasonalRostersByType(foundLeague.rosters, "Seasonal MAX PF", legacyLeague);
    const sortedByAllTimeMAXPF = sortAllTimeRostersByType(legacyLeague, "All Time MAX PF");
    const sortedBySeasonalPA = sortSeasonalRostersByType(foundLeague.rosters, "Seasonal PA", legacyLeague);
    const sortedByPlayoffPA = sortSeasonalRostersByType(foundLeague.rosters, "Playoff PA", legacyLeague);
    const sortedByAllTimePA = sortAllTimeRostersByType(legacyLeague, "All Time PA");
    const sortedByAllTimePlayoffPA = sortAllTimeRostersByType(legacyLeague, "All Time Playoff PA");

    const highestPostSeasonScoreRanking = sortedPostSeasonHighestScore?.find(roster => roster.roster_id === rID)?.settings.rank;
    const totalPlayoffPtsPerGameRanking = sortedPostSeasonStats?.find(roster => roster.roster_id === rID)?.settings.rank;
    const totalPtsPerGameRanking = sortedByTotalPtsPerGame?.find(roster => roster.roster_id === rID)?.settings.rank;
    const luckRateRanking = sortedByLuckRate?.find(roster => roster.roster_id === rID)?.settings.rank;

    const myBest: Interfaces.BestOverview = sortedBestPFStats?.find(roster => roster.roster_id === rID)?.settings.best!;
    const myBestPF = myBest?.fpts?.score;
    const bestPFRanking = sortedBestPFStats?.find(roster => roster.roster_id === rID)?.settings.rank;
    const bestMAXPFRanking = sortedBestMAXPFStats?.find(roster => roster.roster_id === rID)?.settings.rank;
    const bestPARanking = sortedBestPAStats?.find(roster => roster.roster_id === rID)?.settings.rank;

    const bestLuckRateRanking = sortedByBestLuckRate?.find(roster => roster.roster_id === rID)?.settings.rank;
    const bestLineupEfficiency = sortSeasonalRostersByType(sortAllTimeRostersByType(legacyLeague, "Best")!, "Best Lineup Efficiency");
    const bestLineupEfficiencyRank = bestLineupEfficiency?.find(roster => roster.roster_id === rID)?.settings.rank;
    const bestTotalPtsPerGameRanking = sortedByBestTotalPtsPerGame?.find(roster => roster.roster_id === rID)?.settings.rank;

    const seasonalPFRanking = sortedBySeasonalPF?.find(roster => roster.roster_id === rID)?.settings.rank;
    const seasonalMAXPFRanking = sortedBySeasonalMAXPF?.find(roster => roster.roster_id === rID)?.settings.rank;
    const seasonalPARanking = sortedBySeasonalPA?.find(roster => roster.roster_id === rID)?.settings.rank;
    const seasonalLineupEfficiency = sortSeasonalRostersByType(foundLeague.rosters, "Seasonal Lineup Efficiency");
    const seasonalLineupEfficiencyRank = seasonalLineupEfficiency?.find(roster => roster.roster_id === rID)?.settings.rank;
    const seasonalHighestScoreRankings = sortedBySeasonalHighestScore?.find(roster => roster.roster_id === rID)?.settings.rank;

    const myAllTimeBest = sortAllTimeRostersByType(legacyLeague, "Best")?.find(roster => roster.roster_id === rID);
    const allTimeLuckRateRankings = sortedByAllTimeLuckRate?.find(roster => roster.roster_id === rID)?.settings.rank;
    const allTimeTotalPtsPerGameRanking = sortedByAllTimeTotalPtsPerGame?.find(roster => roster.roster_id === rID)?.settings.rank;
    const allTimeBestStats = myAllTimeBest?.settings.best;
    const allTimeBestRankings = myAllTimeBest?.settings?.rank;
    const allTimeLineupEfficiency = sortAllTimeRostersByType(legacyLeague, "All Time Lineup Efficiency");
    const allTimeLineupEfficiencyRanking = allTimeLineupEfficiency?.find(roster => roster.roster_id === rID)?.settings.rank;
    const allTimeRankings = sortAllTimeRostersByType(legacyLeague, "All Time")?.find(roster => roster.roster_id === rID)?.settings.rank;
    const allTimePlayoffsRanking = sortAllTimeRostersByType(legacyLeague, "All Time w/ Playoffs")?.find(roster => roster.roster_id === rID)?.settings.rank;
    const allTimeLeagueStats = getAllTimeLeagueStats(legacyLeague);
    const allTimeRosterStats = getAllTimeRosterStats(rID, legacyLeague);
    const allTimeTotalWins: number = allTimeRosterStats.wins + allTimeRosterStats.playoffs.wins || 0;
    const allTimeTotalLosses: number = allTimeRosterStats.losses + allTimeRosterStats.playoffs.losses || 0;
    const allTimeTotalPlayoffPtsPerGameRanking = sortedAllTimeTotalPlayoffPtsPerGame?.find(roster => roster.roster_id === rID)?.settings.rank;
    const allTimeHighestScoreRanking = sortedAllTimeHighestScore?.find(roster => roster.roster_id === rID)?.settings.rank;
    const allTimeHighestPlayoffScoreRanking = sortedAllTimeHighestPlayoffScore?.find(roster => roster.roster_id === rID)?.settings.rank;
    const allTimePFRanking = sortedByAllTimePF?.find(roster => roster.roster_id === rID)?.settings.rank;
    const allTimePlayoffPFRanking = sortedByAllTimePlayoffPF?.find(roster => roster.roster_id === rID)?.settings.rank;
    const allTimeMAXPFRanking = sortedByAllTimeMAXPF?.find(roster => roster.roster_id === rID)?.settings.rank;
    const allTimePARanking = sortedByAllTimePA?.find(roster => roster.roster_id === rID)?.settings.rank;
    const allTimePlayoffPARanking = sortedByAllTimePlayoffPA?.find(roster => roster.roster_id === rID)?.settings.rank;

    const allPlayBestSeasonStats = getAllPlayStats(rID, allTimeRosterStats.best.wins.season, legacyLeague); 
    const allPlaySeasonStats = getAllPlayStats(rID, selectSeason, legacyLeague);
    const allPlayAllTimeStats = getAllPlayStats(rID, "All Time", legacyLeague);

    const postSeasonStats = getRosterPostSeasonStats(rID, legacyLeague, selectSeason);
    const postSeasonPFRanking = sortedByPlayoffPF?.find(roster => roster.roster_id === rID)?.settings.rank;
    const postSeasonPARanking = sortedByPlayoffPA?.find(roster => roster.roster_id === rID)?.settings.rank;
    const seasonFPTS: number = Number(foundRoster.settings.fpts + "." + foundRoster.settings.fpts_decimal);
    const totalSeasonWins: number = foundRoster.settings.wins + postSeasonStats.wins || 0;
    const totalSeasonLosses: number = foundRoster.settings.losses + postSeasonStats.losses || 0;
    const myHighestScoringPlayer = allTimeRosterStats.topPlayerScores[0];
    const rivalryStats = getRivalryStats(rID, legacyLeague);
    // const foundPlayer = findPlayerByID(myHighestScoringPlayer?.starter, players);
    const mySeasonalPowerRank = getPowerRankings(selectSeason, legacyLeague)?.find(roster => roster.roster_id === rID)?.power_rank;
    const myAllTimePowerRank = getPowerRankings("All Time", legacyLeague)?.find(roster => roster.roster_id === rID)?.power_rank;

    const opponent = findRosterByRosterID(rivalryStats.records[0]?.opponentID, foundLeague.rosters);

    return (
        <div className="" style={{minWidth:"300px"}}>
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
                </> : <></>}
                <div className={`${showSeasonalAllPlay ? styles.performanceTitleRow : styles.performanceSubEndTitleRow} ${styles.fontHover}`}>
                    <p onClick={() => setShowSeasonalAllPlay(!showSeasonalAllPlay)} className="w-8/12 flex item-center">
                        <Icon icon={showSeasonalAllPlay ? "mingcute:down-fill" : "mingcute:up-fill"} style={{fontSize: "1.3em"}}/> All Play
                    </p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12">{allPlaySeasonStats.wins}-{allPlaySeasonStats.losses}</p>
                        <p className="w-5/12 flex items-center">{winPCT(allPlaySeasonStats.wins, allPlaySeasonStats.losses)}   
                            <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                        </p>
                        <p className="w-2/12 flex justify-end">{mySeasonalPowerRank}</p>
                    </div>
                </div>
                {showSeasonalAllPlay ? 
                allPlaySeasonStats.opponents.map((record, i) =>
                    <RivalryRecord key={i} record={record}/>
                ):<></>}
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
                        <p className="w-2/12 flex justify-end">{allTimePlayoffsRanking}</p>
                    </div>
                </div> : <></>}
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
                <div className={`${showAllTimeAllPlay ? styles.performanceTitleRow : styles.performanceSubEndTitleRow} ${styles.fontHover}`}>
                    <p onClick={() => setShowAllTimeAllPlay(!showAllTimeAllPlay)} className="w-8/12 flex item-center">
                        <Icon icon={showAllTimeAllPlay ? "mingcute:down-fill" : "mingcute:up-fill"} style={{fontSize: "1.3em"}}/> All Time All Play
                    </p>                    
                    <div className="w-4/12 flex items-center"> 
                        <p className="w-5/12">{allPlayAllTimeStats.wins}-{allPlayAllTimeStats.losses}</p>
                        <p className="w-5/12 flex items-center">{winPCT(allPlayAllTimeStats.wins, allPlayAllTimeStats.losses)}   
                            <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                        </p>
                        <p className="w-2/12 flex justify-end">{myAllTimePowerRank}</p>
                    </div>
                </div>
                {showAllTimeAllPlay ?
                    allPlayAllTimeStats.opponents.map((record, i) =>
                        <RivalryRecord key={i} record={record}/> 
                ) : <></>}
                <div className={styles.performanceTitleRow}>
                    <p className="w-8/12">{foundLeague.season} Lineup Efficiency</p>
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
                            {lineupEfficiency(allTimeBestStats?.fpts?.score!, allTimeBestStats?.ppts?.score!)}
                            <Icon icon="material-symbols:percent" style={{ color:"#a9dfd8", fontSize:"1em" }}/>
                        </p>
                        <p className="w-2/12 flex justify-end">{bestLineupEfficiencyRank}</p>
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
                        <p className="w-2/12 flex justify-end">{allTimeLineupEfficiencyRanking}</p>
                    </div>
                </div>
                <div className={styles.performanceTitleRow}>
                    <p className="w-8/12">{foundLeague.season} Luck Rate</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <div className="w-5/12 flex items-center">
                            <p>{roundToHundredth(winPCT(foundRoster.settings.wins, foundRoster.settings.losses)-winPCT(allPlaySeasonStats.wins, allPlaySeasonStats.losses))}</p>
                            <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                        </div>                                
                        <p className="w-2/12 flex justify-end">{luckRateRanking}</p>
                    </div>
                </div>
                <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">Best</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12 flex items-center">
                            {roundToHundredth(allTimeRosterStats.best.winRate - winPCT(allPlayBestSeasonStats.wins, allPlayBestSeasonStats.losses))}
                            <Icon icon="material-symbols:percent" style={{ color:"#a9dfd8", fontSize:"1em" }}/>
                        </p>
                        <p className="w-2/12 flex justify-end">{bestLuckRateRanking}</p>
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
                        <p className="w-2/12 flex justify-end">{allTimeLuckRateRankings}</p>
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
                <div className={styles.performanceTitleRow}>
                    <p className="w-8/12">{foundLeague.season} Total Points Per Game</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">{totalPointsPerGame(rID, seasonFPTS, legacyLeague, selectSeason)}</p>
                        <p className="w-2/12 flex justify-end">{totalPtsPerGameRanking}</p>
                    </div>
                </div>
                {postSeasonStats.appearance ?
                <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">{foundLeague.season} Playoffs</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">{roundToHundredth(postSeasonStats.fpts / postSeasonStats.totalGames)}</p>
                        <p className="w-2/12 flex justify-end">{totalPlayoffPtsPerGameRanking}</p>
                    </div>
                </div> : <></>}
                <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">Best</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12 flex items-center">{totalPointsPerGame(rID, allTimeBestStats?.fpts?.score!, legacyLeague, allTimeBestStats?.fpts?.season)}</p>
                        <p className="w-2/12 flex justify-end">{bestTotalPtsPerGameRanking}</p>
                    </div>
                </div>
                <div className={`${postSeasonStats.appearance ? styles.performanceSubTitleRow : styles.performanceSubEndTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">All Time</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">{totalPointsPerGame(rID, allTimeRosterStats.fpts, legacyLeague, undefined, true)}</p>
                        <p className="w-2/12 flex justify-end">{allTimeTotalPtsPerGameRanking}</p>
                    </div>
                </div>
                {postSeasonStats.appearance ?
                <div className={`${styles.performanceSubEndTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">All Time Playoffs</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">{roundToHundredth(allTimeRosterStats.playoffs.fpts / allTimeRosterStats.playoffs.totalGames)}</p>
                        <p className="w-2/12 flex justify-end">{allTimeTotalPlayoffPtsPerGameRanking}</p>
                    </div>
                </div> : <></>}
                <div className={styles.performanceTitleRow}>
                    <p className="w-8/12">{foundLeague.season} Highest Score</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">{findSeasonStats(rID, selectSeason, legacyLeague)?.bestScore}</p>
                        <p className="w-2/12 flex justify-end">{seasonalHighestScoreRankings}</p>
                    </div>
                </div>
                <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">{foundLeague.season} Playoffs</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">{postSeasonStats.highestScore}</p>
                        <p className="w-2/12 flex justify-end">{highestPostSeasonScoreRanking}</p>
                    </div>
                </div>
                <div className={`${styles.fontHover} ${showWeeklyHighScores ? styles.performanceTitleRow : styles.performanceSubTitleRow}`}>
                    <p className={`w-8/12 flex items-center`} onClick={() => setShowWeeklyHighScores(!showWeeklyHighScores)}>
                        <Icon icon={showWeeklyHighScores ? "mingcute:down-fill" : "mingcute:up-fill"} style={{fontSize: "1.3em"}}/>
                        <span>{showWeeklyHighScores ? "All Time Weekly High Scores": "All Time Weekly High Score"}</span>
                    </p>
                    <div className="w-4/12 flex items-center">
                        <div className="w-5/12">
                        {showWeeklyHighScores ?
                            <p className={`${styles.performanceHeader}`} style={{fontWeight: "normal"}}>Season</p>
                        : 
                            <p>Week {allTimeRosterStats.topTeamScore[0]?.week}, {allTimeRosterStats.topTeamScore[0]?.season}</p>
                        }</div>                        
                        <div className="w-5/12">
                        {showWeeklyHighScores ?
                            <p className={`${styles.performanceHeader}`} style={{fontWeight: "normal"}}>Points</p>
                        : 
                            <p>{allTimeRosterStats.best.score}</p>
                        }</div>
                        <div className="w-2/12 flex justify-end">
                        {showWeeklyHighScores ?
                            <p className={`${styles.performanceHeader}`} style={{fontWeight: "normal"}}>Ovr Rank</p>
                        : 
                            <p>{allTimeHighestScoreRanking}</p>
                        }</div>
                    </div>
                </div>
                {showWeeklyHighScores ?
                allTimeRosterStats.topTeamScore.slice(0, 10).map((record, i) => (
                    <HighScoreRecord key={i} record={record} type="team" index={i} max={10}/>
                )) : <></>}
                <div className={`${styles.fontHover} ${showPlayerHighScores ? styles.performanceTitleRow : styles.performanceSubEndTitleRow}`}>
                    <p className={`w-8/12 flex items-center`} onClick={() => setShowPlayerHighScores(!showPlayerHighScores)}>
                        <Icon icon={showPlayerHighScores ? "mingcute:down-fill" : "mingcute:up-fill"} style={{fontSize: "1.3em"}}/>
                        <span>{showPlayerHighScores ? "All Time Player High Scores": "All Time Player High Score"}</span>
                    </p>
                    <div className="w-4/12 flex items-center">
                        <div className="w-5/12">
                        {showPlayerHighScores ?
                            <p className={`${styles.performanceHeader}`} style={{fontWeight: "normal"}}>Season</p>
                        : 
                            <p>Week {myHighestScoringPlayer?.week}, {myHighestScoringPlayer?.season}</p>
                        }</div>
                        <div className="w-5/12">
                        {showPlayerHighScores ?
                            <p className={`${styles.performanceHeader}`} style={{fontWeight: "normal"}}>Points</p>
                        : 
                            <p>{myHighestScoringPlayer?.points}</p>
                        }</div>
                        <div className="w-2/12 flex justify-end">
                        {showPlayerHighScores ?
                            <p className={`${styles.performanceHeader}`} style={{fontWeight: "normal"}}>Ovr Rank</p>
                        : 
                            <p>{overallHighScoreRanking(myHighestScoringPlayer?.points!, allTimeLeagueStats?.playerHighScores!)?.rank}</p>
                        }</div>
                    </div>
                </div>
                {showPlayerHighScores ?
                    allTimeRosterStats.topPlayerScores.slice(0,10).map((record: Interfaces.HighScoreRecord, i) => 
                        <HighScoreRecord key={i} record={record} type="player" index={i} max={10}/>)
                :<></>}
                <div className={styles.performanceTitleRow}>
                    <p className="w-8/12">{foundLeague.season} PF</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">{foundRoster.settings.fpts}.{foundRoster.settings.fpts_decimal}</p>
                        <p className="w-2/12 flex justify-end">{seasonalPFRanking}</p>
                    </div>
                </div>
                <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">{foundLeague.season} Playoffs</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">{postSeasonStats.fpts}</p>
                        <p className="w-2/12 flex justify-end">{postSeasonPFRanking}</p>
                    </div>
                </div>
                <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                    <p className={`w-8/12 ${styles.bestRowHover}`}>Best <span>Season {myBest?.fpts?.season}</span></p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12 flex items-center">{myBestPF}</p>
                        <p className="w-2/12 flex justify-end">{bestPFRanking}</p>
                    </div>
                </div>
                <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">All Time</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">{allTimeRosterStats.fpts}</p>
                        <p className="w-2/12 flex justify-end">{allTimePFRanking}</p>
                    </div>
                </div>
                <div className={`${styles.performanceSubEndTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">All Time Playoffs</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">{allTimeRosterStats.playoffs.fpts}</p>
                        <p className="w-2/12 flex justify-end">{allTimePlayoffPFRanking}</p>
                    </div>
                </div>
                <div className={styles.performanceTitleRow}>
                    <p className="w-8/12">{foundLeague.season} MAX PF</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">{foundRoster.settings.ppts}.{foundRoster.settings.ppts_decimal}</p>
                        <p className="w-2/12 flex justify-end">{seasonalMAXPFRanking}</p>
                    </div>
                </div>
                <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">{foundLeague.season} Playoffs</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">-</p>
                        <p className="w-2/12 flex justify-end">-</p>
                    </div>
                </div>
                <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">Best <span>Season {myBest?.ppts?.season}</span></p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12 flex items-center">{myBest?.ppts?.score}</p>
                        <p className="w-2/12 flex justify-end">{bestMAXPFRanking}</p>
                    </div>
                </div>
                <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">All Time</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">{allTimeRosterStats.ppts}</p>
                        <p className="w-2/12 flex justify-end">{allTimeMAXPFRanking}</p>
                    </div>
                </div>
                <div className={`${styles.performanceSubEndTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">All Time Playoffs</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">-</p>
                        <p className="w-2/12 flex justify-end">-</p>
                    </div>
                </div>
                <div className={styles.performanceTitleRow}>
                    <p className="w-8/12">{foundLeague.season} PA</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">{foundRoster.settings.fpts_against}.{foundRoster.settings.fpts_against_decimal}</p>
                        <p className="w-2/12 flex justify-end">{seasonalPARanking}</p>
                    </div>
                </div>
                <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">{foundLeague.season} Playoffs</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">{postSeasonStats.pa || 0}</p>
                        <p className="w-2/12 flex justify-end">{postSeasonPARanking}</p>
                    </div>
                </div>
                <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">Best <span>Season {myBest?.pa?.season}</span></p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12 flex items-center">{myBest?.pa?.score}</p>
                        <p className="w-2/12 flex justify-end">{bestPARanking}</p>
                    </div>
                </div>
                <div className={`${styles.performanceSubTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">All Time</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">{allTimeRosterStats.pa}</p>
                        <p className="w-2/12 flex justify-end">{allTimePARanking}</p>
                    </div>
                </div>
                <div className={`${styles.performanceEndTitleRow} ${styles.fontHover}`}>
                    <p className="w-8/12">All Time Playoffs</p>
                    <div className="w-4/12 flex items-center">
                        <p className="w-5/12"></p>
                        <p className="w-5/12">{allTimeRosterStats.playoffs.pa}</p>
                        <p className="w-2/12 flex justify-end">{allTimePlayoffPARanking}</p>
                    </div>
                </div>
                <div className="py-5">
                    <div className={`${styles.performanceHeader}`}> 
                        <p className="w-10/12">General</p>
                        <p className="w-2/12 flex justify-end"></p>
                    </div>
                    <div className={`${styles.fontHover} ${showMostWinsAgainst ? styles.performanceTitleRow : styles.performanceSubEndTitleRow}`}>
                        <p className={`w-8/12 flex items-center`} onClick={() => setShowMostWinsAgainst(!showMostWinsAgainst)}>
                            <Icon icon={showMostWinsAgainst ? "mingcute:down-fill" : "mingcute:up-fill"} style={{fontSize: "1.3em"}}/>
                            <span>Most Wins Against</span>
                        </p>
                        {showMostWinsAgainst ?
                            <div className={`${styles.performanceHeader} w-4/12 flex items-center`}>
                                <p className="w-5/12">Record</p>
                                <p className="w-5/12">Win Rate</p>
                                <p className="w-2/12 flex justify-end">Games Played</p>
                            </div>  
                        : <p>{opponent.owner.display_name}</p>}
                    </div>
                    {showMostWinsAgainst ?
                        rivalryStats.records.map(((record, i) => 
                            <RivalryRecord key={i} record={record} type={"Rivalry"}/>
                    )) : <></>}
                    <div className={`${styles.performanceRow}`} style={{paddingBlock: "1em"}}>
                        <p>Longest Win Streak w/ Season </p>
                        <p style={{ color:"whitesmoke" }}></p>
                    </div>
                    <div className={`${styles.performanceRow}`} style={{paddingBlock: "1em"}}>
                        <p>Losing Streak w/ Season </p>
                        <p style={{ color:"whitesmoke" }}></p>
                    </div>
                    <div className={`${styles.performanceRow}`} style={{paddingBlock: "1em"}}>
                        <p>Toilet Bowl</p>
                        <p style={{ color:"whitesmoke" }}>{allTimeRosterStats.toiletBowls}</p>
                    </div>
                    <div className={styles.performanceRow} style={{paddingBlock: "1em"}}>
                        <p>Playoff Appearances</p>
                        <p style={{ color:"whitesmoke" }}>{allTimeRosterStats.playoffs.appearances}</p>
                    </div>
                    <div className={`${styles.performanceRow}`} style={{paddingBlock: "1em"}}>
                        <p>Playoff Streak Appearances </p>
                        <p style={{ color:"whitesmoke" }}></p>
                    </div>
                    <div className={styles.performanceRow} style={{paddingBlock: "1em"}}>
                        <p>Finals</p>
                        <p style={{ color:"whitesmoke" }}>{allTimeRosterStats.playoffs.finals}</p>
                    </div>
                </div>
                <Roster roster={foundRoster}/>
            </div>
        </div>
    );
};