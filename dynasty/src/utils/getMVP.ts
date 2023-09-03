import * as Interfaces from "../interfaces";
import { findRosterByID } from "./findRoster";
// Reconfigured top players to account for all fantasyMarkets;

export const getMVP = (id: Number, rosters: Interfaces.Roster[], fantasyMarket: string): Interfaces.Player => {
    try {
        const foundTeam = findRosterByID(id, rosters)!;
        const qbFiltered = (foundTeam.players as Interfaces.Player[]).filter((player: Interfaces.Player) => player.position === "QB");
        // const qbFiltered = (foundTeam.players as Interfaces.Player[]).filter((player: Interfaces.Player) => player.position === "QB").sort((a, b) => {
        //         return (isNaN(b[fantasyMarket].value) ? 0 : parseInt(b[fantasyMarket].value)) - (isNaN(a[fantasyMarket].value) ? 0 : parseInt(a[fantasyMarket].value));
        //     });
        const rbFiltered = (foundTeam.players as Interfaces.Player[]).filter((player: Interfaces.Player) => player.position === "RB");
        const wrFiltered = (foundTeam.players as Interfaces.Player[]).filter((player: Interfaces.Player) => player.position === "WR");
        const teFiltered = (foundTeam.players as Interfaces.Player[]).filter((player: Interfaces.Player) => player.position === "TE");

        // const test = qbFiltered[fantasyMarket].

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
        return Interfaces.initialMVP;
    };
};