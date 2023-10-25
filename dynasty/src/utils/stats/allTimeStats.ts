import * as Interfaces from "@/interfaces";
import * as Constants from "@/constants";
import { findLeagueByID, getMatchups, roundToHundredth, winPCT } from "..";

export const overallHighScoreRanking = (pts: number, list: Interfaces.HighScoreRecord[]) => {
    const foundRecord = list.find((record) => record.points === pts);
    return foundRecord;
};

export const getAllTimeRosterStats = (rID: number, legacyLeague: Interfaces.League[]) => {
    const legacyRosters = legacyLeague.map(league => league.rosters.find(roster => roster.roster_id === rID));
 
    const legacyMatches: Interfaces.Match[][] = legacyLeague.map(league => league.matchups
        .map(matches => matches.find(team => team.roster_id === rID))
        .filter(match => match !== undefined && match.matchup_id !== null)
        .map(match => match as Interfaces.Match)
    );
    
    const seasonalStreaks = legacyLeague.map(league => {
        const matchups = getMatchups(league.matchups, rID);
        let winStreak: number = 0;
        let losingStreak: number = 0;
        let longestWinStreak: number = 0;
        let longestLosingStreak: number = 0;

        matchups?.forEach(matchup => {
            const opponent = matchup.find((team: Interfaces.Match) => team.roster_id !== rID);
            const myTeam = matchup.find((team: Interfaces.Match) => team.roster_id === rID);
            
            if (myTeam?.points > opponent?.points) {
                if (losingStreak > longestLosingStreak) {
                    longestLosingStreak = losingStreak;
                };
                winStreak ++;
                losingStreak = 0;
            } else if (myTeam?.points < opponent?.points) {
                if (winStreak > longestWinStreak) {
                    longestWinStreak = winStreak;
                };
                losingStreak ++;
                winStreak = 0;
            };
        });
        return {
            losses: longestLosingStreak,
            wins: longestWinStreak,
            season: league.season,
        };
    });
    
    const allTimeRegularSeasonWins = legacyRosters.reduce((acc, item: any) => acc + item?.settings?.wins, 0);
    const allTimeRegularSeasonLosses = legacyRosters.reduce((acc, item: any) => acc + item?.settings?.losses, 0);
    const allTimeRegularSeasonTies = legacyRosters.reduce((acc, item: any) => acc + item?.settings?.ties, 0);
    const allTimeRegularSeasonFPTS = roundToHundredth(legacyRosters?.reduce((acc, item: any) =>  acc + Number(item?.settings?.fpts + "." + item?.settings?.fpts_decimal), 0));
    const allTimeRegularSeasonPPTS = roundToHundredth(legacyRosters?.reduce((acc, item: any) =>  acc + Number(item?.settings?.ppts + "." + item?.settings?.ppts_decimal), 0));
    const allTimeRegularSeasonPA = roundToHundredth(legacyRosters?.reduce((acc, item: any) =>  acc + Number(item?.settings?.fpts_against + "." + item?.settings?.fpts_against_decimal), 0));
    const bestRosterByWins = legacyRosters?.sort((a: any, b: any) => b.settings.wins - a.settings.wins)[0];
    const bestRosterByFPTS = legacyRosters?.sort((a: any, b: any) => Number(b.settings.fpts + "." + b.settings.fpts_decimal) - Number(a.settings.fpts + "." + a.settings.fpts_decimal))[0];
    const bestRosterByPPTS = legacyRosters?.sort((a: any, b: any) => Number(b.settings.ppts + "." + b.settings.ppts_decimal) - Number(a.settings.ppts + "." + a.settings.ppts_decimal))[0];
    const bestRosterByPA = legacyRosters?.sort((a: any, b: any) => Number(b.settings.pa + "." + b.settings.pa) - Number(a.settings.pa + "." + a.settings.pa))[0];

    const bestSeasonByWinsStats = bestRosterByWins?.settings;
    const bestScore = legacyMatches?.map(match => match.sort((a, b) => b?.points - a?.points)[0]).sort((a,b) => b?.points - a?.points)[0]?.points;
    const bestSeasonByWins = findLeagueByID(bestRosterByWins?.league_id || "", legacyLeague)?.season;
    const bestSeasonByFPTS = findLeagueByID(bestRosterByFPTS?.league_id || "", legacyLeague)?.season;
    const bestSeasonByPPTS = findLeagueByID(bestRosterByPPTS?.league_id || "", legacyLeague)?.season;
    const bestSeasonByPA = findLeagueByID(bestRosterByPA?.league_id || "", legacyLeague)?.season;

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
            const weeklyScore = getMatchups(league.matchups, rID);
            return {
                bracket: playoffBracket,
                season: league.season,
                games: Number(league.season) > 2020 ? weeklyScore?.slice(14,17) : weeklyScore?.slice(13,16)
            };
        };
        return {
            bracket: [],
            season: league.season,
            games: undefined,
        };
    }).filter((playoffSeason): playoffSeason is Interfaces.PlayoffRuns => playoffSeason.games !== undefined); 
    
      
    function calculatePlayoffStreak(data: any) {
    let currentStreak = 0;
    let maxStreak = 0;
    
    for (let i = 0; i < data.length; i++) {
        const currentYear = parseInt(data[i].season);
    
        // If it's the first season or there's a gap in playoff appearances, reset the streak
        if (i === 0 || currentYear - parseInt(data[i - 1].season) > 1) {
        currentStreak = 1;
        } else {
        currentStreak++;
        }
    
        maxStreak = Math.max(maxStreak, currentStreak);
    }
    
    return maxStreak;
    }

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
    const topPlayerScores = legacyLeague.slice().map((league) => {
        const addedWeekLabel = league.matchups.map((matchup: Interfaces.Match[], i) => { return {...matchup.find(team => team.roster_id === rID), week: i + 1 } } ).filter(matchup => matchup.matchup_id !== null);
        const topPlayerScorerList = addedWeekLabel.sort((a, b) => {
            const aMatch = a as Interfaces.Match;
            const bMatch = b as Interfaces.Match;
          
            const aStartersPoints = aMatch.starters_points || [];
            const bStartersPoints = bMatch.starters_points || [];
          
            const maxA = Math.max(...aStartersPoints);
            const maxB = Math.max(...bStartersPoints);
          
            return maxB - maxA;
          }).map((match) => {
            const startersPoints = (match as Interfaces.Match).starters_points || [];
            const highestStarterIndex = startersPoints.indexOf(Math.max(...startersPoints));
            const highestStarterPoints = startersPoints[highestStarterIndex];
            const highestStarter = (match as Interfaces.Match).starters && (match as Interfaces.Match).starters[highestStarterIndex];
          
            return {
                roster_id: match.roster_id,
                season: league.season,
                week: match.week,
                starter: highestStarter,
                points: highestStarterPoints,
            };
        });
        return topPlayerScorerList;
    }).flat().sort((a, b) => b.points - a.points).map((record, i)=> { return {...record, rank: i + 1}});

    const topTeamScores: Interfaces.HighScoreRecord[] = legacyLeague.slice().map(league => {
        const myMatches = league.matchups.map((matchup, i) => {
            const myTeam = matchup.find(match => match.roster_id === rID);
            const opponent = matchup.find(match => match.roster_id !== rID && myTeam?.matchup_id === match.matchup_id);
            return {
                roster_id: myTeam?.roster_id,
                points: myTeam?.points || 0,
                opponent_rID: opponent?.roster_id,
                opponent_points: opponent?.points || 0,
                season: league.season,
                week: i + 1
            };
        });
        return myMatches;
    }).flat().sort((a, b) => b?.points! - a?.points!).map((record, i)=> { return {...record, rank: i + 1}});

    const longestWinStreak = seasonalStreaks.reduce((max, current) => (current.wins > max.wins ? current : max), seasonalStreaks[0]);
    const longestLosingStreak = seasonalStreaks.reduce((max, current) => (current.losses > max.losses ? current : max), seasonalStreaks[0]);

    return {    
        best: {
            wins: { 
                score: bestSeasonByWinsStats?.wins,
                season: bestSeasonByWins,
            },
            losses: bestSeasonByWinsStats?.losses,
            fpts: { 
                score: Number(bestRosterByFPTS?.settings.fpts + "." + bestRosterByFPTS?.settings.fpts_decimal),
                season: bestSeasonByFPTS,
            },
            ppts: { 
                score: Number(bestRosterByFPTS?.settings.ppts + "." + bestRosterByFPTS?.settings.ppts_decimal),
                season: bestSeasonByPPTS,
            },
            pa: { 
                score: Number(bestRosterByPA?.settings.fpts_against + "." + bestRosterByPA?.settings.fpts_against_decimal),
                season: bestSeasonByPA,
            },
            record: `${bestSeasonByWinsStats?.wins}-${bestSeasonByWinsStats?.losses}`,
            score: bestScore,
            winRate: winPCT(bestSeasonByWinsStats?.wins || 0, bestSeasonByWinsStats?.losses || 0),
        },
        winStreak: longestWinStreak,
        losingStreak: longestLosingStreak,
        winRate: roundToHundredth(((allTimeRegularSeasonWins)/(allTimeRegularSeasonWins + allTimeRegularSeasonLosses))*100),
        wins: allTimeRegularSeasonWins,
        losses: allTimeRegularSeasonLosses,
        ties: allTimeRegularSeasonTies,
        fpts: allTimeRegularSeasonFPTS,
        ppts: allTimeRegularSeasonPPTS,
        pa: allTimeRegularSeasonPA,
        playoffs: {
            appearanceStreak: calculatePlayoffStreak(playoffRuns),
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
        topPlayerScores: topPlayerScores,
        topTeamScore: topTeamScores,
    };
};

