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
    console.log(players.filter(player => player.player_id === "MIA"))
    const foundPlayer = players.find(player => player.player_id === id);
    return foundPlayer || Constants.initPlayer;
};

export const sortPlayersByFantasyMarket = (players: Interfaces.Player[], fantasyMarket: string, position?: string): Interfaces.Player[] => {
    const filteredPlayers = position ? players?.filter((player) => player.position === position) : players;
    const sortedPlayers = filteredPlayers?.sort((a, b) => {
        const aValue: number = Number((a[fantasyMarket as keyof Interfaces.Player] as Interfaces.MarketContent)?.value) || 0;
        const bValue: number = Number((b[fantasyMarket as keyof Interfaces.Player] as Interfaces.MarketContent)?.value) || 0;
        return bValue - aValue;
    });
    if (sortedPlayers && sortedPlayers.length > 0) {
        return sortedPlayers;
    } else {
        return [Constants.initPlayer];
    };
};

export const convertToFeet = (heightInches: number): string => {
    const feet = Math.floor(heightInches / 12);
    const inches = heightInches % 12;
    return `${feet}'${inches}"`;
};