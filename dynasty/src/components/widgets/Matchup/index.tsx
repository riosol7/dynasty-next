import styles from "./Matchup.module.css";
import React from "react";
import * as Interfaces from "@/interfaces";
import { calculatePercentage, findLeagueBySeason, findLogo, findPlayerByID, findPlayerByPts, findRecord, findRosterByRosterID, findUserByRosterID, getMatchups, roundToHundredth } from "@/utils";
import { useLeagueContext, usePlayerContext } from "@/context";
import { PLAYER_BASE_URL, POSITION_COLORS, SLEEPER_AVATAR_BASE_URL } from "@/constants";
import { Position } from "@/types";
import { Icon } from "@iconify-icon/react";
import { useSearchParams } from "next/navigation";

export default function MatchupWidget({ matchup }: Interfaces.MatchupWidgetProps) {
    const { legacyLeague } = useLeagueContext();
    const { players } = usePlayerContext();
    const searchParams = useSearchParams();
    const week: number = Number(searchParams.get("week"));
    const season: string = searchParams.get("season")!;
    const league: Interfaces.League = findLeagueBySeason(season, legacyLeague);
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
                    <div className={styles.playerCard} style={{ 
                        background: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 1)), ${findLogo(player.team).bgColor}`, 
                        flexDirection: reverse ? "row-reverse" : "row", textAlign: reverse ? "end" : "start"
                    }}>
                        <div className={`${styles.teamLogoBackground}`} style={{
                            flexDirection: reverse ? "row-reverse" : "row", 
                            textAlign: reverse ? "end" : "start",
                            // backgroundImage: `linear-gradient(rgba(0, 0, 100, .1), rgba(0, 0, 0, .9)), url(${logo.l})`
                            backgroundImage: 
                            player.position === "DEF" ?  "" : 
                            `linear-gradient(rgba(0, 0, 100, .1), rgba(0, 0, 0, .9)), url(${findLogo(player.team).l})`,
                            backgroundPosition: reverse ? "right" : "left",
                        }}>
                            {player.position === "DEF" ?
                            <div className={`${styles.teamLogo}`} style={{backgroundImage: `url(${findLogo(player.team).l})`}}>
                            </div>
                            : <div className={`${styles.player}`} style={{ backgroundImage: `url(${PLAYER_BASE_URL}${player.player_id}.jpg)` }}></div>
                            }
                            <div className="w-2/3">
                                <p className={styles.playerName}>{player.first_name} {player.last_name}</p>
                                <div className={`flex justify-between items-end ${reverse ? "justify-end pl-1" : "justify-start pr-1"}`}>
                                    {reverse ?
                                    <p className="text-xs mb-1" style={{}}>
                                        <span className="mr-1">
                                        ({calculatePercentage(team.players_points[player.player_id], team.points)}%)
                                        </span>
                                        <span className="font-bold">{team.players_points[player.player_id]}</span> pts

                                    </p>                                   
                                    :<></>}
                                    <div className={`mb-4 ${styles.playerInfo}`} style={{ 
                                        borderRadius: reverse ? "5px 5px 5px 5px" : "5px 5px 5px 5px",
                                        flexDirection: reverse ? "row-reverse" : "row", 
                                        textAlign: reverse ? "end" : "start" }}>
                                        <p className={styles.position} style={{
                                            borderRadius: reverse ? "0px 0px 5px 0px" : "0px 0px 0px 5px",
                                            color: `${POSITION_COLORS[player.position as Position]}`}}>{player.position}</p>
                                        <p className={`${"mx-1"}`}>{player.team}</p>
                                        {player.position === "DEF" ? <></> : <p className={`font-light m${reverse ? "l" : "r"}-1`}>#{player.number}</p>}
                                    </div>
                                    {reverse ? <></> :
                                    <p className={`text-xs mb-1 `}>
                                        <span className="font-bold">{team.players_points[player.player_id]}</span> pts
                                        <span className="ml-1">
                                        ({calculatePercentage(team.players_points[player.player_id], team.points)}%)
                                        </span>
                                    </p>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between bg-gray-700 h-1.5" style={{ flexDirection: reverse ? "row" : "row-reverse", textAlign: reverse ? "end" : "start" }}>
                            <div className="h-1.5" style={{ width: `${calculatePercentage(team.players_points[player.player_id], team.points)}%`, background: reverse ? "#CD5C5C" : "#818CF8" }}></div>
                            {/* <div className={`h-1.5 rounded-full`} style={{ width: `${topPlayer1Percentage}%`, backgroundColor: topStarter1Details?.team ? `${findLogo(topStarter1Details?.team).bgColor2}` : `rgba(165,172,175,1)` }}></div>
                            <div className={`h-1.5 rounded-full`} style={{ width: `${topPlayer2Percentage}%`, backgroundColor: topStarter2Details?.team ? `${findLogo(topStarter2Details?.team).bgColor2}` : `rgba(165,172,175,1)` }}></div> */}
                        </div>
                        {/* <div className="flex items-center justify-between text-xs pt-1" style={{ flexDirection: reverse ? "row-reverse" : "row", textAlign: reverse ? "end" : "start" }}>
                            <p className="text-xs">{team.players_points[player.player_id]} / {team.points} pts ({calculatePercentage(team.players_points[player.player_id], team.points)}%)</p>
                        </div> */}
                    </div>
                    <div className={styles.statContainer} style={{flexDirection: reverse ? "row-reverse" : "row"}}>
                        <p>-/- CMP, - YD, - INT, - CAR, - YD, - FUM, - FUM LOST</p>
                    </div>
                </div>
            );
        })
    };

    const matchupHeader = (
        team: Interfaces.Match, 
        score: number, 
        roster: Interfaces.Roster, 
        matchups: Interfaces.Match[][],
        reverse: boolean,
        ) => {
        const user: Interfaces.Owner = findUserByRosterID(roster.roster_id, league);
        return (
            <div className={`${styles.teamContainer}`} style={{ 
                flexDirection: reverse ? "row-reverse" : "row", 
                textAlign: reverse ? "end" : "start",}}>
                <div className="flex items-center">
                    {reverse ? <></> :
                    <div className={styles.teamAvatar} style={{ backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar})`}}></div>                    
                    }
                    <div className={`m${reverse ? "r" : "l"}-2 text-sm`}>
                        <div>
                            <p className="font-bold">{user.metadata?.team_name ? 
                            user?.metadata?.team_name : user?.display_name}</p> 
                        </div>
                        <p className="">                                                        
                            {reverse ? <></> :
                            <span className={`font-bold text-[#34d367] mr-1`}>W</span>}
                            {findRecord(team?.roster_id, matchups, week - 1).record}
                            {!reverse ? <></> :
                            <span className={`font-bold text-[#cc1d00] ml-1`}>L</span>}
                        </p> 
                        <p className="text-xs"style={{ 
                            flexDirection: reverse ? "row-reverse" : "row", 
                            textAlign: reverse ? "end" : "start",}}>Season Avg -</p>
                        <p className="flex items-center pt-1"style={{ 
                            flexDirection: reverse ? "row-reverse" : "-moz-initial", 
                            textAlign: reverse ? "end" : "-moz-initial",}}>
                            <Icon icon="octicon:dot-fill-16" style={{ color: reverse ? "#CD5C5C" : "#818CF8", fontSize: "12px" }}/>
                            {team1Score} ({calculatePercentage(score, totalPtsScored)}%)
                        </p>
                    </div>
                    {!reverse ? <></> :
                    <div className={styles.teamAvatar} style={{ backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar})`}}></div>                    
                    }
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="flex items-center justify-between pb-1">
                {matchupHeader(team1, team1Score, roster1, roster1Matchups, false)}
                {matchupHeader(team2, team2Score, roster2, roster2Matchups, true)}
            </div>
            <div className="flex justify-between bg-gray-700 rounded-full h-1.5 mt-1 mb-2">
                <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: `${team1Percentage}%` }}></div>
                {/* <div className={`h-1.5 rounded-full`} style={{ width: `${topPlayer1Percentage}%`, backgroundColor: topStarter1Details?.team ? `${findLogo(topStarter1Details?.team).bgColor2}` : `rgba(165,172,175,1)` }}></div>
                <div className={`h-1.5 rounded-full`} style={{ width: `${topPlayer2Percentage}%`, backgroundColor: topStarter2Details?.team ? `${findLogo(topStarter2Details?.team).bgColor2}` : `rgba(165,172,175,1)` }}></div> */}
            </div>
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
