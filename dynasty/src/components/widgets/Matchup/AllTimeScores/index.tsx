import styles from "../Matchup.module.css";
import { useLeagueContext } from "@/context";
import { calculatePercentage, findLeagueBySeason, findMatchupDateByPoints, findRosterByRosterID, findUserByRosterID, getMatchups, roundToHundredth } from "@/utils";
import * as Interfaces from "@/interfaces";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";

export default function AllTimeScoreWidget() {
    const { legacyLeague } = useLeagueContext();
   
    const topMatchupScores = legacyLeague.map(league => getMatchups(league.matchups).flat())
    .flat().sort((a, b) => {
        const aTeam1Score = a[0].points;
        const aTeam2Score = a[1].points;
        const aTotalScore = aTeam1Score + aTeam2Score;
        const bTeam1Score = b[0].points;
        const bTeam2Score = b[1].points;
        const bTotalScore = bTeam1Score + bTeam2Score;  
        return bTotalScore - aTotalScore;
    }).slice(0, 30).map(a => 
        a.sort((a: any, b: any) => a.points - b.points)
    );

    const showTeamInfo = (user: any, teamScore: any, totalScore: any) => {
        return (
        <div className="w-44 flex items-center">
            <div className={`mr-1 ${styles.userAvatar}`} 
            style={{ backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${user.avatar})`}}>
            </div>
            <div>
                <p className="font-bold">{user.display_name}</p> 
                <p>{teamScore} pts ({calculatePercentage(teamScore, totalScore)}%)</p>
            </div>
        </div>
        );
    };

    return (
        <div className={styles.allTimeContainer}>
            <p className="font-bold pb-4">All Time Scores</p>
            <div className="text-xs text-gray-400 flex items-center">
                <p className="w-14">RANK</p>
                <p className="w-32">DATE</p>
                <p className="w-32">TOTAL POINTS</p>
                <p className="w-44">LOSING TEAM</p>
                <p className="w-44">WINNING TEAM</p>
            </div>
            {topMatchupScores.slice().map((matchup: Interfaces.Match[], i) => {
                const team1Score = matchup[0].points;
                const team2Score = matchup[1].points;
                const foundMatchup = findMatchupDateByPoints(legacyLeague, team1Score, team2Score);
                const season = foundMatchup.season;
                const week = foundMatchup.week;
                const league = findLeagueBySeason(season, legacyLeague);
                const user1 = findUserByRosterID(matchup[0].roster_id, league);
                const user2 = findUserByRosterID(matchup[1].roster_id, league);
                const totalScore = roundToHundredth(team1Score + team2Score);
                return (
                    <div key={i} className="flex items-center py-3">
                        <p className="w-14 text-gray-200 font-bold">{i + 1}</p>
                        <p className="w-32">Week {week}, {season}</p>
                        <p className="w-32">{totalScore}</p>
                        {showTeamInfo(user1, team1Score, totalScore)}
                        {showTeamInfo(user2, team2Score, totalScore)}
                    </div>
                )}
            )}
        </div>
    );
};
