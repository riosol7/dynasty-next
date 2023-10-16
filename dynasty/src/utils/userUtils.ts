import * as Interfaces from "@/interfaces";
import * as Constants from "@/constants";
import { findRosterByRosterID } from ".";

export const findUserByName = (name: string, league: Interfaces.League): Interfaces.Owner => {
    const foundOwner = league.users?.find(user => user.display_name === name);
    
    if (!foundOwner) {
        return Constants.initOwner;
    };
    
    return foundOwner;
};

export const findUserByOwnerID = (id: string, users: Interfaces.Owner[]): Interfaces.Owner => {
    const foundOwner = users.find(user => user.user_id === id);
    
    if (!foundOwner) {
        return Constants.initOwner;
    };
    
    return foundOwner;
};

export const findUserEXP = (uID: string, legacyLeague: Interfaces.League[]) => {
    const foundYearsOfExp = legacyLeague.filter(league => league.users.find(user => user.user_id === uID));
    return foundYearsOfExp.length;
};

export const findUserByRosterID = (rID: number, league: Interfaces.League): Interfaces.Owner => {
    const foundRoster = findRosterByRosterID(rID, league.rosters);
    const foundUser = findUserByOwnerID(foundRoster.owner_id, league.users);

    if (!foundUser) {
        return Constants.initOwner;
    };

    return foundUser;
};

export const findUserByPlayerID = (pID: string, league: Interfaces.League): Interfaces.Owner => {
    const owners = league.users;
    const foundRoster = league.rosters.find(roster => roster.players.find(player => player === pID));
    const foundUser = owners.find(owner => owner.user_id === foundRoster?.owner_id);
    
    return foundUser || Constants.initOwner;
};