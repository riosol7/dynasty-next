import * as Constants from "@/constants";
import * as Interfaces from "@/interfaces";

export const findRosterByOwnerID = (id:string, league:Interfaces.League): Interfaces.Roster => {
    const foundRoster = league.rosters?.find((roster: Interfaces.Roster) => roster.owner_id === id);

    if (!foundRoster) {
        return Constants.initRoster;
    };

    return foundRoster;
};

export const findRosterByRosterID = (id: number, rosters: Interfaces.Roster[]): Interfaces.Roster => {
    const foundRoster = rosters.find(roster => roster.roster_id === id);
    
    if (!foundRoster) {
        return Constants.initRoster;
    };

    return foundRoster;
};