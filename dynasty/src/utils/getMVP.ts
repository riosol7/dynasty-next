import * as Interfaces from "@/interfaces";
import * as Constants from "@/constants";
import { totalFantasyPointsByRoster } from ".";

export const getMVP = (legacyLeague: Interfaces.League[], roster: Interfaces.Roster, fantasyMarket: string, mvpType: string): Interfaces.Player => {
    try {
        if (mvpType === "Dynasty") {
            const topPlayers = (roster.players as Interfaces.Player[]).sort((a, b) => {
                const aValue = (a[fantasyMarket as keyof Interfaces.Player] as Interfaces.MarketContent)?.value;
                const bValue = (b[fantasyMarket as keyof Interfaces.Player] as Interfaces.MarketContent)?.value;
            
                const aValueParsed = typeof aValue === 'string' ? parseInt(aValue) : aValue as number;
                const bValueParsed = typeof bValue === 'string' ? parseInt(bValue) : bValue as number;
        
                return (isNaN(bValueParsed) ? 0 : bValueParsed) - (isNaN(aValueParsed) ? 0 : aValueParsed);
            });

            return topPlayers[0];
        } else if (mvpType === "Fantasy") {
            const playerScores = (roster.players as Interfaces.Player[]).map(player => {
                const points = totalFantasyPointsByRoster(legacyLeague, roster.roster_id, player.player_id);
                
                return {
                    ...player,
                    fpts: points.fpts
                }
            }).sort((a, b) => b.fpts - a.fpts);
            
            return playerScores[0];
        
        } else {
            return Constants.initPlayer;
        }

    } catch (error) {
        console.error("Error:", error);
        return Constants.initPlayer;
    };
};