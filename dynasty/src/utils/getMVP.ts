import * as Interfaces from "../interfaces";
import { findRosterByID } from "./findRoster";
// Reconfigured top players to account for all fantasyMarkets;
const initialMVP: Interfaces.Player = {
    first_name: '',
    team: '',
    position: '',
    rank: '',
    age: 0,
    birth_date: "",
    college: "",
    depth_chart_order: 0,
    espn_id: 0,
    fantasy_data_id: 0,
    full_name: "",
    height: "",
    high_school: "",
    last_name: "",
    number: 0,
    player_id: "",
    rotowire_id: 0,
    sportradar_id: "",
    weight: "",
    yahoo_id: 0,
    years_exp: 0,
    value: 0
};

export const getMVP = (id: Number, rosters:Interfaces.Roster[]): Interfaces.Player => {
    try {
        const foundTeam = findRosterByID(id, rosters)!;
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
        return initialMVP;
    };
};