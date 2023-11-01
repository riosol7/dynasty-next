import styles from "../Matchup.module.css";
import { useLeagueContext } from "@/context";
import { findLeagueBySeason, findMatchupDateByPoints, findRosterByRosterID, findUserByRosterID, getMatchups, roundToHundredth } from "@/utils";
import * as Interfaces from "@/interfaces";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";

export default function AllTimeScoreWidget() {
    const { legacyLeague } = useLeagueContext();
   
    const topMatchupScores = legacyLeague.map(league => getMatchups(league.matchups).flat()).flat().sort((a, b) => {
        const aTeam1Score = a[0].points;
        const aTeam2Score = a[1].points;
        const aTotalScore = aTeam1Score + aTeam2Score;
        const bTeam1Score = b[0].points;
        const bTeam2Score = b[1].points;
        const bTotalScore = bTeam1Score + bTeam2Score;  
        return bTotalScore - aTotalScore;
    }).slice(0, 10);

    return (
        <div className="border-4 border-[#0f0f0f] p-2 mr-5 text-sm">
            <p className="border-b border-[#0f0f0f] pb-2 font-bold">All Time Scores</p>
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
                    <div key={i} className="flex items-center justify-between py-3">
                        <p style={{ width: "35px" }} className="text-gray-200 font-bold">{i + 1}</p>
                        <div style={{ minWidth: "300px" }}>
                            <p className="font-bold text-xs pb-2 border-b border-[#0f0f0f]">Week {week}, {season}<span className="font-light mx-2">|</span>Total Score {totalScore}</p>
                            <div className="flex items-center pt-1">
                                <div className="w-6/12 flex items-center">
                                    <div className={`mr-1 ${styles.userAvatar}`} style={{ backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${user1.avatar})`}}></div>
                                    <div>
                                        <p>{user1.display_name}</p> 
                                        <p>{team1Score}</p>
                                    </div>
                                </div>
                                <div className="w-6/12 flex items-center">
                                    <div className={`mr-1 ${styles.userAvatar}`} style={{ backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${user2.avatar})`}}></div>
                                    <div className="">
                                        <p>{user2.display_name}</p> 
                                        <p>{team2Score}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            )}
        </div>
    );
};
