import * as Interfaces from "../interfaces";

export const findLeague = (leagueID: string, legacyLeague: Interfaces.League[]) => {
    return legacyLeague.find(league => league.league_id === leagueID);
};

export const findRostersBySeason = (season: string, legacyLeague: Interfaces.League[]): Interfaces.Roster[] => {
    const foundLeague = legacyLeague.find(league => league.season === season);

    if (!foundLeague) {
        return [];
    };

    return foundLeague.rosters.slice().sort((a, b) => {
        if (a.settings.wins === b.settings.wins) {
            return Number(b.settings.fpts + "." + b.settings.fpts_decimal) - Number(a.settings.fpts + "." + a.settings.fpts_decimal);
        } else {
            return b.settings.wins - a.settings.wins
        };
    }).map((roster, i) => {
        const foundOwner = foundLeague.users.find(user => user.user_id === roster.owner_id);
        return {
            ...roster,
            owner: foundOwner as Interfaces.Owner,
            settings: {
                ...roster.settings,
                rank: i + 1
            }
        };
    });
};
