import styles from "./Matchup.module.css";
import React from "react";
import * as Interfaces from "@/interfaces";
import { 
    calculatePercentage, 
    findLeagueBySeason, 
    findLogo, 
    findMatchupDateByPoints, 
    findPlayerByID, 
    findPlayerByPts, 
    findRecord, 
    findRosterByRosterID, 
    findUserByRosterID, 
    getAllPlayStats, 
    getMatchups, 
    roundToHundredth, 
    totalPointsPerGame } from "@/utils";
import { useLeagueContext, usePlayerContext } from "@/context";
import { PLAYER_BASE_URL, POSITION_COLORS, SLEEPER_AVATAR_BASE_URL } from "@/constants";
import { Position } from "@/types";
import { Icon } from "@iconify-icon/react";
import { useSearchParams } from "next/navigation";

export default function MatchupWidget({ matchup }: Interfaces.MatchupWidgetProps) {
    const { legacyLeague } = useLeagueContext();
    const { players } = usePlayerContext();
    const searchParams = useSearchParams();
    const team1: Interfaces.Match = matchup && matchup[0];
    const team2: Interfaces.Match = matchup && matchup[1];
    const team1Score: number = team1?.points;
    const team2Score: number = team2?.points;
    const foundGameWeekByScore = findMatchupDateByPoints(
        legacyLeague, team1Score, team2Score);

    const week: number = foundGameWeekByScore?.week! || 
    Number(searchParams.get("week"));
    const season: string = foundGameWeekByScore?.season! ||
    searchParams.get("season")!;
    const league: Interfaces.League = findLeagueBySeason(season, legacyLeague);
    const rosters: Interfaces.Roster[] = league?.rosters;
    const matchups: Interfaces.Match[][] = league?.matchups;
    
    const totalPtsScored: number = roundToHundredth(team1Score + team2Score);
    
    const roster1: Interfaces.Roster = findRosterByRosterID(team1?.roster_id, rosters!);
    const roster2: Interfaces.Roster = findRosterByRosterID(team2?.roster_id, rosters!);

    const roster1Matchups = getMatchups(matchups!, roster1.roster_id);
    const roster2Matchups = getMatchups(matchups!, roster2.roster_id);

    const foundWeekIndex: number = roster1Matchups.findIndex((matchup) =>
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
    const week17Season: boolean = (Number(season) <= 2020 && foundWeekIndex < 13) || 
    (Number(season) > 2020 && foundWeekIndex < 14)
    
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
                            <div className={`${styles.teamLogo}`} style={{backgroundImage: `url(${findLogo(player.team).l})`}}></div>
                            : <div className={`${styles.player}`} style={{backgroundImage: `url(${PLAYER_BASE_URL}${player.player_id}.jpg)`}}></div>
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
                                    </p>:<></>}
                                    <div className={`mb-5 ${styles.playerInfo}`} style={{ 
                                    borderRadius: reverse ? "5px 5px 5px 5px" : "5px 5px 5px 5px",
                                    flexDirection: reverse ? "row-reverse" : "row"}}>
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
                        <div className="flex justify-between bg-gray-700 h-1.5" 
                        style={{ 
                            flexDirection: reverse ? "row" : "row-reverse", 
                            textAlign: reverse ? "end" : "start" }}>
                            <div className="h-1.5" 
                            style={{ 
                            width: `${calculatePercentage(team.players_points[player.player_id], team.points)}%`, 
                            background: reverse ? "#CD5C5C" : "#818CF8" }}></div>
                            {/* <div className="h-1.5" style={{ width: `${calculatePercentage(team.players_points[player.player_id], team.points)}%`, background: findLogo(player.team).bgColor2 }}></div> */}
                        </div>
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
        const seasonFPTS: number = Number(roster.settings.fpts + "." + roster.settings.fpts_decimal);
        const rID: number = roster?.roster_id;
        const allPlayStats = getAllPlayStats(rID, season, legacyLeague);
        const weeklyAllPlayRecord = allPlayStats?.weeklyRecord?.[foundWeekIndex]!;
        const exceptionCurrentOwnerAllPlayTotalRosters = rosters.length - 1;
        
        return (
            <div className={`${styles.teamContainer}`}>
                <div className="flex items-end" style={{ 
                flexDirection: reverse ? "row-reverse" : "row", 
                textAlign: reverse ? "end" : "start",}}>
                    <div className={styles.teamAvatar} style={{ backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar})`}}></div>                    
                    <div className={`m${reverse ? "r" : "l"}-2 text-sm`}>
                        <div>
                            <p className="font-bold">{user.metadata?.team_name ? 
                            user?.metadata?.team_name : user?.display_name}</p> 
                        </div>
                        <div className={week17Season ? "" : "pt-1 pb-2"}>
                            <p className="flex" style={{ flexDirection: reverse ? "row-reverse" : "row" }}>                                                        
                                <span className={`font-bold text-[${reverse ? "#cc1d00" : "#34d367"}] m${reverse ?
                                "l" : "r"}-1`}>{reverse ? "L" : "W"}</span>
                                {findRecord(team?.roster_id, matchups, week - 1).record}
                                <span className={`text-[darkgray] m${reverse ? "r" : "l"}-1`}>(- th)</span>
                            </p>
                            <div className={`pt-1 text-xs flex items-center justify-${reverse ? "end" : "start"}`}>
                                <p>Season Avg {totalPointsPerGame(roster?.roster_id, seasonFPTS, legacyLeague, season)}</p>
                            </div>
                            {week17Season ?
                                <div className={`text-xs flex justify-end items-center`} style={{ 
                                flexDirection: !reverse ? "row-reverse" : "row" }}>
                                    <div className="flex items-center" style={{ 
                                    flexDirection: reverse ? "row-reverse" : "row"}}>
                                        <div className="flex items-center" style={{ 
                                        flexDirection: reverse ? "row-reverse" : "row" }}>
                                            <Icon icon="material-symbols:arrow-drop-up-rounded" style={{color:"#42f3e9", fontSize:"2.5em"}}/>
                                            <p>{weeklyAllPlayRecord?.wins}</p>
                                        </div>
                                        <div className="flex items-center" style={{ 
                                        flexDirection: reverse ? "row-reverse" : "row" }}>
                                            <Icon icon="material-symbols:arrow-drop-down-rounded" style={{color:"#f85012", fontSize:"2.5em"}}/>
                                            <p>{weeklyAllPlayRecord?.losses}</p>
                                        </div>
                                    </div>
                                    {matchup?.map((team, index) => 
                                    <div key={index} className={`flex items-center m${reverse ? "l" : "r"}-1`}>
                                        {index === 0 ?
                                            index === 0 && team.roster_id === roster?.roster_id ?
                                                roundToHundredth(100-(weeklyAllPlayRecord?.wins!/exceptionCurrentOwnerAllPlayTotalRosters)*100) !== 0 ?
                                                    <div className="flex items-center" style={{ 
                                                    flexDirection: !reverse ? "row-reverse" : "row"}}>
                                                        <p className="px-1">{roundToHundredth(100-(weeklyAllPlayRecord?.wins!/exceptionCurrentOwnerAllPlayTotalRosters)*100)}</p>
                                                        <Icon icon="emojione-monotone:four-leaf-clover" style={{ fontSize:"14px", color:"#289a5d" }}/>
                                                    </div>
                                                : <Icon icon="fluent-emoji-flat:crown" style={{ fontSize:"16px" }}/>
                                            : weeklyAllPlayRecord?.losses === exceptionCurrentOwnerAllPlayTotalRosters ?
                                                <Icon icon="emojione-v1:pile-of-poo" style={{ fontSize:"16px", color:"#724b21" }}/>
                                            :
                                                <div className="flex items-center">
                                                    <p className="px-1">{roundToHundredth(0-(weeklyAllPlayRecord?.wins!/exceptionCurrentOwnerAllPlayTotalRosters)*100)}</p>
                                                    <Icon icon="emojione-monotone:four-leaf-clover" style={{ fontSize:"14px", color:"#dab0af" }}/>
                                                </div>
                                        : <></>}
                                    </div>)}
                                </div>
                            :<></>} 
                        </div>
                        <div className="flex items-center" style={{ 
                        flexDirection: reverse ? "row-reverse" : "-moz-initial", 
                        textAlign: reverse ? "end" : "-moz-initial",}}>
                            <Icon icon="octicon:dot-fill-16" className={`m${reverse ? "l": "r"}-1`} style={{ color: reverse ? "#CD5C5C" : "#818CF8", fontSize: "14px" }}/>
                            <p className="font-bold">{score}</p>
                            <p className={`m${reverse ? "r" : "l"}-1`}></p>({calculatePercentage(score, totalPtsScored)}%)
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between pb-2">
                {matchupHeader(team1, team1Score, roster1, roster1Matchups, false)}
                {matchupHeader(team2, team2Score, roster2, roster2Matchups, true)}
            </div>
            <div className={styles.totalScoreBar} style={{background: `linear-gradient(480deg, rgba(129,140,248,1) ${team1Percentage}%, rgba(205,92,92,1) 100%)`}}></div>
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
