import styles from "../Matchup.module.css";
import React from "react";
import * as Interfaces from "@/interfaces";
import { Icon } from "@iconify-icon/react";
import { 
    calculatePercentage, 
    findLeagueBySeason, 
    findMatchupDateByPoints, 
    findRosterByRosterID, 
    findUserByRosterID, 
    getLegacyMatchup, 
    roundToHundredth } from "@/utils";
import { useLeagueContext } from "@/context";
import { useSearchParams } from "next/navigation";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";

export default function LegacyMatchup({ matchup, legacy, selectMatchup }: Interfaces.LegacyMatchupProps) {
    const { legacyLeague } = useLeagueContext();
    const searchParams = useSearchParams();
    const season: string = searchParams.get("season")!;
    const league: Interfaces.League = findLeagueBySeason(season, legacyLeague);
    const rosters: Interfaces.Roster[] = league?.rosters;
    const team1: Interfaces.Match = matchup! && matchup[0]!;
    const team2: Interfaces.Match = matchup! && matchup[1]!;
    const roster1: Interfaces.Roster = findRosterByRosterID(team1?.roster_id, rosters!);
    const roster2: Interfaces.Roster= findRosterByRosterID(team2?.roster_id, rosters!);
    const legacyMatchup: Interfaces.Match[][] = getLegacyMatchup(legacyLeague);
    const filteredLegacyMatchup: Interfaces.Match[][] = legacyMatchup.filter((matchup: Interfaces.Match[]) => 
    (matchup[0]?.roster_id === team1?.roster_id && matchup[1]?.roster_id === team2?.roster_id) ||
    (matchup[0]?.roster_id === team2?.roster_id && matchup[1]?.roster_id === team1?.roster_id)
    ).map(a => a.sort((a: Interfaces.Match, b: Interfaces.Match) => a.points - b.points));
    
    const topMatchupScores = getLegacyMatchup(legacyLeague).slice(0, 10).map(a => 
        a.sort((a: any, b: any) => a.points - b.points)
    );

    const showTeamInfo = (user: Interfaces.Owner, teamScore: number, totalScore: number) => {
        return (
        <div className="w-3/12 flex items-center justify-center">
            <div className={`mr-2 ${styles.userAvatar}`} 
            style={{ backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${user.avatar})`}}>
            </div>
            <div>
                <p className="font-bold">{user.metadata?.team_name ? 
                user.metadata?.team_name : user?.display_name}</p> 
                <p>{teamScore} pts ({calculatePercentage(teamScore, totalScore)}%)</p>
            </div>
        </div>
        );
    };
    const matchupRecordRow = (i: number, matchup: Interfaces.Match[]) => {
        const losingTeam: Interfaces.Match = matchup && matchup[0]!
        const winningTeam: Interfaces.Match = matchup && matchup[1]!
        const score1:number = losingTeam.points;
        const score2:number = winningTeam.points;
        const totalScore: number = roundToHundredth(score1 + score2);
        const foundMatchupDate = findMatchupDateByPoints(legacyLeague, score1, score2);
        const weekNum: number = foundMatchupDate.week;
        const seasonLabel: string = foundMatchupDate.season;
        const foundLeague: Interfaces.League = findLeagueBySeason(seasonLabel, legacyLeague)!;
        const losingTeamUser: Interfaces.Owner = findUserByRosterID(losingTeam?.roster_id, foundLeague);
        const winningTeamUser: Interfaces.Owner = findUserByRosterID(winningTeam?.roster_id, foundLeague);
        return (
            <div key={i} className={styles.matchupRecord} onClick={() => selectMatchup(matchup)}>
                <p className="w-1/12 text-gray-200 font-bold">{i+1}</p>
                <p className="w-2/12">Week {weekNum}, {seasonLabel}</p>
                <p className="w-2/12">{totalScore}</p>
                {showTeamInfo(losingTeamUser, score1, totalScore)}
                {showTeamInfo(winningTeamUser, score2, totalScore)}  
            </div>
        );
    };

    return (
        <div className={styles.legacyContainer}>
            <div className="flex items-center justify-between border-b-2 border-[#0f0f0f] pb-3">
                {legacy? 
                <p>Legacy Matchup</p> :    
                <select className={styles.selectScoreList}>
                    <option>{`All Time Scores`}</option>
                    {legacyLeague.map((league, i) => 
                        <option key={i}>{`${league.season} Scores`}</option>
                    )}
                </select>}
                <Icon icon="uiw:more" className={styles.transactionModalBtn}/>
            </div>
            <div className="text-xs text-gray-400 flex items-center pt-4 pb-2 text-center">
                <p className="w-1/12">RANK</p>
                <p className="w-2/12">DATE</p>
                <p className="w-2/12">TOTAL POINTS</p>
                <p className="w-3/12">LOSING TEAM</p>
                <p className="w-3/12">WINNING TEAM</p>
            </div>
            <div className="text-center">
                {legacy?
                filteredLegacyMatchup.slice().map((matchup, i) => 
                    matchupRecordRow(i, matchup)) :
                topMatchupScores.slice().map((matchup: Interfaces.Match[], i) => 
                    matchupRecordRow(i, matchup))}
            </div>
        </div>
    );
};
