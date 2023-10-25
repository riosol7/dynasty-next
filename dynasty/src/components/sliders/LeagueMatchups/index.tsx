import styles from "./LeagueMatchups.module.css";
import { useLeagueContext, usePlayerContext, useSeasonContext } from "@/context";
import { findLeagueBySeason, findLogo, findPlayerByPts, findRecord, findRosterByRosterID, getMatchups } from "@/utils";
import { useState } from "react";
import * as Interfaces from "@/interfaces";
import { PLAYER_BASE_URL, SLEEPER_AVATAR_BASE_URL } from "@/constants";

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


    return (
        <div className={`w-5/12 ${styles.matchupSlide}`}>
            {selectedMatchups?.map((matchup: Interfaces.Match[], i: number) => 
                <div key={i} className={`my-4 ${styles.matchupCard}`}>
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
                                        <div className={styles.teamAvatar} style={{ backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar})`}}></div>
                                        <div className={"ml-2 w-full"}>
                                            <p className="font-bold">{roster.owner.display_name}</p>
                                            <div className="text-xs flex items-center justify-between">
                                                <p>{findRecord(team.roster_id, selectedMatchups, selectWeek).record}</p> 
                                                <p>{team.points}</p>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className={`flex items-center justify-end`}>
                                        <div className={"mr-2 w-full"}>
                                            <p className="font-bold">{roster.owner.display_name}</p>
                                            <div className="text-xs flex items-center justify-between">
                                                <p>{team.points}</p>
                                                <p>{findRecord(team.roster_id, selectedMatchups, selectWeek).record}</p> 
                                            </div>
                                        </div>
                                        <div className={styles.teamAvatar} style={{ backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar})`}}></div>
                                    </div>
                                    }
                                    <p>{topStarter.first_name} {topStarter.last_name}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
