import { findRosterByRosterID, getAllTimeRosterStats } from "..";
import { roundToHundredth }from "./calculationUtils";
import * as Interfaces from "@/interfaces";

export const totalPlayerPoints = (legacyLeague: Interfaces.League[], rID: number, pID: string) : { fpts: number, ppts: number } => {
    
    const fpts = legacyLeague.map((league: Interfaces.League) => 
        league.matchups.map(week => week.find(team => team.roster_id === rID)?.starters.find((starter: string) => starter === pID) !== undefined ? 
            Object.entries(week.filter(team => team.roster_id === rID)[0].players_points).filter(player => player[0] === pID)[0][1] : 0
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
        })
    ).flat().reduce((total, playerPoints: any) => total + playerPoints, 0);

    return {
        fpts: roundToHundredth(fpts),
        ppts: roundToHundredth(ppts)
    };
};

export const totalPointsPerGame = (rID: number, pts: number, legacyLeague: Interfaces.League[], season?: string, allTime?: boolean, playoffs?: boolean) => {
    const foundSeason = legacyLeague.find(league => league.season === season);
    const roster = findRosterByRosterID(rID, foundSeason?.rosters!);
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

export const accumulatePoints = (rID: number, players: Interfaces.Player[], legacyLeague: Interfaces.League[]) : { fpts: number, ppts: number } => {
    const fpts = players?.map((player) => totalPlayerPoints(legacyLeague, rID, player.player_id).fpts).reduce((sum, pts) => sum + pts, 0);
    const ppts = players?.map((player) => totalPlayerPoints(legacyLeague, rID, player.player_id).ppts).reduce((sum, maxPts) => sum + maxPts, 0);
    return {
        fpts: fpts,
        ppts: ppts
    };
};