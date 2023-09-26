import * as Interfaces from "@/interfaces";

export const getMVP = (roster: Interfaces.Roster, fantasyMarket: string): Interfaces.Player => {
    try {
        const topPlayers = (roster.players as Interfaces.Player[]).sort((a, b) => {
            const aValue = (a[fantasyMarket as keyof Interfaces.Player] as Interfaces.MarketContent).value;
            const bValue = (b[fantasyMarket as keyof Interfaces.Player] as Interfaces.MarketContent).value;
        
            const aValueParsed = typeof aValue === 'string' ? parseInt(aValue) : aValue as number;
            const bValueParsed = typeof bValue === 'string' ? parseInt(bValue) : bValue as number;
    
            return (isNaN(bValueParsed) ? 0 : bValueParsed) - (isNaN(aValueParsed) ? 0 : aValueParsed);
        });

        return topPlayers[0];

    } catch (error) {
        console.error("Error:", error);
        return Interfaces.initialPlayer;
    };
};