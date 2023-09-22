import * as Interfaces from "../../interfaces";
import { getMatchups, roundToHundredth } from "..";

export const getPostSeasonStats = (rID: number, legacyLeague: Interfaces.League[], season: string) => {

    let playoffBracket: Interfaces.BracketMatch[] = [];
    let playoffAppearance: boolean = false;
    let playoffFPTS: number = 0;
    let playoffPA: number = 0;
    let playoffHighestScore: number = 0;
    let playoffWins: number = 0;
    let playoffLosses: number = 0;
    
    const foundSeasonLeague = legacyLeague.find(league => league.season === season);        
    playoffBracket = foundSeasonLeague?.brackets?.playoffs.filter(m => m.t2 === rID || m.t1 === rID)!;
    
    const weeklyScore = getMatchups(rID, foundSeasonLeague?.matchups);
    const sliceStart = Number(season) > 2020 ? 14 : 13;
    const sliceEnd = playoffBracket?.length === 3 ? sliceStart + 3 : sliceStart + 2;

    const userScores = weeklyScore?.slice(sliceStart, sliceEnd)
        .map(matchups => matchups.filter((team: Interfaces.Match) => team.roster_id === rID)[0])
        .map(a => a.points);
    
    const opponentScores = weeklyScore?.slice(sliceStart, sliceEnd)
        .map(matchups => matchups.filter((team: Interfaces.Match) => team.roster_id !== rID)[0])
        .map(a => a.points);

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
        appearance: playoffAppearance,
        bracket: playoffBracket,
        fpts: playoffFPTS,
        pa: playoffPA,
        highestScore: playoffHighestScore,
        losses: playoffLosses,
        totalGames: playoffBracket?.length || 0,
        wins: playoffWins,
    };
};