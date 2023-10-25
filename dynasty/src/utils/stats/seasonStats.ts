import * as Interfaces from "@/interfaces";
import * as Constants from "@/constants";
import { findLeagueBySeason, getMatchups } from "..";

export const findSeasonStats = (rID: number, season: string, legacyLeague: Interfaces.League[]) => {
    const foundLeague = findLeagueBySeason(season, legacyLeague);
    if (!foundLeague) {
        return Constants.initSeasonStats;
    };

    const highesetSeasonScore = getMatchups(foundLeague.matchups, rID)?.map((matchup) => {
        const score: number = matchup.find((team: Interfaces.Match) => team.roster_id === rID).points;
        return score;
    }).sort((a, b: number) => b - a)[0];
    
    return { 
        bestScore: highesetSeasonScore
    };
};