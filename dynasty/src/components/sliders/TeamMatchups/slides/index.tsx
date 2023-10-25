import styles from "../TeamMatchups.module.css";
import React from "react";
import Image from "next/image";
import { Icon } from "@iconify-icon/react";
import { 
    findLogo,
    findUserByRosterID,
    findLeagueBySeason, 
    findUserByName,
    findPlayerByPts,
    findRecord,
    findRosterByOwnerID, 
    getRosterPostSeasonStats,
    getMatchups,
    roundToHundredth, 
    getAllPlayStats } from "@/utils";
import * as Interfaces from "@/interfaces";
import { PLAYER_BASE_URL, SLEEPER_AVATAR_BASE_URL } from "@/constants";
import { useLeagueContext, usePlayerContext, useSeasonContext } from "@/context";

export default function TeamMatchupSlide({ idx, name, matchup }: Interfaces.TeamMatchupSlideProps) {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason } = useSeasonContext();
    const { players } = usePlayerContext();
    const is18GameSeason = Number(selectSeason) > 2020;
    const foundLeague = findLeagueBySeason(selectSeason, legacyLeague);
    const foundUser = findUserByName(name, foundLeague);
    const roster = findRosterByOwnerID(foundUser.user_id, foundLeague); 
    const rID = roster.roster_id;
    const matchups = getMatchups(foundLeague.matchups, rID);
    const postSeasonStats = getRosterPostSeasonStats(rID, legacyLeague, selectSeason);
    const allPlayStats = getAllPlayStats(rID, selectSeason, legacyLeague);
    const playoffLabel = postSeasonStats.appearance ? "Playoffs" : "Toilet Bowl";
    const weekLabel = is18GameSeason ? "Wk. 1 - 14" : "Wk. 1 - 13";
    const playoffWeekLabel = is18GameSeason ? "Wk. 15 - 17" : "Wk. 14 - 16";
    const opponent = matchup.find(team => team.roster_id !== rID)!;
    const myMatchStats = matchup.find(team => team.roster_id === rID)!; 
    const starterPts = myMatchStats?.starters_points?.sort((a,b) => b - a);
    const topStarter = findPlayerByPts(myMatchStats, starterPts[0]!, players);
    const foundAllPlayRecord = allPlayStats?.weeklyRecord?.[idx]!;

    const getTitle = () => {
        if (idx === 0) {
            return `Regular Season (${weekLabel})`;
        } else if ((idx === 14 && is18GameSeason) || (idx === 13 && !is18GameSeason)) {
            return `${playoffLabel} (${playoffWeekLabel})`;
        }
        return "";
    };

    const title = getTitle();
    const finals = matchup.find(t => t.roster_id === rID)?.matchup_id === 1 ? true : false;
    const semiFinals = matchup.find(t => t.roster_id === rID)?.matchup_id === 1 || matchup.find(t => t.roster_id === rID)?.matchup_id === 2 ? true : false;
    const seventhPlace = matchup.find(t => t.roster_id === rID)?.matchup_id === 6 ? true : false;
    const toiletBowl = matchup.find(t => t.roster_id === rID)?.matchup_id === 4 ? true : false;
    const exceptionCurrentOwnerAllPlayTotalRosters = foundLeague.rosters.length - 1;

    return (
        <div className="py-4"  style={{fontSize:"12px",width:"200px"}}>
            <div style={{position:"absolute", zIndex:"5", top:"-2px", width:"205px", color:"#e9f0f2"}}>
                {title && (
                    <div className="">
                        <p className={styles.weekTitle}>{title}</p>
                        {/* <div className={styles.underlineTitle}></div> */}
                    </div>
                )}
            </div>
            <div className="" style={{borderRadius:"2px 2px 0xp 0px",border:"none", background:"#0f0f0f"}}>
                {matchup.find(team => team.roster_id === rID)?.matchup_id === null ? // Weeks w/ no matchup
                    <div className="p-2">
                        <div className="mb-2 flex items-top font-bold" style={{ fontSize:"11.5px" }}>
                            {(is18GameSeason && idx === 14 && playoffLabel === "Playoffs") || (!is18GameSeason && idx === 13 && playoffLabel === "Playoffs") ?
                                <p>Divisional</p>
                            : (is18GameSeason && idx === 14 && playoffLabel === "Toilet Bowl") || (!is18GameSeason && idx === 13 && playoffLabel === "Toilet Bowl") ?
                                <p>Bottom 6</p>
                            : is18GameSeason && idx === 16 ?
                                <p>Week 17</p>
                            : !is18GameSeason && idx === 15 ?
                                <p>Week 16</p>
                            :<></>
                            }
                        </div>
                        <div>
                            <div className="flex items-center justify-start mb-2">
                                <div className="flex items-center mx-2">
                                    <Image className={styles.ownerLogo} alt="avatar" width={24} height={24} src={`${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar}`}/>
                                </div>
                                <div style={{color:"#c9cfd1"}}> 
                                    {(is18GameSeason && idx === 14) || (!is18GameSeason && idx === 13) ?
                                        <p>BYE Week</p> :
                                        <p>Season Over</p>    
                                    }
                                </div>
                            </div>
                            {(playoffLabel === "Playoffs" && is18GameSeason && idx === 14) || (playoffLabel === "Playoffs" && !is18GameSeason && idx === 13) ?
                                <p>Clinched Division {roster.settings.division} and Bye</p>            
                            :  
                                <div className="flex justify-between items-center">
                                    <p>{roster.settings?.rank}
                                        {roster.settings?.rank === 1 ?
                                            <span>st </span>
                                        : roster.settings?.rank === 2 ?
                                            <span>nd </span>
                                        : roster.settings?.rank === 3 ?
                                            <span>rd </span>
                                        : <span>th </span>
                                        }overall
                                    </p>                                                    
                                    <p>{roster.settings?.wins}-{roster.settings?.losses}</p>
                                </div>
                            }
                        </div>
                    </div>
                : // Matchup
                    <div>
                        <div className="p-2 flex justify-between items-top">
                            <div className="font-bold" style={{fontSize:"11.5px"}}>
                                {(is18GameSeason && idx < 14) || (!is18GameSeason && idx < 13) ?
                                    <p>Week {idx + 1}</p>
                                : (is18GameSeason && idx === 14 && playoffLabel === "Playoffs") || (!is18GameSeason && idx === 13 && playoffLabel === "Playoffs") ?
                                    <p>Divisional</p>
                                : (is18GameSeason && idx === 14 && playoffLabel === "Toilet Bowl") || (!is18GameSeason && idx === 13 && playoffLabel === "Toilet Bowl") ?
                                    <p>Bottom 6</p>
                                : (is18GameSeason && idx === 15 && playoffLabel === "Playoffs" && semiFinals) || (!is18GameSeason && idx === 14 && playoffLabel === "Playoffs" && semiFinals) ?
                                    <p>Semi Finals</p>
                                : (is18GameSeason && idx === 15 && playoffLabel === "Playoffs" && !semiFinals) || (!is18GameSeason && idx === 14 && playoffLabel === "Playoffs" && !semiFinals) ?
                                    <p>5th Place Match</p>
                                : (is18GameSeason && idx === 15 && playoffLabel === "Toilet Bowl" && seventhPlace) || (!is18GameSeason && idx === 14 && playoffLabel === "Toilet Bowl" && seventhPlace) ?
                                    <p>7th Place Match</p>
                                : (is18GameSeason && idx === 15 && playoffLabel === "Toilet Bowl" && !seventhPlace) || (!is18GameSeason && idx === 14 && playoffLabel === "Toilet Bowl" && !seventhPlace) ?
                                    <p>Bottom 4</p>
                                : (is18GameSeason && idx === 16 && playoffLabel === "Playoffs" && finals) || (!is18GameSeason && idx === 15 && playoffLabel === "Playoffs" && finals) ?
                                    <p>Finals</p>
                                : (is18GameSeason && idx === 16 && playoffLabel === "Playoffs" && !finals) || (!is18GameSeason && idx === 15 && playoffLabel === "Playoffs" && !finals) ?
                                    <p>3rd Place Match</p>
                                : (is18GameSeason && idx === 16 && playoffLabel === "Toilet Bowl" && toiletBowl) || (!is18GameSeason && idx === 15 && playoffLabel === "Toilet Bowl" && toiletBowl) ?
                                    <p>Finals</p>
                                : (is18GameSeason && idx === 16 && playoffLabel === "Toilet Bowl" && !toiletBowl) || (!is18GameSeason && idx === 15 && playoffLabel === "Toilet Bowl" && !toiletBowl) ?
                                    <p>9th Place Match</p>
                                :<></>
                                }
                            </div>
                            {/* <Icon icon="ic:outline-more-vert" onMouseOver={MouseOver} onMouseOut={MouseOut} 
                                onClick={() => openModal("Matchup", m.filter(t => t.roster_id !== Number(id))[0].roster_id, m)}style={{color:"#7f7f7f", fontSize:"1.4em"}}
                            /> */}
                        </div>
                        <div className="flex items-center mb-2 px-2">
                            <p style={{color:"#c9cfd1"}}>vs</p>
                            <Image className={`mx-2 ${styles.ownerLogo}`} alt="avatar" width={25} height={25} src={`${SLEEPER_AVATAR_BASE_URL}${
                                findUserByRosterID(opponent.roster_id, foundLeague).avatar}`}/>
                            <p className="text-truncate" style={{maxWidth:"140px"}}>
                            {findUserByRosterID(opponent.roster_id, foundLeague)?.metadata.team_name ?
                                findUserByRosterID(opponent.roster_id, foundLeague)?.metadata.team_name
                            : findUserByRosterID(opponent.roster_id, foundLeague)?.display_name ?
                            findUserByRosterID(opponent.roster_id, foundLeague)?.display_name
                            : null
                            }</p>
                        </div>
                        <div className="flex items-center justify-between px-2 pt-1">
                            <div className="flex items-center justify-start">
                                {matchup[0].points === 0 && matchup[1].points === 0 ?
                                    <div>
                                        <p><span style={{color:"lightgray", fontWeight:"bold", paddingRight:"6px",}}>TBD</span>0<span className="mx-1" style={{color:"#698b87"}}>-</span>0</p>
                                    </div>
                                : matchup.map((team, index) => 
                                    <div key={index} className="flex">
                                        {index === 0 ?
                                            index === 0 && team.roster_id === rID ?
                                                <p className="font-bold" style={{paddingRight:"6px", color:"#34d367"}}>W</p>
                                            :
                                                <p className="font-bold" style={{paddingRight:"6px", color:"#cc1d00"}}>L</p>
                                        :<></>
                                        }
                                        <div className="flex items-center">
                                            { index === 1 ? <span className="mx-1" style={{color:"#698b87"}}> - </span> : <></> }
                                            <p>{team.points}</p>
                                        </div>
                                    </div>
                                )} 
                            </div>
                            <p>{findRecord(rID, matchups!, idx).wins}<span style={{color:"whitesmoke"}}>-</span>{findRecord(rID, matchups!, idx).losses}</p>
                        </div>
                        <div className="pt-2">
                            {matchup[0].points === 0 && matchup[1].points === 0 ? <></> :
                                <div style={(players.length > 0) ? {background:findLogo(topStarter.team || "FA").bgColor}:{}}>
                                    <div className="flex items-center" style={{borderRadius:"0px 0px 2px 2px"}}>
                                        <div style={topStarter.position === "DEF" ?
                                            {
                                                width:"65px", height:"50px", 
                                                backgroundPosition:"center",
                                                backgroundRepeat:"no-repeat",
                                                backgroundSize:"40px",
                                                backgroundImage:`url(${findLogo(topStarter.team).l})`
                                            }
                                        :
                                            {
                                                width:"65px", height:"50px", 
                                                backgroundPosition:"left top",
                                                backgroundRepeat:"no-repeat",
                                                backgroundSize:"40px",
                                                backgroundImage:`url(${findLogo(topStarter.team).l})`
                                            }
                                        }>
                                            {topStarter.position === "DEF" ? <></>
                                            :   <Image src={`${PLAYER_BASE_URL}${topStarter.player_id}.jpg`} alt="player" height={62} width={62} 
                                                style={{ objectFit:"cover", width: "100%", height: "100%"}}/>
                                            }
                                        </div>
                                        <div className="mx-1">
                                            <p className="font-bold text-truncate">
                                                {topStarter.first_name} {topStarter.last_name} 
                                            </p>
                                            <p style={{fontSize:"11.5px"}}>scored {starterPts[0]}pts</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="pt-2" style={{ background:"black" }}>
                            {matchup[0].points === 0 && matchup[1].points === 0 ? <></>
                            : (is18GameSeason && idx < 14) || (!is18GameSeason && idx < 13) ?
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            <Icon icon="material-symbols:arrow-drop-up-rounded" style={{color:"#42f3e9", fontSize:"2.5em"}}/>
                                            <p>{foundAllPlayRecord?.wins}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <Icon icon="material-symbols:arrow-drop-down-rounded" style={{color:"#f85012", fontSize:"2.5em"}}/>
                                            <p>{foundAllPlayRecord?.losses}</p>
                                        </div>
                                    </div>
                                    <div>
                                        {matchup.map((team, index) => 
                                            <div key={index} className="flex items-center">
                                                { index === 0 ?
                                                    index === 0 && team.roster_id === rID ?
                                                        roundToHundredth(100-(foundAllPlayRecord?.wins!/exceptionCurrentOwnerAllPlayTotalRosters)*100) !== 0 ?
                                                            <div className="flex items-center">
                                                                <p className="px-1">{roundToHundredth(100-(foundAllPlayRecord?.wins!/exceptionCurrentOwnerAllPlayTotalRosters)*100)}</p>
                                                                <Icon icon="emojione-monotone:four-leaf-clover" style={{ fontSize:"14px", color:"#289a5d" }}/>
                                                            </div>
                                                        : <Icon icon="fluent-emoji-flat:crown" style={{ fontSize:"16px" }}/>
                                                    :
                                                        foundAllPlayRecord?.losses === exceptionCurrentOwnerAllPlayTotalRosters ?
                                                            <Icon icon="emojione-v1:pile-of-poo" style={{ fontSize:"16px", color:"#724b21" }}/>
                                                        :
                                                            <div className="flex items-center">
                                                                <p className="px-1">{roundToHundredth(0-(foundAllPlayRecord?.wins!/exceptionCurrentOwnerAllPlayTotalRosters)*100)}</p>
                                                                <Icon icon="emojione-monotone:four-leaf-clover" style={{ fontSize:"14px", color:"#dab0af" }}/>
                                                            </div>
                                                : <></>
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                            :<></>
                            }
                        </div>
                    </div>
                } 
            </div>
        </div>
    );
};