import * as Interfaces from "@/interfaces";

export const findLeagueByID = (leagueID: string, legacyLeague: Interfaces.League[]): Interfaces.League => {
    const foundLeague = legacyLeague.find(league => league.league_id === leagueID);
    
    if (!foundLeague) {
        return Interfaces.defaultLegacyLeague[0];
    };

    return foundLeague;
};

export const findLeagueBySeason = (season: string, legacyLeague: Interfaces.League[]): Interfaces.League => {
    const foundLeague = legacyLeague.find(league => league.season === season);

    if (!foundLeague) {
        return Interfaces.defaultLegacyLeague[0];
    };

    const updatedRosters = foundLeague.rosters.slice().sort((a, b) => {
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

    return {
        ...foundLeague,
        rosters: updatedRosters
    };
};

export const findLeagueByTeamName = (name: string, legacyLeague: Interfaces.League[]) => {
    const foundLeague = legacyLeague.find(league => league.users.find(user => user.display_name === name));
    
    if (!foundLeague) {
        return Interfaces.defaultLegacyLeague[0];
    };

    const sortedRosters = foundLeague.rosters.slice().sort((a, b) => {
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

    return {
        ...foundLeague,
        rosters: sortedRosters
    };
};