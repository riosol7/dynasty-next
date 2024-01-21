import styles from "./PerformerList.module.css";
import React from "react";
import { useLeagueContext, useSeasonContext, usePlayerContext } from "@/context";
import * as Interfaces from "@/interfaces";
import { calculatePercentage, findLeagueBySeason, findPlayerByID, findRosterByRosterID, findUserByRosterID, getMatchups, roundToHundredth } from "@/utils";
import { PLAYER_BASE_URL, POSITION_COLORS, SLEEPER_AVATAR_BASE_URL } from "@/constants";

interface TopPerformingPlayer {
    roster_id: number;
    player_id: string;
    points: number;
    team_points: number;
};

export default function PerformerList({ selectWeek }: {selectWeek: number}) {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason } = useSeasonContext();
    const { players } = usePlayerContext();
    const league: Interfaces.League = findLeagueBySeason(selectSeason, legacyLeague);
    const rosters = league.rosters;
    const matchups = getMatchups(league.matchups);
    const selectedMatchups =  matchups && matchups[selectWeek - 1];
    const topPerformingPlayers = selectedMatchups?.slice().flat().map(
        (team: Interfaces.Match) => {
            const starters = team.starters.map((starter, j) => {
                return {
                    roster_id: team.roster_id,
                    player_id: starter,
                    points: team.starters_points[j],
                    team_points: team.points,
                }
            })
            return starters;     
        }
    ).flat().sort((a: TopPerformingPlayer, b: TopPerformingPlayer) => b.points - a.points);
    
    const top10starters = () => {
        return topPerformingPlayers?.slice(0, 10).map((player: TopPerformingPlayer, k: number) => {
            const user = findUserByRosterID(player.roster_id, league);
            const playerInfo = findPlayerByID(player.player_id, players);
            
            return (
                <div key={k} className={`border-[#0f0f0f] rounded-2xl border-2 py-5 px-3 mr-4`}>
                    <div className={`${styles.playerImage}`} style={{backgroundImage: `url(${PLAYER_BASE_URL}${player.player_id}.jpg)`}}>
                        <p className={styles.rank}>{k + 1}</p>
                        <div className="flex justify-center">
                            <p className={styles.position} style={{ color: POSITION_COLORS[playerInfo.position as keyof typeof POSITION_COLORS]}}>{playerInfo.position}</p>
                        </div>
                    </div>
                    <div className="text-center text-xs pt-3">
                        <p className="font-bold">{playerInfo.first_name[0]}. {playerInfo.last_name}</p>
                        <p className="pt-1">{player.points} ({calculatePercentage(player.points, player.team_points)}%)</p>
                        <p><span style={{color: "#a9dfd8", fontWeight: "bolder"}}>- </span>{user.display_name}</p>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="flex items-center">
            {top10starters()}
        </div>
    );
};
