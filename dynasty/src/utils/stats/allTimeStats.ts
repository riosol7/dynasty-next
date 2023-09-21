import * as Interfaces from "../../interfaces";
import { roundToHundredth, winPCT } from "..";

export const getAllTimeStats = (rID: number, legacyLeague: Interfaces.League[], season: string | undefined) => {

    const legacyRosters = legacyLeague.map(league => league.rosters.filter(roster => roster.roster_id === rID))[0];
    const legacyMatches = legacyLeague.map(league => league.matchups.filter(matches => matches.filter(team => team.roster_id === rID)))[0];
    
    const allTimeRegularSeasonWins = legacyRosters.reduce((acc, item) => acc + item.settings.wins, 0);
    const allTimeRegularSeasonLosses = legacyRosters.reduce((acc, item) => acc + item.settings.losses, 0);
    const allTimeRegularSeasonFPTS = roundToHundredth(legacyRosters?.reduce((acc, item) =>  acc + Number(item.settings.fpts + "." + item.settings.fpts_decimal), 0));
    const allTimeRegularSeasonPPTS = roundToHundredth(legacyRosters?.reduce((acc, item) =>  acc + Number(item.settings.ppts + "." + item.settings.ppts_decimal), 0));
    const allTimeRegularSeasonPA = roundToHundredth(legacyRosters?.reduce((acc, item) =>  acc + Number(item.settings.fpts_against + "." + item.settings.fpts_against_decimal), 0));
    const bestRecord = legacyRosters?.sort((a,b) => b.settings.wins - a.settings.wins)[0]?.settings;
    const bestScore = legacyMatches?.map(match => match.sort((a, b) => b.points - a.points)[0]).sort((a,b) => b.points - a.points)[0].points;
    
    // const postSeasonStats = getPostSeasonStats(rosterID, yr, processedLeague, myMatchups);
    // const postSeasonAllTimeStats = getPostSeasonStats(rosterID, "All Time", processedLeague);
    const allTime = {    
        best: {
            record: `${bestRecord?.wins}-${bestRecord?.losses}`,
            score: bestScore,
            // year:,
            winRate: winPCT(bestRecord?.wins, bestRecord?.losses),
        },
        percentage: roundToHundredth(((allTimeRegularSeasonWins)/(allTimeRegularSeasonWins + allTimeRegularSeasonLosses))*100),
        wins: allTimeRegularSeasonWins,
        losses: allTimeRegularSeasonLosses,
        fpts: allTimeRegularSeasonFPTS,
        ppts: allTimeRegularSeasonPPTS,
        pa: allTimeRegularSeasonPA,
        // playoffs: {
        //     appearances: postSeasonAllTimeStats.appearances,
        //     wins: postSeasonAllTimeStats.wins,
        //     losses: postSeasonAllTimeStats.losses,
        //     games: postSeasonAllTimeStats.totalGames,
        //     fpts: postSeasonAllTimeStats.pf,
        //     // playoffMaxPF:0,
        //     pa: postSeasonAllTimeStats.pa,
        //     highestScore: postSeasonAllTimeStats.highestScore,
        //     finals:(postSeasonAllTimeStats.finals.w + "-" + postSeasonAllTimeStats.finals.l),
        // },
        // toiletBowls: postSeasonAllTimeStats.toiletBowls,
    }
};