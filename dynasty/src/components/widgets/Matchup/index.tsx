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

    const foundWeekIndex = roster1Matchups.findIndex((matchup) =>
        matchup[0].points === team1Score || matchup[1].points === team1Score
    );
    const sorted1StarterPts = team1?.starters_points?.slice().sort((a,b) => b - a);
    const sorted2StarterPts = team2?.starters_points?.slice().sort((a,b) => b - a);

    const team1TopStarterPts = sorted1StarterPts && sorted1StarterPts[0];
    const team2TopStarterPts = sorted2StarterPts && sorted2StarterPts[1];
    const topPlayer1Percentage = calculatePercentage(team1TopStarterPts, totalPtsScored);
    const topPlayer2Percentage = calculatePercentage(team2TopStarterPts, totalPtsScored);
    const team1Percentage = calculatePercentage(team1Score, totalPtsScored);
    const team2Percentage = calculatePercentage(team2Score, totalPtsScored);

    const topStarter1Details = findPlayerByPts(team1, team1TopStarterPts, players);
    const topStarter2Details = findPlayerByPts(team2, team2TopStarterPts, players);

    const playerList = (team: Interfaces.Match, idx: number) => {
        return team?.starters?.slice().map((starter, i) => { 
            const player = findPlayerByID(starter, players);
            const reverse = idx === 1;
            return ( 
                <div key={i} className="mb-3"> 
                    <div style={{ 
                        background: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 1)), ${findLogo(player.team).bgColor}`, 
                        flexDirection: reverse ? "row-reverse" : "row", textAlign: reverse ? "end" : "start"
                    }}>
                        <div className={`${styles.teamLogo}`} style={{
                            flexDirection: reverse ? "row-reverse" : "row", 
                            textAlign: reverse ? "end" : "start",
                            // backgroundImage: `linear-gradient(rgba(0, 0, 100, .1), rgba(0, 0, 0, .9)), url(${logo.l})`
                            backgroundImage: 
                            player.position === "DEF" ?  `url(${findLogo(player.team).l})` : 
                            `linear-gradient(rgba(0, 0, 100, .1), rgba(0, 0, 0, .9)), url(${findLogo(player.team).l})`,
                            backgroundPosition: reverse ? "right" : "left"
                        }}>
                            <div className={styles.player} style={{ backgroundImage: `url(${PLAYER_BASE_URL}${player.player_id}.jpg)` }}></div>
                            <div>
                                <p className={styles.playerName}>{player.first_name} {player.last_name}</p>
                                <div className={`flex ${reverse ? "justify-end" : "justify-start"}`}>
                                    <div className={`my-1 ${styles.playerInfo}`} style={{ 
                                        flexDirection: reverse ? "row-reverse" : "row", 
                                        textAlign: reverse ? "end" : "start" }}>
                                        <p className={styles.position} style={{color: `${POSITION_COLORS[player.position as Position]}`}}>{player.position}</p>
                                        <p className={`${"mx-1"}`}>{player.team}</p>
                                        {player.position === "DEF" ? <></> : <p className={`font-light m${reverse ? "l" : "r"}-1`}>#{player.number}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between bg-gray-700 h-1.5" style={{ flexDirection: reverse ? "row-reverse" : "row", textAlign: reverse ? "end" : "start" }}>
                            <div className="h-1.5" style={{ width: `${calculatePercentage(team.players_points[player.player_id], team.points)}%`, background: reverse ? "#CD5C5C" : "#818CF8" }}></div>
                            {/* <div className={`h-1.5 rounded-full`} style={{ width: `${topPlayer1Percentage}%`, backgroundColor: topStarter1Details?.team ? `${findLogo(topStarter1Details?.team).bgColor2}` : `rgba(165,172,175,1)` }}></div>
                            <div className={`h-1.5 rounded-full`} style={{ width: `${topPlayer2Percentage}%`, backgroundColor: topStarter2Details?.team ? `${findLogo(topStarter2Details?.team).bgColor2}` : `rgba(165,172,175,1)` }}></div> */}
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1" style={{ flexDirection: reverse ? "row-reverse" : "row", textAlign: reverse ? "end" : "start" }}>
                            <p className="text-xs">{team.players_points[player.player_id]} / {team.points} pts ({calculatePercentage(team.players_points[player.player_id], team.points)}%)</p>
                        </div>
                    </div>
                    <div className={styles.statContainer}>
                        <p>24/32 CMP, 241 YD, 2 INT, 3 CAR, 33 YD, 1 FUM, 1 FUM LOST</p>
                    </div>
                </div>
            );
        })
    };

    return (
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
                            <p className="flex items-center pt-1">
                                <Icon icon="octicon:dot-fill-16" style={{ color: "#818CF8", fontSize: "12px" }}/>
                                {team1Score} ({calculatePercentage(team1Score, totalPtsScored)}%)
                            </p>
                        </div>
                    </div>
                </div>
                <div className={`${styles.teamContainer}`} style={{ flexDirection: "row-reverse", textAlign: "end" }}>
                    <div className="flex items-center justify-end">
                        <div className="mr-2 text-sm">
                            <p className="font-bold text-xl">{roster2.owner?.display_name}</p>
                            <p>                                                        
                                {findRecord(team2?.roster_id, roster2Matchups, foundWeekIndex).record}
                                <span className="ml-1 text-[#cc1d00] font-bold">L</span>
                            </p>
                            <p className="flex items-center justify-end pt-1">
                                {team2Score} ({calculatePercentage(team2Score, totalPtsScored)}%)
                                <Icon icon="octicon:dot-fill-16" style={{ color: "#CD5C5C", fontSize: "12px" }}/>
                            </p>
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
            <div className="py-2 border-b-2 border-[#0f0f0f] flex items-center justify-between text-sm">
                <p>- W</p>
                <p>Match History: - Games Played <Icon icon="ep:arrow-up-bold" style={{ color: "#a9dfd8"}}/></p>
                <p>- W</p>
            </div>
            <p className="text-center text-sm pb-2 pt-1">Week {foundWeekIndex + 1}, {selectSeason}</p>

            <div className="flex items-center justify-between">
                <div className={styles.teamContainer}>
                    {playerList(team1 , 0)}
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
                <div className={`${styles.teamContainer}`}>
                    {playerList(team2, 1)}
                </div>
            </div>
        </div>
    );
};
