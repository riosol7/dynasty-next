import { useLeagueContext } from "@/context";
import { findLeagueBySeason, findMatchupDateByPoints, findRosterByRosterID, findUserByRosterID, getMatchups, roundToHundredth } from "@/utils";
import * as Interfaces from "@/interfaces";

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
            <p>All Time Scores</p>
            {/* <div className="flex items-center">
                <p>Rank</p>
                <p>Total Score</p>
                <p></p>

            </div> */}
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
                        <p>{i + 1}</p>
                        <div>
                            <p className="font-bold text-xs">Week {week}, {season}</p>
                            <p>{user1.display_name} ({team1Score}) vs. ({team2Score}) {user2.display_name}</p>
                        </div>
                        <p>{totalScore}</p>
                    </div>
                )}
            )}
        </div>
    );
};
