import { roundToHundredth }from "./calculationUtils";
import * as Interfaces from "@/interfaces";

export const getPlayerTotalPts = (legacyLeague: Interfaces.League[], rID: number, pID: string) : { pts: number, maxPts: number } => {
    
    const pts = legacyLeague.map((league: Interfaces.League) => 
        league.matchups.map(week => week.find(team => team.roster_id === rID)?.starters.find((starter: string) => starter === pID) !== undefined ? 
            Object.entries(week.filter(team => team.roster_id === rID)[0].players_points).filter(player => player[0] === pID)[0][1] : 0
        ).reduce((partialSum: number , a: any) => partialSum + a, 0)
    ).reduce((partialSum: number , a: any) => partialSum + a, 0);

    const maxPts = legacyLeague.map((league: Interfaces.League) => league.matchups.map((week) => {
        const team = week.find((team) => team.roster_id === rID);
            if (team) {
                const playerData = Object.entries(team.players_points).find((player) => player[0] === pID);
                
                if (playerData) {
                    return playerData[1];
                };
            };
            return 0;
        })
    ).flat().reduce((total, playerPoints: any) => total + playerPoints, 0);

    return {
        pts: roundToHundredth(pts),
        maxPts: roundToHundredth(maxPts)
    };
};