import * as Interfaces from "../../interfaces";
import { roundToHundredth } from "..";

const getPostSeasonStats = (rID: number, legacyLeague: Interfaces.League[], season: string) => {

    const playoffBracket = [];
    let playoffAppearance;
    let playoffPF = 0;
    let playoffPA = 0;
    let playoffHighestScore = 0;
    let playoffWins = 0;
    let playoffLosses = 0;
    
    if (season !== "All Time") {
        
        const foundSeasonLeague = legacyLeague.find(league => league.season === season);        
        const weeklyScore = getMatchups(rID, foundSeasonLeague?.matchups)[0];
        const sliceStart = Number(season) > 2020 ? 14 : 13;
        const sliceEnd = playoffBracket?.length === 3 ? sliceStart + 3 : sliceStart + 2;

        const userScores = weeklyScore?.slice(sliceStart, sliceEnd)
            .map(m => m.filter(t => t.roster_id === rID)[0])
            .map(a => a && a.points);

        const opponentScores = weeklyScore?.slice(sliceStart, sliceEnd)
            .map(m => m.filter(t => t.roster_id !== rID)[0])
            .map(a => a && a.points);

        playoffBracket.push(foundSeasonLeague?.brackets.playoffs.filter(m => m.t2 === rID || m.t1 === rID)[0]);

        if (playoffBracket?.length === 0) {
            playoffHighestScore = 0;
            playoffPF = 0;
            playoffPA = 0;
        
        } else if (Array.isArray(userScores) && userScores.length > 0) {
            playoffHighestScore = roundToHundredth(Math.max(...userScores));
            playoffPF = roundToHundredth(userScores?.reduce((a, b) => +a + +b));
            playoffPA = roundToHundredth(opponentScores?.reduce((a, b) => +a + +b));
            playoffAppearance = playoffBracket?.length > 0 ? true : false;
            playoffWins = playoffBracket?.filter(m => m.w === rID)?.length;
            playoffLosses = playoffBracket?.filter(m => m.l === rID)?.length;
        
        };
    };


    // ALL TIME
    const allTimeStats = () => {
        const toiletBowls = legacyLeague.map(league => { 
            let toiletBowl = 0;

            const bracket = league.brackets.toiletBowl.filter(match => match.t1 === rID || match.t2 === rID);
            if (bracket.length === 3) {
                if (bracket[1].w === rID && bracket[2].w === rID) {
                    toiletBowl ++;
                };
            } else if (bracket.length === 2) {
                if (bracket[0].w === rID && bracket[1].w === rID){
                    toiletBowl ++;
                };
            };
            return toiletBowl;
        }).reduce((a, b) => {return +a + +b});
        
        const playoffRuns = legacyLeague.map(league => {
            const playoffBracket = league.brackets.playoffs.filter(match => match.t1 === rID || match.t2 === rID);
            
            if (playoffBracket.length > 0) {
                const weeklyScore =  getMatchups(rID, league.matchups);

                // export const getMatchups = (id, matchups) => {
                //     return Object.entries(matchups).map(g => g[1]).map(wk => wk.reduce((acc,team) => {
                //         acc[team.matchup_id] = acc[team.matchup_id] || [];
                //         acc[team.matchup_id].push(team);
                //         return acc;
                //     }, Object.create(null))).map(match => Object.entries(match).map(game => game[1])).map(matchup => matchup.reduce((acc,team) => {
                //         if(team.filter(owner => owner.roster_id === Number(id)).length > 0){
                //             return team;
                //         }  
                //         return acc;
                //     })).map(match => match.sort((a,b) => b.points - a.points)).filter(game => game.length === 2);
                // };

                return {
                    bracket: playoffBracket,
                    season: season,
                    games: Number(season) > 2020 ?
                        weeklyScore.slice(14,17)
                    :
                        weeklyScore.slice(13,16) 
                };
            };
            return null;
        }).filter(y => y !== null);

        const finalsRecord = () => {
            let legacyFinalsRecord = playoffRuns?.map(season => {
                let w = 0;
                let l = 0;

                if (season?.bracket.length === 3) {
                    if (season.bracket[1].w === rID && season.bracket[2].w === rID) {
                        w++
                    } else if (season.bracket[1].w === rID && season.bracket[2].l === rID) {
                        l++
                    };
                } else if (season?.bracket.length === 2) {
                    if (season.bracket[0].w === rID && season.bracket[1].w === rID) {
                        w++
                    } else if (season.bracket[0].w === rID && season.bracket[1].l === rID) {
                        l++
                    };
                };
                return {
                    w:w,
                    l:l
                };
            }).reduce((accumulator:any, currentValue:any) => {
                for (const key in currentValue) {
                    if (accumulator.hasOwnProperty(key)) {
                        accumulator[key] += currentValue[key];
                    } else {
                        accumulator[key] = currentValue[key];
                    }
                }
                return accumulator;
            }, {});

            return legacyFinalsRecord;
        };

        const playoffAppearances = playoffRuns?.length;            
        const totalPlayoffFPTS = roundToHundredth(playoffRuns?.length > 0 ? playoffRuns.map(season => season?.games.map((game) => game.filter((team: Interfaces.Roster) => team.roster_id === rID)[0]).map((team: Interfaces.Match) => team && team.points).reduce((a, b) => {return +a + +b})).reduce((a, b) => {return +a + +b}): 0);
        const totalPlayoffPPTS = 0;
        const totalPlayoffPA = roundToHundredth(playoffRuns?.length > 0 ? playoffRuns.map(m => m.games.map(g => g.filter(t => t.roster_id !== Number(id))[0]).map(a => a && a.points).reduce((a,b) => {return +a + +b})).reduce((a,b) => {return +a + +b}): 0)
        
        const highestPlayoffScore = roundToHundredth(playoffRuns?.length > 0 ? playoffRuns.map(m => m.games.map(g => g.filter(t => t.roster_id === Number(id))[0]).map(a => a && a.points).sort((a,b) => b - a)[0]).sort((a,b) => b - a)[0] : 0) > inSeasonPlayoffHighestScore ?
        playoffRuns.map(m => m.games.map(g => g.filter(t => t.roster_id === Number(id))[0]).map(a => a && a.points).sort((a,b) => b - a)[0]).sort((a,b) => b - a)[0] : inSeasonPlayoffHighestScore
        const totalPlayoffGames = playoffRuns?.length > 0 ? playoffRuns?.map(s => s.bracket.length).reduce((a,b) => {return +a + +b}) : 0 + inSeasonPlayoffBracket?.length;
        const allTimePlayoffWins = (playoffRuns?.map(szn => szn.bracket.filter(match => match.w === Number(id)))?.map(szn => szn.length).reduce((acc, n) => acc + n, 0) || 0) + inSeasonPlayoffWins; 
        const allTimePlayoffLosses = (playoffRuns?.map(szn => szn.bracket.filter(match => match.l === Number(id)))?.map(szn => szn.length).reduce((acc, n) => acc + n, 0) || 0) + inSeasonPlayoffLosses;
        return {
            appearances: playoffAppearances,
            pf: totalPlayoffPF,
            pa: totalPlayoffPA,
            highestScore: highestPlayoffScore,
            totalGames: totalPlayoffGames,
            finals: {
                w: finalsRecord()?.w,
                l: finalsRecord()?.l,
            },
            wins: allTimePlayoffWins,
            losses: allTimePlayoffLosses,
            toiletBowls: toiletBowls,
        };
    }
    const postSeasonStats = 
        year === "All Time" ? allTimeStats() 
        : year === league.season ? {
            appearance: inSeasonPlayoffAppearance,
            bracket: inSeasonPlayoffBracket,
            pf: inSeasonPlayoffPF,
            pa: inSeasonPlayoffPA,
            highestScore: inSeasonPlayoffHighestScore,
            losses: inSeasonPlayoffLosses,
            totalGames: inSeasonPlayoffBracket?.length || 0,
            wins: inSeasonPlayoffWins,
        } : {
            appearance: playoffAppearance,
            bracket: playoffBracket,
            pf: playoffPF,
            pa: playoffPA,
            highestScore: playoffHighestScore,
            losses: playoffLosses,
            totalGames: playoffBracket?.length || 0,
            wins: playoffWins,
        };
    return postSeasonStats;
};

export default getPostSeasonStats;