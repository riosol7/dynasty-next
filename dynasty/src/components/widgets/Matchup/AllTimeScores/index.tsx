import styles from "../Matchup.module.css";
import { useLeagueContext } from "@/context";
import { calculatePercentage, findLeagueBySeason, findMatchupDateByPoints, findRosterByRosterID, findUserByRosterID, getLegacyMatchup, getMatchups, roundToHundredth } from "@/utils";
import * as Interfaces from "@/interfaces";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";
import { Icon } from "@iconify-icon/react";

export default function AllTimeScoreWidget() {
    const { legacyLeague } = useLeagueContext();
   
    const topMatchupScores = getLegacyMatchup(legacyLeague).slice(0, 10).map(a => 
        a.sort((a: any, b: any) => a.points - b.points)
    );

    const showTeamInfo = (user: any, teamScore: any, totalScore: any) => {
        return (
        <div className="w-3/12 flex items-center">
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
            <div className="flex items-center justify-between border-b-2 border-[#0f0f0f] font-bold pb-3">
                <select className={styles.selectScoreList}>
                    <option>{`All Time Scores`}</option>
                    {legacyLeague.map((league, i) => 
                        <option key={i}>{`${league.season} Scores`}</option>
                    )}
                </select>
                <Icon icon="uiw:more" className={styles.transactionModalBtn}/>
            </div>
            <div className="text-xs text-gray-400 flex items-center pt-4">
                <p className="w-1/12">RANK</p>
                <p className="w-2/12">DATE</p>
                <p className="w-2/12">TOTAL POINTS</p>
                <p className="w-3/12">LOSING TEAM</p>
                <p className="w-3/12">WINNING TEAM</p>
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
                        <p className="w-1/12 text-gray-200 font-bold">{i + 1}</p>
                        <p className="w-2/12">Week {week}, {season}</p>
                        <p className="w-2/12">{totalScore}</p>
                        {showTeamInfo(user1, team1Score, totalScore)}
                        {showTeamInfo(user2, team2Score, totalScore)}
                    </div>
                )}
            )}
        </div>
    );
};
