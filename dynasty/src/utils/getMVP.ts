import { findRosterByID } from "./findRoster";
import * as Interface from "../interfaces";
// FIX the any type and top players to account for all fantasyMarkets
export const getMVP = async (id: Number, rosters:any) => {
    try {
        const foundTeam = await findRosterByID(id, rosters?.teamRank);
        const topPlayers = [
            foundTeam?.ktc.qb.players[0],
            foundTeam?.ktc.rb.players[0],
            foundTeam?.ktc.wr.players[0],
            foundTeam?.ktc.te.players[0]
        ];
        const topPlayer = topPlayers.reduce((prev, current) => {
            if (!prev) return current;
            if (!current) return prev;
            return prev.value > current.value ? prev : current;
        });
        return topPlayer;
    } catch (error) {
        console.error("Error:", error);
        return null;
    };
};