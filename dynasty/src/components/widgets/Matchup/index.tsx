import styles from "./Matchup.module.css";
import React from "react";
import * as Interfaces from "@/interfaces";
import { calculatePercentage, findLeagueBySeason, findLogo, findPlayerByID, findPlayerByPts, findRecord, findRosterByRosterID, getMatchups, roundToHundredth } from "@/utils";
import { useLeagueContext, usePlayerContext, useSeasonContext } from "@/context";
import { PLAYER_BASE_URL, POSITION_COLORS, SLEEPER_AVATAR_BASE_URL } from "@/constants";
import { Position } from "@/types";
import { Icon } from "@iconify-icon/react";

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
                                <p className="flex items-center">
                                    <Icon icon="octicon:dot-fill-16" style={{ color: "#818CF8", fontSize: "12px" }}/>
                                    {team1Score}
                                </p>
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
                        {team1?.starters.slice().map((starter, i) => { 
                            const player = findPlayerByID(starter, players);
                            return ( 
                                <div key={i} className="my-3 flex items-center justify-between" style={{background:  `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 1)), ${findLogo(player.team).bgColor}`}}>
                                    <div className="flex items-center">
                                        <div className={styles.teamLogo} style={{ backgroundImage:`url(${findLogo(player.team).l})`, backgroundPosition: player.position === "DEF" ? "center" : "left"}}>
                                            <div className={styles.player} style={{ backgroundImage: `url(${PLAYER_BASE_URL}${player.player_id}.jpg)` }}></div>
                                        </div>
                                        <div className="ml-1">
                                            <p className="text-sm font-bold">{player.first_name} {player.last_name}</p>
                                            <div className={`my-1 ${styles.playerInfo}`}>
                                                <p className={styles.position} style={{color: `${POSITION_COLORS[player.position as Position]}`}}>{player.position}</p>
                                                <p className="mx-1">{player.team}</p>
                                                {player.position === "DEF" ? <></> : <p className="font-light">#{player.number}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-xs font-bold mr-2`}>
                                        <p>{team1.starters_points[i]}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div>
                        {league.roster_positions.slice(0, 12).map((position, idx) =>
                            <div key={idx} className={styles.positionHUD}>
                            {position ===  "WRRB_FLEX" ? 
                                <span style={{color: POSITION_COLORS["WR"]}}>W<span style={{color: POSITION_COLORS["RB"]}}>R</span></span> 
                            : position === "FLEX" ? 
                                <span style={{color: POSITION_COLORS["WR"]}}>
                                    W<span style={{color: POSITION_COLORS["RB"]}}>R</span>
                                    <span style={{color: POSITION_COLORS["TE"]}}>T</span>
                                </span> 
                            : position === "SUPER_FLEX" ?
                                <div>
                                    <p style={{color: POSITION_COLORS["WR"]}}>W<span style={{color: POSITION_COLORS["RB"]}}>R</span></p>
                                    <p style={{color: POSITION_COLORS["TE"]}}>T<span style={{color: POSITION_COLORS["QB"]}}>Q</span></p>
                                </div>
                            : <p style={{color: `${POSITION_COLORS[position as Position]}`}}>{position}</p>}
                            </div>
                        )}
                        <p></p>
                    </div>
                    <div className={`${styles.teamContainer}`} style={{flexDirection: "row-reverse", textAlign: "end" }}>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};
