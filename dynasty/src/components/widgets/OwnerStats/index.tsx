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
    const [selectStats, setSelectStats] = useState("Season");
    const [allTime, setAllTime] = useState(false);
    const foundLeague = findLeagueBySeason(selectSeason, legacyLeague);
    const foundUser = findUserByName(name, foundLeague);
    const foundRoster = findRosterByOwnerID(foundUser.user_id, foundLeague); 
    const rID = foundRoster.roster_id;
    const allPlayStats = getAllPlayStats(rID, selectSeason, legacyLeague);
    const allTimeStats = getAllTimeStats(rID, legacyLeague);
    const postSeasonStats = getPostSeasonStats(rID, legacyLeague, selectSeason);
    const seasonFPTS = Number(foundRoster.settings.fpts + "." + foundRoster.settings.fpts_decimal);
    const allTimeTotalWins = allTimeStats.wins + allTimeStats.playoffs.wins;
    const allTimeTotalLosses = allTimeStats.losses + allTimeStats.playoffs.losses;

    const handleSelectStats = () => {
        if (selectStats === "Season") {
            setSelectStats("Post Season");
        } else {
            setSelectStats("Season")
        };
    };

    return (
        <div className="py-4" style={{minWidth:"300px"}}>
            <div className="flex items-center justify-between" style={{marginBottom:"8px"}}>
                <p className="font-bold" style={{color:"lightgrey"}}>STATS</p>
                <Icon className="mx-3" icon="mdi:bracket" onClick={() => handleSelectStats()} style={ selectStats === "Post Season" ? {fontSize:"1.4em", color:"#a9dfd8"} : {fontSize:"1.4em", color:"#cbcbcb"}}/>
            </div>
            <div className="mt-4">
                <div style={{fontSize:"14px"}}>
                    <div className="flex items-center justify-between pb-3" style={{ color:"#7d91a6", fontSize:"12.85px" }}> 
                        {selectStats === "Season" ? <p>Regular Season</p> : <p>Post Season</p>}
                        {selectStats === "Season" ? <p>Rate</p> : <></>}
                    </div>
                    <div>
                        <div>
                            <div className="flex items-center justify-between pb-3" style={selectStats === "Season" ? {borderBottom:"2px dashed #0f0f0f"} : {borderBottom:"2px solid #2a2c3e"}}>
                                <p className={selectStats === "Season" ? "m-0 bold" : "m-0"}>Record</p>
                                {selectStats === "Season" && allTime ?
                                    <div className="flex items-center">
                                        <p style={{ width:"70px" }}>{allTimeStats.wins}-{allTimeStats.losses}</p>
                                        <p className="flex items-center" style={{ width:"50px" }}>
                                            {winPCT(allTimeStats.wins, allTimeStats.losses)}
                                            <Icon icon="material-symbols:percent" style={{ color:"#a9dfd8", fontSize:"1em" }}/>
                                        </p>
                                    </div>
                                : selectStats === "Season" ?
                                    <div className="flex items-center">
                                        <p style={{ width:"70px" }}>{foundRoster.settings.wins}-{foundRoster.settings.losses}</p>
                                        <p className="flex items-center justify-end" style={{ width:"50px" }}>
                                            {winPCT(foundRoster.settings.wins, foundRoster.settings.losses)}
                                            <Icon icon="material-symbols:percent" style={{ color:"#a9dfd8", fontSize:"1em" }}/>
                                        </p>
                                    </div>
                                : selectStats === "Post Season" && allTime ?
                                    <p>{allTimeStats.playoffs.wins}-{allTimeStats.playoffs.losses}</p>
                                : selectStats === "Post Season" ?
                                    <p>{postSeasonStats.wins}-{postSeasonStats.losses}</p> 
                                :<></>
                                }
                            </div>
                            <div style={{ fontWeight:"lighter" }}>
                                <div className={`flex items-center justify-between ${styles.fontHover}`} style={{ borderBottom:"1px dashed #0f0f0f" }}>
                                    {(selectStats === "Season" && allTime && allTimeStats.playoffs.appearances > 0) || (selectStats === "Season" && postSeasonStats.appearance) ?
                                        <p className="py-3">w/ Playoffs</p>   
                                    :<></>
                                    }
                                    {selectStats === "Season" && allTime && allTimeStats.playoffs.appearances > 0 ? 
                                        <div className="flex items-center py-3">
                                            <p style={{ width:"70px" }}>{allTimeTotalWins}-{allTimeTotalLosses}</p>
                                            <p className="flex items-center" style={{ width:"50px" }}> 
                                                {winPCT(allTimeTotalWins, allTimeTotalLosses)}
                                                {winPCT(allTimeTotalWins, allTimeTotalLosses).toString().length === 2 ? ".00" : ""}
                                                <Icon icon="material-symbols:percent" style={{ color:"#a9dfd8", fontSize:"1em" }}/>
                                            </p>
                                        </div>
                                    : (selectStats === "Season" && postSeasonStats.appearance) ?
                                        <div className="flex items-center py-3">
                                            <p style={{width:"70px"}}>{foundRoster.settings.wins + postSeasonStats.wins}-{foundRoster.settings.losses + postSeasonStats.losses}</p>
                                            <p className="flex items-center justify-end" style={{ width:"50px" }}> 
                                                {winPCT(foundRoster.settings.wins + postSeasonStats.wins, foundRoster.settings.losses + postSeasonStats.losses)}
                                                {winPCT(foundRoster.settings.wins + postSeasonStats.wins, foundRoster.settings.losses + postSeasonStats.losses).toString().length === 2 ? ".00" : ""}
                                                <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                                            </p>
                                        </div>
                                    :<></>
                                    }
                                </div>
                                {allTime && selectStats !== "Post Season" ?
                                    <div className={`flex items-center justifybetween ${styles.fontHover}`} style={{ borderBottom: "1px dashed #0f0f0f" }}>
                                        <p className="py-3">Best</p>
                                        <div className="flex items-center">
                                            <p style={{ width:"70px" }}>{allTimeStats.best.record}</p>
                                            <p style={{ width:"50px" }} className="flex items-center">
                                                {allTimeStats.best.winRate}
                                                <Icon icon="material-symbols:percent" style={{ color:"#a9dfd8", fontSize:"1em" }}/>
                                            </p>
                                        </div>
                                    </div> : <></>
                                }
                                {selectStats !== "Post Season" ?
                                    <div className={`flex items-center justify-between ${styles.fontHover}`} style={{ borderBottom: "1px dashed #0f0f0f" }}>
                                        <p className="py-3">All Play</p>
                                        {selectStats === "Season" && allTime ?
                                            <div className="flex items-center">
                                                <p style={{ width:"70px" }}>{allPlayStats.wins}-{allPlayStats.losses}</p>
                                                <p className="flex items-center" style={{width:"50px"}}>{winPCT(allPlayStats.wins, allPlayStats.losses)}   
                                                    <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                                                </p>
                                            </div>
                                        : selectStats === "Season" ?
                                            <div className="flex items-center py-3">
                                                <p style={{width:"70px"}}>{allPlayStats.wins}-{allPlayStats.losses}</p>
                                                <p className="flex items-center justify-end" style={{ width:"50px" }}>{winPCT(allPlayStats.wins, allPlayStats.losses)}   
                                                    <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                                                </p>
                                            </div>
                                        : <p>-</p>
                                        }
                                    </div>
                                :<></>
                                }
                            </div>
                        </div>
                        {selectStats === "Post Season" ?
                            <div className="flex items-center justify-between py-3" style={allTime ? {borderBottom:"2px solid #2a2c3e"} : {}}>
                                <p>Win Rate</p> 
                                {allTime ?
                                    <p className="flex items-center justify-end" style={{ width:"50px" }}>
                                        {winPCT(allTimeStats.playoffs.wins, allTimeStats.playoffs.losses) || 0}
                                        <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                                    </p>
                                : selectStats === "Post Season" ?
                                    postSeasonStats.appearance ?
                                        <p className="flex items-center">
                                            {winPCT(postSeasonStats.wins, postSeasonStats.losses)}
                                            <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                                        </p> 
                                    : <p className="flex items-center">0<Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/></p>
                                : <p>-</p>
                                }
                            </div>
                        :<></>
                        }
                        {selectStats === "Season" ?
                            <>
                                <div className="flex items-center justify-between mt-3 pb-3" style={{ borderBottom:"2px solid #2a2c3e" }}>
                                    <p>Lineup Efficiency</p>
                                    <div>
                                        {selectStats === "Season" && allTime ?
                                            <div className="flex items-center">
                                                <p className="text-end">{lineupEfficiency(allTimeStats.fpts, allTimeStats.ppts)}</p>
                                                <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                                            </div>
                                        : selectStats === "Season" ?   
                                            <div className="flex items-center">
                                                <p>{lineupEfficiency(Number(foundRoster.settings.fpts + "." + foundRoster.settings.fpts_decimal), Number(foundRoster.settings.ppts + "." + foundRoster.settings.ppts_decimal))}</p>
                                                <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                                            </div>
                                        :<></>
                                        }
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3 pb-3">
                                    <p>Luck Rate</p>
                                    {selectStats === "Season" && allTime ?
                                        <div className="flex items-center">
                                            <p>{roundToHundredth(winPCT(allTimeStats.wins, allTimeStats.losses)-winPCT(allPlayStats.wins, allPlayStats.losses))}</p>
                                            <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                                        </div>
                                    : selectStats === "Season"?   
                                        <div className="flex items-center">
                                            <p>{roundToHundredth(winPCT(foundRoster.settings.wins, foundRoster.settings.losses)-winPCT(allPlayStats.wins, allPlayStats.losses))}</p>
                                            <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                                        </div>
                                    : selectStats === "Post Season" && allTime ?
                                        <div className="flex items-center">
                                            <p style={{width:"12px"}}>-</p>
                                        </div>
                                    :<></>
                                    }
                                </div>
                            </>
                        :<></>
                        }
                        {selectStats === "Post Season" && allTime ?
                            <>
                                <div className="flex items-center justify-between mt-3 pb-3" style={{ borderBottom:"2px solid #2a2c3e" }}>
                                    <p>Toilet Bowl</p>
                                    <p style={{ color:"whitesmoke" }}>{allTimeStats.toiletBowls}</p>
                                </div>
                                <div className="flex items-center justify-between mt-3 pb-3" style={{ borderBottom:"2px solid #2a2c3e" }}>
                                    <p>Playoff Appearances</p>
                                    <p style={{ color:"whitesmoke" }}>{allTimeStats.playoffs.appearances}</p>
                                </div>
                                <div className="flex items-center justify-between mt-3 pb-3">
                                    <p >Finals</p>
                                    <p style={{ color:"whitesmoke" }}>{allTimeStats.playoffs.finals}</p>
                                </div>
                            </>
                        :<></>        
                        }
                        <div className="mt-4 mb-3 flex items-center justify-between" style={{ color:"#7d91a6", fontSize:"12.85px" }}>
                            <p>Scoring</p>
                            <div>
                                <p>Points</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pb-3" style={{ borderBottom:"2px solid #2a2c3e" }}>
                            <p>Total Points Per Game</p>
                            <div>
                                {selectStats === "Season" && allTime ?
                                    <p>{totalPtsPerGame(rID, allTimeStats.fpts, legacyLeague, undefined, true)}</p>
                                : selectStats === "Season" ?
                                    <p>{totalPtsPerGame(rID, seasonFPTS, legacyLeague, selectSeason)}</p>
                                : selectStats === "Post Season" && allTime && allTimeStats.playoffs.totalGames > 0 ? 
                                    <p>{roundToHundredth(allTimeStats.playoffs.fpts / allTimeStats.playoffs.totalGames)}</p>
                                : selectStats === "Post Season" && postSeasonStats.appearance ?
                                    <p>{roundToHundredth(postSeasonStats.fpts / postSeasonStats.totalGames)}</p> 
                                :<></>
                                }
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pb-3" style={{ borderBottom:"2px solid #2a2c3e" }}>
                            <p>Highest Score</p>
                            {selectStats === "Season" && allTime ?
                                <p>{allTimeStats.best.score}</p>
                            : selectStats === "Season" ?
                                <p>{findSeasonStats(rID, selectSeason, legacyLeague)?.bestScore}</p>
                            : selectStats === "Post Season" && allTime ?
                                <p>{allTimeStats.playoffs.highestScore}</p>
                            : selectStats === "Post Season" ?
                                <p>{postSeasonStats.highestScore}</p>
                            :<></>
                            }  
                        </div>
                        <div className="flex items-center justify-between mt-3 pb-3" style={{ borderBottom:"2px solid #2a2c3e" }}>
                            <p>PF</p>
                            <div>
                                {selectStats === "Season" && allTime ? 
                                    <p>{allTimeStats.fpts}</p>
                                : selectStats === "Season" ?
                                    <p>{foundRoster.settings.fpts}.{foundRoster.settings.fpts_decimal}</p>
                                : selectStats === "Post Season" && allTime ?
                                    <p>{allTimeStats.playoffs.fpts}</p>
                                : selectStats === "Post Season" ?
                                    <p>{postSeasonStats.fpts}</p>
                                :<></>
                                }
                            </div>
                        </div>
                        {selectStats === "Season" ?
                            <div className="flex items-center justify-between mt-3 pb-3" style={{ borderBottom:"2px solid #2a2c3e" }}>
                                <p>MAX PF</p>
                                { selectStats === "Season" && allTime ? 
                                    <p>{allTimeStats.ppts}</p>
                                : selectStats === "Season" ?
                                    <p>{foundRoster.settings.ppts}.{foundRoster.settings.ppts_decimal}</p>  
                                :<></>
                                }
                            </div>
                        :<></>
                        }
                        <div className="flex items-center justify-between mt-3 pb-3">
                            <p>PA</p>
                            {selectStats === "Season" && allTime ? 
                                <p>{allTimeStats.pa}</p>
                            : selectStats === "Season" ?
                                <p>{foundRoster.settings.fpts_against}.{foundRoster.settings.fpts_against_decimal}</p>   
                            : selectStats === "Post Season" && allTime ?
                                <p>{allTimeStats.playoffs.pa}</p>
                            : selectStats === "Post Season" ?
                                <p>{postSeasonStats.pa || 0}</p>
                            :<></>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};