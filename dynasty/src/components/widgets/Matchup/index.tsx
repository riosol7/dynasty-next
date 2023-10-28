import styles from "./Matchup.module.css";
import React from "react";
import * as Interfaces from "@/interfaces";
import { calculatePercentage, findLeagueBySeason, findPlayerByPts, findRecord, findRosterByRosterID, getMatchups, roundToHundredth } from "@/utils";
import { useLeagueContext, usePlayerContext, useSeasonContext } from "@/context";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";

export default function MatchupWidget({ matchup }: Interfaces.MatchupWidgetProps) {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason } = useSeasonContext();
    const { players } = usePlayerContext();
    const league: Interfaces.League = findLeagueBySeason(selectSeason, legacyLeague);
    const rosters = league?.rosters;
    const matchups = league?.matchups;
    const team1 = matchup && matchup[0];
    const team2 = matchup && matchup[1];

    const team1Score = team1?.points;
    const team2Score = team2?.points;
    const totalPtsScored = roundToHundredth(team1Score + team2Score);
    
    const roster1 = findRosterByRosterID(team1?.roster_id, rosters!);
    const roster2 = findRosterByRosterID(team2?.roster_id, rosters!);

    const roster1Matchups = getMatchups(matchups!, roster1.roster_id);
    const roster2Matchups = getMatchups(matchups!, roster2.roster_id);

    const foundWeekIndex = roster1Matchups.findIndex(
    (matchup) =>
        matchup[0].points === team1Score || matchup[1].points === team1Score
    );
    const sorted1StarterPts = team1?.starters_points?.sort((a,b) => b - a);
    const sorted2StarterPts = team2?.starters_points?.sort((a,b) => b - a);

    const team1TopStarterPts = sorted1StarterPts && sorted1StarterPts[0];
    const team2TopStarterPts = sorted2StarterPts && sorted2StarterPts[1];
    const topPlayer1Percentage = calculatePercentage(team1TopStarterPts, totalPtsScored);
    const topPlayer2Percentage = calculatePercentage(team2TopStarterPts, totalPtsScored);
    const team1Percentage = calculatePercentage(team1Score, totalPtsScored);
    const team2Percentage = calculatePercentage(team2Score, totalPtsScored);

    const topStarter1Details = findPlayerByPts(team1, team1TopStarterPts, players);
    const topStarter2Details = findPlayerByPts(team2, team2TopStarterPts, players);
    return (
        <div className={styles.matchupContainer}>
            <div>
                <div className="flex items-center justify-between">
                    <div className={styles.teamContainer}>
                        <div className="flex items-center">
                            <div className={styles.teamAvatar} style={{backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${roster1?.owner?.avatar})`}}></div>
                            <div className="ml-2 text-sm">
                                <p className="font-bold text-xl">{roster1.owner?.display_name}</p>
                                <p className="">                                                        
                                    <span className="font-bold text-[#34d367] mr-1">W</span>
                                    {findRecord(team1?.roster_id, roster1Matchups, foundWeekIndex).record}
                                </p> 
                                <p>{team1Score}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.teamContainer}`} style={{flexDirection: "row-reverse", textAlign: "end" }}>
                        <div className="flex items-center justify-end">
                            <div className="mr-2 text-sm">
                                <p className="font-bold text-xl">{roster2.owner?.display_name}</p>
                                <p>                                                        
                                    {findRecord(team2?.roster_id, roster2Matchups, foundWeekIndex).record}
                                    <span className="ml-1 text-[#cc1d00] font-bold">L</span>
                                </p>
                                <p>{team2Score}</p>
                            </div>
                            <div className={styles.teamAvatar} style={{backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${roster2?.owner?.avatar})`}}></div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between bg-gray-700 rounded-full h-1.5 my-1">
                    <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: `${team1Percentage}%` }}></div>
                    {/* <div className={`h-1.5 rounded-full`} style={{ width: `${topPlayer1Percentage}%`, backgroundColor: topStarter1Details?.team ? `${findLogo(topStarter1Details?.team).bgColor2}` : `rgba(165,172,175,1)` }}></div>
                    <div className={`h-1.5 rounded-full`} style={{ width: `${topPlayer2Percentage}%`, backgroundColor: topStarter2Details?.team ? `${findLogo(topStarter2Details?.team).bgColor2}` : `rgba(165,172,175,1)` }}></div> */}
                </div>
                <div className="flex items-center justify-between">
                    <div className={styles.teamContainer}>
                        
                    </div>

                    <div className={`${styles.teamContainer}`} style={{flexDirection: "row-reverse", textAlign: "end" }}>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};
