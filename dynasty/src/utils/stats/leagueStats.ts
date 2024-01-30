import * as Interfaces from "@/interfaces/League";
import { calculateAverage, findLeagueBySeason } from "..";

export const seasonStats = (season: string, legacyLeague: Interfaces.League[]) => {
    const league: Interfaces.League = findLeagueBySeason(season, legacyLeague);

    const weeklyAvgPts: number [] = league.matchups.map((item) => {
        const totalPoints = item.map((roster) => roster.starters_points.reduce((acc, points) => points + acc, 0))
        const avgPts: number = calculateAverage(totalPoints.reduce((acc, pts) => pts + acc, 0), totalPoints.length )
        return avgPts

    });
   
    return {
        weeklyAvgPts: weeklyAvgPts,
    }
    
};