import * as Interfaces from "../interfaces";

export const findUserEXP = (uID: string, legacyLeague: Interfaces.League[]) => {
    const foundYearsOfExp = legacyLeague.filter(league => league.users.find(user => user.user_id === uID))
    return foundYearsOfExp.length;
}