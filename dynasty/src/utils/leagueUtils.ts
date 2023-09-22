import * as Interfaces from "../interfaces";

export const findLeague = (leagueID: string, legacyLeague: Interfaces.League[]) => {
    return legacyLeague.find(league => league.league_id === leagueID);
};