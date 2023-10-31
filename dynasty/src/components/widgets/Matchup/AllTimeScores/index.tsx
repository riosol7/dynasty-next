import { useLeagueContext } from "@/context";
import { getMatchups } from "@/utils";

export default function AllTimeScoreWidget() {
    const { legacyLeague } = useLeagueContext();
    const matchups = legacyLeague.map(league => {
        return {
            matchups: getMatchups(league.matchups),
            season: league.season,
        }});
    // const matchups = legacyLeague.map(league => getMatchups(league.matchups).flat()).flat().sort((a, b) => {
    //     const aTeam1Score = a[0].points;
    //     const aTeam2Score = a[1].points;
    //     const aTotalScore = aTeam1Score + aTeam2Score;
    //     const bTeam1Score = b[0].points;
    //     const bTeam2Score = b[1].points;
    //     const bTotalScore = bTeam1Score + bTeam2Score;
    //     return bTotalScore - aTotalScore;
    // });
    console.log(matchups)
    return (
        <div>
            <div>
                <p>All Time Scores</p>
            </div>
        </div>
    );
};
