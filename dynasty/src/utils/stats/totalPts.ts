import { findLeagueBySeason, findRosterByRosterID, getAllTimeRosterStats } from "..";
import { roundToHundredth }from "./calculationUtils";
import * as Interfaces from "@/interfaces";
import * as Constants from "@/constants";

export const totalFantasyPointsByRoster = (legacyLeague: Interfaces.League[], rID: number, pID: string, selectSeason?: string) : { fpts: number, ppts: number } => {
    
    if (selectSeason) {
        const season: Interfaces.League = findLeagueBySeason(selectSeason, legacyLeague);

        const fpts = season.matchups
        .map(week => week.find(team => team.roster_id === rID)?.starters
        .find((starter: string) => starter === pID) !== undefined ? 
            Object.entries(week.filter(team => team.roster_id === rID)[0].players_points)
            .filter(player => player[0] === pID)[0][1] : 0
        ).reduce((partialSum: number , a: any) => partialSum + a, 0);

        const ppts = season.matchups.map((week) => {
            const team = week.find((team) => team.roster_id === rID);
            if (team) {
                const playerData = Object.entries(team.players_points).find((player) => player[0] === pID);
                
                if (playerData) {
                    return playerData[1];
                };
            };
            return 0;
        }).reduce((total, playerPoints: any) => total + playerPoints, 0);

        return {
            fpts: roundToHundredth(fpts),
            ppts: roundToHundredth(ppts)
        };
    };

    const fpts = legacyLeague.map((league: Interfaces.League) => league.matchups
    .map(week => week.find(team => team.roster_id === rID)?.starters
    .find((starter: string) => starter === pID) !== undefined ? 
        Object.entries(week.filter(team => team.roster_id === rID)[0].players_points)
        .filter(player => player[0] === pID)[0][1] : 0
    ).reduce((partialSum: number , a: any) => partialSum + a, 0)
    ).reduce((partialSum: number , a: any) => partialSum + a, 0);

    const ppts = legacyLeague.map((league: Interfaces.League) => league.matchups.map((week) => {
        const team = week.find((team) => team.roster_id === rID);
        if (team) {
            const playerData = Object.entries(team.players_points).find((player) => player[0] === pID);
            
            if (playerData) {
                return playerData[1];
            };
        };
        return 0;
    })).flat().reduce((total, playerPoints: any) => total + playerPoints, 0);

    return {
        fpts: roundToHundredth(fpts),
        ppts: roundToHundredth(ppts)
    };
};

export const totalPointsPerGame = (rID: number, pts: number, legacyLeague: Interfaces.League[], season?: string, allTime?: boolean, playoffs?: boolean) => {
    const foundSeason  = legacyLeague.find(league => league.season === season);
    const roster       = findRosterByRosterID(rID, foundSeason?.rosters!);
    const allTimeStats = getAllTimeRosterStats(rID, legacyLeague);

    if (season === legacyLeague[0].season && roster && foundSeason) {
        return roundToHundredth(Number(pts/(roster.settings.losses + roster.settings.wins + roster.settings.ties)));
    
    } else if (playoffs) {
        const playoffMatches: number = foundSeason?.brackets.playoffs.filter(game => game.t1 === rID || game.t2 === rID).length || 0;
        return roundToHundredth(pts/playoffMatches)
    
    } else if (allTime && allTimeStats) {
        return roundToHundredth(Number(pts/(allTimeStats.wins + allTimeStats.losses)));
    
    } else if(Number(season) <= 2020) {
        return roundToHundredth(Number(pts/13));
    
    } else if(Number(season) > 2020) {
        return roundToHundredth(Number(pts/14));
    };
};

export const accumulatePoints = (rID: number, players: Interfaces.Player[], legacyLeague: Interfaces.League[], selectSeason?: string) : { fpts: number, ppts: number } => {
    if (selectSeason) {
        const fpts = roundToHundredth(players?.map((player) => totalFantasyPointsByRoster(legacyLeague, rID, player.player_id, selectSeason).fpts).reduce((sum, pts) => sum + pts, 0));
        const ppts = roundToHundredth(players?.map((player) => totalFantasyPointsByRoster(legacyLeague, rID, player.player_id, selectSeason).ppts).reduce((sum, maxPts) => sum + maxPts, 0));
        
        return {
            fpts: fpts,
            ppts: ppts
        };
    }
    const fpts = roundToHundredth(players?.map((player) => totalFantasyPointsByRoster(legacyLeague, rID, player.player_id).fpts).reduce((sum, pts) => sum + pts, 0));
    const ppts = roundToHundredth(players?.map((player) => totalFantasyPointsByRoster(legacyLeague, rID, player.player_id).ppts).reduce((sum, maxPts) => sum + maxPts, 0));
    
    return {
        fpts: fpts,
        ppts: ppts
    };
};

export const totalFantasyPointsByPlayerID = (pID: string, legacyLeague: Interfaces.League[], season: string): { fpts: number, ppts: number } => {
    const getPointsById = (playerId: string, starters: string[], starters_points: number[]) => {
        const index = starters.indexOf(playerId);
        
        if (index !== -1) {
            return starters_points[index];
        }
        return 0;
    };

    if (season !== "All Time") {
        const foundLeague = legacyLeague
        .find(league => league.season === season) || Constants.initLegacyLeague[0];
        
        const fpts = foundLeague?.matchups
        .map(match => match.map(team => getPointsById(pID, team.starters, team.starters_points))
        .filter(item => item !== 0)[0]).filter(item => item !== undefined)
        .reduce((a, b) => a + b, 0);
        
        const ppts = foundLeague.matchups.map(match => match
        .map(team => team?.players_points[pID]).filter(item => item !== undefined)[0])
        .filter(item => item !== undefined)
        .reduce((a, b) => a + b, 0);
    
        return {
            fpts: roundToHundredth(fpts),
            ppts: roundToHundredth(ppts),
        };
    } else {
        const fpts = legacyLeague.slice().map(league => league.matchups
        .map(match => match.map(team => getPointsById(pID, team.starters, team.starters_points))
        .filter(item => item !== 0)[0]).filter(item => item !== undefined))
        .reduce((accumulator, currentArray) => {
            return accumulator + currentArray.reduce((a, b) => a + b, 0);
        }, 0);
        
        const ppts = legacyLeague?.slice().map(league => league.matchups
        .map(match => match.map(team => team?.players_points[pID])
        .filter(item => item !== undefined)[0]).filter(item => item !== undefined))
        .reduce((accumulator, currentArray) => {
            return accumulator + currentArray.reduce((a, b) => a + b, 0);
        }, 0);
    
        return {
            fpts: roundToHundredth(fpts),
            ppts: roundToHundredth(ppts),
        };
    };
};