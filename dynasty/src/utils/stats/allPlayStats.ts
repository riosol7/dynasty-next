import * as Interfaces from "../../interfaces";
import { winPCT } from "..";

export const getPowerRankings = (season: string, legacyLeague: Interfaces.League[]) => {
    const foundSeason = legacyLeague.find(league => league.season === season);

    return foundSeason?.rosters.map(roster => {
        const ap_wins = getAllPlayStats(roster.roster_id, season, legacyLeague).wins;
        const ap_losses = getAllPlayStats(roster.roster_id, season, legacyLeague).losses;

        return {
            ...roster, settings : {
                ...roster.settings, 
                all_play_wins: ap_wins,
                all_play_losses: ap_losses,
                all_play_rate: winPCT(ap_wins, ap_losses),
            }
        };
    }).slice().sort((a, b) => b.settings.all_play_rate - a.settings.all_play_rate).map((roster, i) => {return {...roster, power_rank: i +1}});
};

export const getAllPlayStats = (rID: number, season: string, legacyLeague: Interfaces.League[]) => {
    const historicalRecord: { wins: number; losses: number; opponentID: number; }[] = [];
    const seasonalRecord: { wins: number; losses: number; opponentID: number; }[] = [];
    const weeklyRecord: { wins: number; losses: number; opponentID: number; }[][] = [];

    if (season === "All Time") {

        const legacyMatches = legacyLeague.map(league => 
            Number(league.season) > 2020 ?
                league.matchups.slice(0, 14)
            :
                league.matchups.slice(0, 13)
        );

        legacyMatches.map(season => season.map(matches => {
            const myMatchupInfo: Interfaces.Match = matches.find(match => match.roster_id === rID) || Interfaces.initialMatch;
            let wins = 0;
            let losses = 0;
            let opponentID = 0;

            matches.filter(match => match.roster_id !== rID).map(opponent => {
                
                if (myMatchupInfo.points === 0 && opponent.points === 0) {
                    wins = 0;
                    losses = 0;
                    opponentID = opponent.roster_id;
                } else if (myMatchupInfo.points > opponent.points) {
                    wins = +1;
                    losses = 0;
                    opponentID = opponent.roster_id;
                } else {
                    losses = +1;
                    wins = 0;
                    opponentID = opponent.roster_id;
                };
                
                let obj = historicalRecord.find(user => user.opponentID === opponentID) || false;
                
                if (obj) {
                    obj.wins = obj.wins + wins
                    obj.losses = obj.losses + losses
                } else {
                    historicalRecord.push({
                        wins: wins,
                        losses: losses,
                        opponentID: opponentID
                    })
                };
            });
        }));


    } else {

        const matches = legacyLeague.filter(league => league.season === season).map(league => 
            Number(league.season) > 2020 ?
                league.matchups.slice(0, 14)
            :
                league.matchups.slice(0, 13)
        )[0];

        matches?.map(match => {
            const myMatchupInfo: Interfaces.Match = match.find(user => user.roster_id === rID) || Interfaces.initialMatch;
            let wins = 0;
            let losses = 0;
            let opponentID = 0;

            weeklyRecord.push(match.filter(user => user.roster_id !== rID).map(opponent => {
                
                if (myMatchupInfo?.points === 0 && opponent.points === 0) {
                    wins = 0;
                    losses = 0;
                    opponentID = opponent.roster_id;
                } else if (myMatchupInfo?.points > opponent.points) {
                    wins = +1;
                    losses = 0;
                    opponentID = opponent.roster_id;
                } else {
                    losses = +1;
                    wins = 0;
                    opponentID = opponent.roster_id;
                };
                
                let obj = seasonalRecord.find(user => user.opponentID === opponentID) || false;
                
                if (obj) {
                    obj.wins = obj.wins + wins;
                    obj.losses = obj.losses + losses;
                } else {
                    seasonalRecord.push({
                        wins: wins,
                        losses: losses,
                        opponentID: opponentID
                    });
                };
                
                return {
                    wins: wins,
                    losses: losses,
                    opponentID: opponentID
                };
            }));
        });
    };
      
    const stats = season === "All Time" ? {
        opponents: historicalRecord.sort((a,b) =>  b.wins - a.wins).map((user, idx) => ({...user, rank: idx + 1})),
        wins: historicalRecord.reduce((prev, current) => {return { wins: prev.wins + current.wins, losses: prev.losses + current.losses };}, { wins: 0, losses: 0 }).wins || 0,
        losses: historicalRecord.reduce((prev, current) => {return { wins: prev.wins + current.wins, losses: prev.losses + current.losses };}, { wins: 0, losses: 0 }).losses || 0,
    } : {
        weeklyRecord: weeklyRecord.map((week) => week.reduce((prev, current) => { 
            return { wins: prev.wins + current.wins, losses: prev.losses + current.losses };}, { wins: 0, losses: 0 }
        )),
        opponents: seasonalRecord.sort((a,b) =>  b.wins - a.wins).map((user, idx) => ({...user, rank: idx + 1})),
        wins: seasonalRecord.reduce((prev, current) => {return { wins: prev.wins + current.wins, losses: prev.losses + current.losses };}, { wins: 0, losses: 0 }).wins || 0,
        losses: seasonalRecord.reduce((prev, current) => {return { wins: prev.wins + current.wins, losses: prev.losses + current.losses };}, { wins: 0, losses: 0 }).losses || 0,
    };

    return stats;
};