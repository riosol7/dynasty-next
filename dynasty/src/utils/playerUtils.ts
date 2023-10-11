import * as Interfaces from "@/interfaces";
import * as Constants from "@/constants";

export const findPlayerByPts = (team: Interfaces.Match, pts: number, players: Interfaces.Player[]): Interfaces.Player => {
    let playerID: string = "";
    if ((team  !== undefined) && (pts !== undefined) ){
        Object.keys(team.players_points).reduce((acc, elem) => {
            if(team.players_points[elem] === pts){
                playerID = elem
                return playerID
            } 

            playerID = Object.keys(team.players_points).filter(key => team.players_points[key] === pts)[0]
            return playerID
        });
    };
    const foundPlayer = players.find(player => player.player_id === playerID);
    return foundPlayer || Constants.initPlayer;
};

export const findPlayerByID = (id: string, players: Interfaces.Player[]): Interfaces.Player => {
    const foundPlayer = players.find(player => player.player_id === id);
    return foundPlayer || Constants.initPlayer;
};

export const sortedFantasyMarketPlayerByPosition = (roster: Interfaces.Roster, position: string, fantasyMarket: string): Interfaces.Player[] => {
    const players = (roster?.players as Interfaces.Player[]);
    const filteredPlayers = players?.filter((player) => player.position === position)
    const sortedPlayers = filteredPlayers?.sort((a, b) => {
        const aValue: number = Number((a[fantasyMarket as keyof Interfaces.Player] as Interfaces.MarketContent).value);
        const bValue: number = Number((b[fantasyMarket as keyof Interfaces.Player] as Interfaces.MarketContent).value);
        return bValue - aValue;
    });
    if (sortedPlayers && sortedPlayers.length > 0) {
        return sortedPlayers;
    } else {
        return [Constants.initPlayer];
    };
};