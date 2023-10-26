import styles from "./LeagueMatchups.module.css";
import { Icon } from "@iconify-icon/react";
import { useLeagueContext, usePlayerContext, useSeasonContext } from "@/context";
import { findLeagueBySeason, findLogo, findPlayerByPts, findRecord, findRosterByRosterID, getMatchups } from "@/utils";
import { useState } from "react";
import * as Interfaces from "@/interfaces";
import { PLAYER_BASE_URL, POSITION_COLORS, SLEEPER_AVATAR_BASE_URL } from "@/constants";

export default function LeagueMatchupSlider({ selectWeek }: {selectWeek: number}) {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason } = useSeasonContext();
    const { players } = usePlayerContext();
    const league: Interfaces.League = findLeagueBySeason(selectSeason, legacyLeague);
    const matchups = getMatchups(league.matchups);
    // Sort the selectedMatchups by the highest scoring games.
    const numWeeks = matchups.length;
    const weeks: string[] = Array.from({ length: numWeeks }, (_, index) => `Week ${index + 1}`);
    const selectedMatchups = matchups[selectWeek - 1];
    POSITION_COLORS

    return (
        <div className={`w-4/12 ${styles.matchupSlide}`}>
            {selectedMatchups?.map((matchup: Interfaces.Match[], i: number) => 
                <div key={i} className={`my-4`}>
                    <div className={`${styles.matchupCard}`}>
                        {matchup.map((team, idx) => {
                            const roster = findRosterByRosterID(team.roster_id, league.rosters);
                            const starterPts = team?.starters_points?.sort((a,b) => b - a);
                            const topStarter = findPlayerByPts(team, starterPts[0]!, players);
                            const flexDirection = idx === 0;
                            return (
                                <div key={idx} className={`${styles.teamCard} w-full`} style={{flexDirection: flexDirection ? "row" : "row-reverse", textAlign: flexDirection ? "start" : "end" }}>
                                    <div className={styles.playerBackground} style={(players.length > 0) ? {background:findLogo(topStarter.team || "FA").bgColor}:{}}>
                                        <div className={styles.teamLogo} style={{ backgroundImage:`url(${findLogo(topStarter.team).l})`, backgroundPosition: topStarter.position === "DEF" ? "center" : "top"}}>
                                            <div className={styles.player} style={{ backgroundImage: `url(${PLAYER_BASE_URL}${topStarter.player_id}.jpg)` }}></div>
                                        </div>
                                    </div>
                                    <div className={`${styles.teamInfo} w-full`}>
                                        {flexDirection ?
                                        <div className={`flex items-center justify-start`}>
                                            <div className={"ml-1 w-full flex items-center"}>
                                                <div className={styles.teamAvatar} style={{ backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar})`}}></div>
                                                <div className="ml-1">
                                                    <p className="">{roster.owner.display_name}</p>
                                                    <p className="text-xs">{findRecord(team.roster_id, selectedMatchups, selectWeek).record}</p> 
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className={`flex items-center justify-end`}>
                                            <div className={"mr-1 w-full flex items-center"} style={{flexDirection: flexDirection ? "row" : "row-reverse", textAlign: flexDirection ? "start" : "end" }}>
                                                <div className={styles.teamAvatar} style={{ backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar})`}}></div>
                                                <div className="mr-1">
                                                    <p className="">{roster.owner.display_name}</p>
                                                    <p className="text-xs">{findRecord(team.roster_id, selectedMatchups, selectWeek).record}</p>
                                                </div>
                                            </div>
                                        </div>
                                        }
                                        <div className={`${flexDirection ? "ml-1" : "mr-1"}`}>
                                            <Icon icon="fluent:star-line-horizontal-3-24-regular" style={{ color: "#a9dfd8", fontSize: "1.1rem", transform: flexDirection ? "scaleX(-1)" : "" }} />
                                            <p className="font-bold">{topStarter.first_name} {topStarter.last_name}</p>
                                            <div className="flex items-center" style={{flexDirection: flexDirection ? "row" : "row-reverse", textAlign: flexDirection ? "start" : "end" }}>
                                                <p style={{color: POSITION_COLORS[topStarter.position as keyof typeof POSITION_COLORS]}}>{topStarter.position}</p>
                                                <p  className={`${flexDirection ? "ml-1" : "mr-1"}`}>{starterPts[0]}pts</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <p>Bar that displays total amount of pts scored.</p>
                        <p>Bar is divided among the total players scored and total per team pts.</p>
                        <p>History</p>
                    </div>
                </div>
            )}
        </div>
    );
};
