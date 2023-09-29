import * as Interfaces from "@/interfaces";
import * as Constants from "@/constants";
import { findLeagueByID, getMatchups, roundToHundredth, winPCT } from "..";
import { match } from "assert";

export const getAllTimeStats = (rID: number, legacyLeague: Interfaces.League[]) => {

    const legacyRosters = legacyLeague.map(league => league.rosters.find(roster => roster.roster_id === rID));
 
    const legacyMatches: Interfaces.Match[][] = legacyLeague.map(league => league.matchups
        .map(matches => matches.find(team => team.roster_id === rID))
        .filter(match => match !== undefined && match.matchup_id !== null) // Filter out undefined values
        .map(match => match as Interfaces.Match) // Type assertion to Match
    );
    
    const allTimeRegularSeasonWins = legacyRosters.reduce((acc, item: any) => acc + item?.settings?.wins, 0);
    const allTimeRegularSeasonLosses = legacyRosters.reduce((acc, item: any) => acc + item?.settings?.losses, 0);
    const allTimeRegularSeasonTies = legacyRosters.reduce((acc, item: any) => acc + item?.settings?.ties, 0);
    const allTimeRegularSeasonFPTS = roundToHundredth(legacyRosters?.reduce((acc, item: any) =>  acc + Number(item?.settings?.fpts + "." + item?.settings?.fpts_decimal), 0));
    const allTimeRegularSeasonPPTS = roundToHundredth(legacyRosters?.reduce((acc, item: any) =>  acc + Number(item?.settings?.ppts + "." + item?.settings?.ppts_decimal), 0));
    const allTimeRegularSeasonPA = roundToHundredth(legacyRosters?.reduce((acc, item: any) =>  acc + Number(item?.settings?.fpts_against + "." + item?.settings?.fpts_against_decimal), 0));
    const bestRoster = legacyRosters?.sort((a: any, b: any) => b.settings.wins - a.settings.wins)[0];
    const bestSeasonStats = bestRoster?.settings;
    const bestScore = legacyMatches?.map(match => match.sort((a, b) => b?.points - a?.points)[0]).sort((a,b) => b?.points - a?.points)[0]?.points;
    const bestSeason = findLeagueByID(bestRoster?.league_id || "", legacyLeague)?.season;

    // Post Season
    const toiletBowls: number = legacyLeague.map(league => { 
        let toiletBowl = 0;

        const bracket = league.brackets.toiletBowl.filter(match => match.t1 === rID || match.t2 === rID);
        
        if ((bracket.length === 3 && bracket[1].w === rID && bracket[2].w === rID)
        || (bracket.length === 2 && bracket[0].w === rID && bracket[1].w === rID)) {
            toiletBowl ++;
        };
        return toiletBowl;
    
    }).reduce((a, b) => {return +a + +b});
        
    const playoffRuns: Interfaces.PlayoffRuns[] = legacyLeague.map(league => {
        const playoffBracket = league.brackets.playoffs.filter(match => match.t1 === rID || match.t2 === rID);
        
        if (playoffBracket.length > 0) {
            const weeklyScore = getMatchups(rID, league.matchups);
    
            return {
                bracket: playoffBracket,
                season: league.season,
                games: Number(league.season) > 2020 ? weeklyScore?.slice(14,17) : weeklyScore?.slice(13,16)
            };
        }
    
        return {
            bracket: [],
            season: league.season,
            games: undefined,
        };
    }).filter((playoffSeason): playoffSeason is Interfaces.PlayoffRuns => playoffSeason.games !== undefined);    

    const finalsRecord = () => {
        const legacyFinalsRecord = playoffRuns?.map(season => {
            let wins: number = 0;
            let losses: number = 0;

            if ((season?.bracket.length === 3 && season.bracket[1].w === rID && season.bracket[2].w === rID) 
            || (season?.bracket.length === 2 && season.bracket[0].w === rID && season.bracket[1].w === rID)) {
                wins ++
            } else if ((season?.bracket.length === 3 && season.bracket[1].w === rID && season.bracket[2].l === rID) 
            || (season?.bracket.length === 2 && season.bracket[0].w === rID && season.bracket[1].l === rID)) {
                losses ++
            };
            
            return {
                wins: wins,
                losses: losses
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
    const totalPlayoffFPTS = roundToHundredth(playoffAppearances > 0 ? playoffRuns.map((season) => season?.games.map((game) => game.filter((team) => team.roster_id === rID)[0]).map((team: Interfaces.Match) => team && team.points).reduce((a, b) => {return +a + +b})).reduce((a, b) => {return +a + +b}): 0);
    const totalPlayoffPPTS = 0;
    const totalPlayoffPA = roundToHundredth(playoffAppearances > 0 ? playoffRuns.map((season) => season?.games.map((game) => game.filter(team => team.roster_id !== rID)[0]).map(team => team && team.points).reduce((a,b) => {return +a + +b})).reduce((a,b) => {return +a + +b}): 0)
    const highestPlayoffScore = roundToHundredth(playoffAppearances > 0 ? playoffRuns.map(season => season.games.map(game => game.filter(team => team.roster_id === rID)[0]).map(team => team && team.points).sort((a,b) => b - a)[0]).sort((a,b) => b - a)[0] : 0);
    const totalPlayoffGames = playoffAppearances > 0 ? playoffRuns?.map(season => season.bracket.length).reduce((a,b) => {return +a + +b}) : 0;
    const allTimePlayoffWins = playoffRuns?.map(season => season.bracket.filter(match => match.w === rID))?.map(szn => szn.length).reduce((acc, n) => acc + n, 0) || 0; 
    const allTimePlayoffLosses = playoffRuns?.map(season => season.bracket.filter(match => match.l === rID))?.map(szn => szn.length).reduce((acc, n) => acc + n, 0) || 0;
    
    // Top Scoring Players 
    const topScorerList = legacyLeague.slice().map((league) => {
        const addedWeekLabel = league.matchups.map((matchup, i) => { return {...matchup.find(team => team.roster_id === rID), week: i + 1 } } ).filter(matchup => matchup.matchup_id !== null);
        const topPlayerScorerList = addedWeekLabel.sort((a: any, b: any) => Math.max(...b.starters_points) - Math.max(...a.starters_points)).map((match) => {
            const startersPoints = match.starters_points!;
            const highestStarterIndex = startersPoints?.indexOf(Math.max(...startersPoints!));
            const highestStarterPoints = startersPoints[highestStarterIndex!];
            const highestStarter = match?.starters![highestStarterIndex!];
            
            return {
                season: league.season,
                week: match.week,
                player_id: highestStarter,
                points: highestStarterPoints
            };
        }); 
        return topPlayerScorerList;
    }).flat().sort((a, b) => b.points - a.points);

    return {    
        best: {
            record: `${bestSeasonStats?.wins}-${bestSeasonStats?.losses}`,
            score: bestScore,
            season: bestSeason,
            winRate: winPCT(bestSeasonStats?.wins || 0, bestSeasonStats?.losses || 0),
        },
        winRate: roundToHundredth(((allTimeRegularSeasonWins)/(allTimeRegularSeasonWins + allTimeRegularSeasonLosses))*100),
        wins: allTimeRegularSeasonWins,
        losses: allTimeRegularSeasonLosses,
        ties: allTimeRegularSeasonTies,
        fpts: allTimeRegularSeasonFPTS,
        ppts: allTimeRegularSeasonPPTS,
        pa: allTimeRegularSeasonPA,
        playoffs: {
            appearances: playoffAppearances,
            wins: allTimePlayoffWins,
            losses: allTimePlayoffLosses,
            totalGames: totalPlayoffGames,
            fpts: totalPlayoffFPTS,
            ppts: totalPlayoffPPTS,
            pa: totalPlayoffPA,
            highestScore:  highestPlayoffScore,
            finals:(finalsRecord().wins + "-" + finalsRecord().losses),
        },
        toiletBowls: toiletBowls,
        topScorerList: topScorerList,
    };
};