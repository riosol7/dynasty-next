import * as Interfaces from "@/interfaces";
import * as Constants from "@/constants";
import { getMatchups, roundToHundredth } from "..";

export const getRosterPostSeasonStats = (rID: number, legacyLeague: Interfaces.League[], season: string) => {

    let playoffBracket: Interfaces.BracketMatch[] = [];
    let playoffAppearance: boolean = false;
    let playoffFPTS: number = 0;
    let playoffPA: number = 0;
    let playoffHighestScore: number = 0;
    let playoffWins: number = 0;
    let playoffLosses: number = 0;
    
    const foundSeasonLeague = legacyLeague.find(league => league.season === season);        
    playoffBracket = foundSeasonLeague?.brackets?.playoffs.filter(match => match.t2 === rID || match.t1 === rID) as Interfaces.BracketMatch[];
    let placement: number = 0;
    if (playoffBracket?.filter(game => game.r === 3 && game.p === 1 && game.w === rID).length > 0) {
        placement = 1;
    } else if (playoffBracket?.filter(game => game.r === 3 && game.p === 1 && game.l === rID).length > 0) {
        placement = 2;
    } else if (playoffBracket?.filter(game => game.r === 3 && game.p !== 1 && game.w === rID).length > 0) {
        placement = 3;
    } else if (playoffBracket?.filter(game => game.r === 3 && game.p !== 1 && game.l === rID).length > 0) {
        placement = 4;
    } else if (playoffBracket?.filter(game => game.r === 2 && game.w === rID).length > 0) {
        placement = 5;
    } else if (playoffBracket?.filter(game => game.r === 2 && game.l === rID).length > 0) {
        placement = 6;
    }
    const weeklyScore = getMatchups(rID, foundSeasonLeague?.matchups);
    const sliceStart = Number(season) > 2020 ? 14 : 13;
    const sliceEnd = playoffBracket?.length === 3 ? sliceStart + 3 : sliceStart + 2;

    const userScores = weeklyScore?.slice(sliceStart, sliceEnd)
        .map(matchups => matchups.filter((team: Interfaces.Match) => team.roster_id === rID)[0])
        .map(a => a?.points);
    
    const opponentScores = weeklyScore?.slice(sliceStart, sliceEnd)
        .map(matchups => matchups.filter((team: Interfaces.Match) => team.roster_id !== rID)[0])
        .map(a => a?.points);

    if (playoffBracket?.length === 0) {
        playoffHighestScore = 0;
        playoffFPTS = 0;
        playoffPA = 0;
    
    } else if (Array.isArray(userScores) && userScores.length > 0) {
        playoffHighestScore = roundToHundredth(Math.max(...userScores));
        playoffFPTS = roundToHundredth(userScores?.reduce((a, b) => +a + +b));
        playoffPA = roundToHundredth(opponentScores?.reduce((a, b) => +a + +b));
        playoffAppearance = playoffBracket?.length > 0 ? true : false;
        playoffWins = playoffBracket?.filter(game => game?.w === rID)?.length;
        playoffLosses = playoffBracket?.filter(game => game?.l === rID)?.length;
    
    };

    return { 
        roster_id: rID,
        appearance: playoffAppearance,
        bracket: playoffBracket,
        fpts: playoffFPTS,
        pa: playoffPA,
        highestScore: playoffHighestScore,
        losses: playoffLosses,
        totalGames: playoffBracket?.length || 0,
        wins: playoffWins,
        playoff_rank: placement,
    };
};

// export const getLeaguePostSeasonStats = (legacyLeague: Interfaces.League[], season:string) => {

//     if (season === "All Time") {

//     } else {
//         const foundSeasonLeague = legacyLeague.find(league => league.season === season) || Constants.initLegacyLeague[0];

//         const allPostSeasonRostersStats = foundSeasonLeague.rosters.map(roster => {
//             return getRosterPostSeasonStats(roster.roster_id, legacyLeague, foundSeasonLeague.season);
//         });

//         const playoffLabel = allPostSeasonRostersStats.map(roster => {
//             const foundPlayoffMatches = foundSeasonLeague.brackets.playoffs.filter((game) => game.t1 === roster.roster_id || game.t2 === roster.roster_id);
//             let placement: number = 0;
//             if (foundPlayoffMatches.filter(game => game.r === 3 && game.p === 1 && game.w === roster.roster_id).length > 0) {
//                 placement = 1;
//             } else if (foundPlayoffMatches.filter(game => game.r === 3 && game.p === 1 && game.l === roster.roster_id).length > 0) {
//                 placement = 2;
//             } else if (foundPlayoffMatches.filter(game => game.r === 3 && game.p !== 1 && game.w === roster.roster_id).length > 0) {
//                 placement = 3;
//             } else if (foundPlayoffMatches.filter(game => game.r === 3 && game.p !== 1 && game.l === roster.roster_id).length > 0) {
//                 placement = 4;
//             } else if (foundPlayoffMatches.filter(game => game.r === 2 && game.w === roster.roster_id).length > 0) {
//                 placement = 5;
//             } else if (foundPlayoffMatches.filter(game => game.r === 2 && game.l === roster.roster_id).length > 0) {
//                 placement = 6;
//             }
//             return {
//                 ...roster,
//                 playoff_rank: placement
//             };
//         })

//         return {
//             rosters: playoffLabel
//         };
//     };
// };