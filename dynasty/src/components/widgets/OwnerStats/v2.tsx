import styles from "./OwnerStats.module.css";
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
            <div className="flex items-center justify-between py-3" style={{marginBottom:"8px"}}>
                <p className="font-bold" style={{color:"lightgrey"}}>PERFORMANCE INSIGHTS</p>
            </div>
            <div className="flex items-center justify-between pt-3" style={{ color:"#7d91a6", fontSize:"12.85px" }}> 
                <p>General</p>
            </div>
            <div style={{fontSize:"14px"}}> 
                <div className="flex items-center justify-between py-3" style={{ borderBottom:"2px solid #2a2c3e" }}>
                    <p>Toilet Bowl</p>
                    <p style={{ color:"whitesmoke" }}>{allTimeStats.toiletBowls}</p>
                </div>
                <div className="flex items-center justify-between py-3" style={{ borderBottom:"2px solid #2a2c3e" }}>
                    <p>Playoff Appearances</p>
                    <p style={{ color:"whitesmoke" }}>{allTimeStats.playoffs.appearances}</p>
                </div>
                <div className="flex items-center justify-between py-3" style={{ borderBottom:"2px solid #2a2c3e" }}>
                    <p>Finals</p>
                    <p style={{ color:"whitesmoke" }}>{allTimeStats.playoffs.finals}</p>
                </div>
            </div>
            <div className="mt-5">
                <div style={{fontSize:"14px"}}>

                    <div className="flex">
                        <div className="w-8/12">
                            <p style={{ color:"#7d91a6", fontSize:"12.85px" }}>{foundLeague.season} Season</p>
                        
                        
                        </div>

                        <div className="w-4/12 flex items-center justify-between">
                            <div className="w-5/12">
                                <p style={{ color:"#7d91a6", fontSize:"12.85px" }}>Record</p>
                            </div>
                            <div className="w-5/12">
                                <p style={{ color:"#7d91a6", fontSize:"12.85px" }}>Rate</p>
                            </div>
                            <div className="w-2/12 w-2/12 flex justify-end">
                                <p style={{ color:"#7d91a6", fontSize:"12.85px" }}>Rank</p>
                            </div>
                        </div>

                    </div>

                    <div className="flex items-center justify-between" style={{ color:"#7d91a6", fontSize:"12.85px" }}> 
                        <p className="w-8/12">{foundLeague.season} Season</p>
                        <div className="w-4/12 flex items-center justify-between">
                            <p className="w-5/12">Record</p>
                            <p className="w-5/12">Rate</p>
                            <p className="w-2/12 flex justify-end">Rank</p>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between py-3" style={{borderBottom:"2px dashed #0f0f0f"}}>
                            <p className="font-bold w-8/12">Record</p>
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
                        <div style={{ fontWeight:"lighter" }}>
                            {postSeasonStats.appearance ?
                            <>
                                <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom:"1px dashed #0f0f0f" }}>
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
                                <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom:"1px dashed #0f0f0f" }}>
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
                            <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom:"2px solid #2a2c3e" }}>
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
                        </div>
                        <div className="flex items-center justify-between py-3"  style={{ borderBottom:"2px dashed #0f0f0f" }}>
                            <p className="font-bold w-8/12">All Time Record</p>
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
                            <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom:"1px dashed #0f0f0f" }}>
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
                            <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom: "1px dashed #0f0f0f" }}>
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
                            <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom:"2px solid #2a2c3e" }}>
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
                        <div className={`flex items-center justify-between py-3`} style={{ borderBottom:"2px dashed #0f0f0f" }}>
                            <p className="w-10/12 font-bold">Lineup Efficiency</p>
                            <div className="w-3/12 flex items-center">
                                <p className="w-10/12 flex items-center">{lineupEfficiency(Number(foundRoster.settings.fpts + "." + foundRoster.settings.fpts_decimal), Number(foundRoster.settings.ppts + "." + foundRoster.settings.ppts_decimal))}
                                <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                                </p>
                                <p className="w-2/12 flex justify-end">1st</p>
                            </div>
                        </div>
                        <div className={`flex items-center justify-between py-3 ${styles.fontHover}`}  style={{ borderBottom:"2px solid #2a2c3e" }}>
                            <p>All Time</p>
                            <div className="flex items-center">
                                <p className="text-end">{lineupEfficiency(allTimeStats.fpts, allTimeStats.ppts)}</p>
                                <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-3" style={{ borderBottom:"2px solid #2a2c3e" }}>
                            <p>Luck Rate</p>
                            <div className="flex items-center">
                                <p>{roundToHundredth(winPCT(foundRoster.settings.wins, foundRoster.settings.losses)-winPCT(allPlaySeasonStats.wins, allPlaySeasonStats.losses))}</p>
                                <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                            </div>
                        </div>
                        <div className="mt-4 mb-3 flex items-center justify-between" style={{ color:"#7d91a6", fontSize:"12.85px" }}>
                            <p>Scoring</p>
                            <p>Points</p>
                        </div>
                        <div >
                            <div className="flex items-center justify-between pb-3" style={{ borderBottom:"2px dashed #0f0f0f" }}>
                                <p className="font-bold">Total Points Per Game</p>
                                <p>{totalPtsPerGame(rID, seasonFPTS, legacyLeague, selectSeason)}</p> 
                            </div>
                            <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom: "1px dashed #0f0f0f" }}>
                                <p>All Time</p>
                                <p>{totalPtsPerGame(rID, allTimeStats.fpts, legacyLeague, undefined, true)}</p>
                            </div>
                            {postSeasonStats.appearance ?
                                <>
                                    <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom: "1px dashed #0f0f0f" }}>
                                        <p>Playoffs</p>
                                        <p>{roundToHundredth(postSeasonStats.fpts / postSeasonStats.totalGames)}</p> 
                                    </div>
                                    <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom:"2px solid #2a2c3e" }}>
                                        <p>All Time w/ Playoffs</p>
                                        <p>{roundToHundredth(allTimeStats.playoffs.fpts / allTimeStats.playoffs.totalGames)}</p>
                                    </div>
                                </>
                            :<></>}

                        </div>
                        <div className="flex items-center justify-between py-3" style={{ borderBottom:"2px dashed #0f0f0f" }}>
                            <p className="font-bold">Highest Score</p>
                            <p>{findSeasonStats(rID, selectSeason, legacyLeague)?.bestScore}</p>
                        </div>
                        <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom: "1px dashed #0f0f0f" }}>
                            <p>All Time</p>
                            <p>{allTimeStats.best.score}</p>
                        </div>
                        <div className={`flex items-center justify-between py-3 ${styles.fontHover}`}  style={{ borderBottom: "1px dashed #0f0f0f" }}>
                            <p>Playoffs</p>
                            <p>{postSeasonStats.highestScore}</p>
                        </div>
                        <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom:"2px solid #2a2c3e" }}>
                            <p>All Time w/ Playoffs</p>
                            <p>{allTimeStats.playoffs.highestScore}</p>
                        </div>
                        <div className="flex items-center justify-between py-3" style={{ borderBottom:"2px dashed #0f0f0f" }}>
                            <p className="font-bold">PF</p>
                            <p>{foundRoster.settings.fpts}.{foundRoster.settings.fpts_decimal}</p>
                        </div>
                        <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom: "1px dashed #0f0f0f" }}>
                            <p>All Time</p>
                            <p>{allTimeStats.fpts}</p>
                        </div>
                        <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom: "1px dashed #0f0f0f" }}>
                            <p>Playoffs</p>
                            <p>{postSeasonStats.fpts}</p>
                        </div>
                        <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom:"2px solid #2a2c3e" }}>
                            <p>All Time w/ Playoffs</p>
                            <p>{allTimeStats.playoffs.fpts}</p>
                        </div>

                        <div className="flex items-center justify-between py-3" style={{ borderBottom:"2px dashed #0f0f0f" }}>
                            <p className="font-bold">MAX PF</p>
                            <p>{foundRoster.settings.ppts}.{foundRoster.settings.ppts_decimal}</p>  
                        </div>
                        <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom: "1px dashed #0f0f0f" }}>
                            <p>All Time</p> 
                            <p>{allTimeStats.ppts}</p>
                        </div>
                        <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom: "1px dashed #0f0f0f" }}>
                            <p>Playoffs</p>
                            <p>{0}</p>
                        </div>
                        <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom:"2px solid #2a2c3e" }}>
                            <p>All Time w/ Playoffs</p>
                            <p>{0}</p>
                        </div>
                        
                        <div className="flex items-center justify-between py-3" style={{ borderBottom:"2px dashed #0f0f0f" }}>
                            <p className="font-bold">PA</p>
                            <p>{foundRoster.settings.fpts_against}.{foundRoster.settings.fpts_against_decimal}</p>   
                        </div>
                        <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom: "1px dashed #0f0f0f" }}>
                            <p>All Time</p>
                            <p>{allTimeStats.pa}</p>
                        </div>
                        <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom: "1px dashed #0f0f0f" }}>
                            <p>Playoffs</p>
                            <p>{postSeasonStats.pa || 0}</p>
                        </div>
                        <div className={`flex items-center justify-between py-3 ${styles.fontHover}`} style={{ borderBottom:"2px solid #2a2c3e" }}>
                            <p>All Time w/ Playoffs</p>
                            <p>{allTimeStats.playoffs.pa}</p>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};