export const getAllTimeLeagueStats = (legacyLeague: Interfaces.League[]) => {
    // Top Scoring Players     
    const unsortedList = legacyLeague.slice().map((league) => {
        const recordLabels = league.matchups.map((match) => match.filter(matchup => matchup.matchup_id !== null)).filter(matchups => matchups.length > 0).map((matchups, idx) =>
            matchups.map(match => {
                const extractedData = match.starters.map((starter, index) => {
                    return {
                        roster_id: match.roster_id,
                        starter: starter,
                        points: match.starters_points[index],
                        season: league.season,
                        week: idx + 1,
                    };
                });

                return extractedData;
            })
        ).flat();
        return recordLabels.flat();
    });
    const topPlayerScorerList: Interfaces.HighScoreRecord[] = unsortedList.flat().sort((a, b) => b.points - a.points).map((_, idx) => {return {..._, rank: idx + 1}});
    
    const teamHighScores = legacyLeague.slice().map(league => {
        const myMatches = league.matchups.map((matchup, i) => {
            return matchup.map((match) => {
                return {
                    roster_id: match.roster_id,
                    points: match.points,
                    season: league.season,
                    week: i + 1
                };
            });
        });
        return myMatches.flat();
    }).flat().sort((a, b) => b?.points! - a?.points!).map((_, idx) => {return {..._, rank: idx + 1}});

    return {
        playerHighScores: topPlayerScorerList,
        teamHighScores: teamHighScores,
    };
};