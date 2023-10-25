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
        <div className={styles.matchupSlide}>
            {selectedMatchups.map((matchup: Interfaces.Match[], i: number) => 
                <div key={i} className={styles.matchupCard}>
                    {matchup.map((team, idx) => {
                        const roster = findRosterByRosterID(team.roster_id, league.rosters);
                        const starterPts = team?.starters_points?.sort((a,b) => b - a);
                        const topStarter = findPlayerByPts(team, starterPts[0]!, players);
                        return (
                            <div key={idx} className={styles.teamCard} style={{flexDirection: idx === 0 ? "row" : "row-reverse" }}>
                                <div className={styles.playerBackground} style={(players.length > 0) ? {background:findLogo(topStarter.team || "FA").bgColor}:{}}>
                                    <div className={styles.teamLogo} style={{ backgroundImage:`url(${findLogo(topStarter.team).l})`, backgroundPosition: topStarter.position === "DEF" ? "center" : "top"}}>
                                        <div className={styles.player} style={{ backgroundImage: `url(${PLAYER_BASE_URL}${topStarter.player_id}.jpg)` }}></div>
                                    </div>
                                </div>
                                <div className={styles.teamInfo}>
                                    <div className="flex items center">
                                        <div className={styles.teamAvatar} style={{ backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar})`}}></div>
                                        <div className="ml-2">
                                            <p className="font-bold">{roster.owner.display_name}</p>
                                            <p className="text-xs">{findRecord(team.roster_id, selectedMatchups, selectWeek).record}</p>
                                        </div>
                                    </div>
                                    <p>{team.points}</p>
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
