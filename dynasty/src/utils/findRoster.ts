import * as Interface from "../interfaces";

export const findRosterByID = (id: Number, rosters:Array<Interface.Roster>) => {
    return rosters?.find(roster => roster.roster_id === Number(id));
};