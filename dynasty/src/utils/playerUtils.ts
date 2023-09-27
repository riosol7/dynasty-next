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