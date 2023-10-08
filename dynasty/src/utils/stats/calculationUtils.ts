import * as Interfaces from "@/interfaces";
import { totalPlayerPoints } from "..";

export const isOdd = (num: number): boolean => {
    return num % 2 ! == 0;
};

export const lineupEfficiency = (pf: number, maxPF: number): number => {
    return roundToHundredth((pf / maxPF) * 100); 
};

export const roundToHundredth = (value: number): number => {
    if (typeof value === "number" && !isNaN(value)) {
        return Number(value.toFixed(2));
    
    } else return 0;
};

export const winPCT = (wins: number, losses: number): number => {
    return roundToHundredth((wins / (wins + losses)) * 100);
};

export const calculatePercentageChange = (currentValue: number, prevValue: number): number => {
    return roundToHundredth(((currentValue - prevValue) / prevValue) * 100);
};

export const calculateAverage = (sum: number, count: number) => {
    return roundToHundredth(sum/count);
};

// export const calculatePositionStats = (players: Interfaces.Player[], playerType, league, matches, rID) => {
//     const count = players.length;
//     const avgAge = roundToHundredth(players.reduce((sum, player) => sum + Number(player.age), 0) / count);
//     const totalPts = roundToHundredth(players.map((player) => totalPlayerPoints(league, matches, rID, player.player_id).pts).reduce((sum, pts) => sum + pts, 0));
//     const totalMaxPts = roundToHundredth(players.map((player) => getTotalPts(league, matches, rID, player.player_id).maxPts).reduce((sum, maxPts) => sum + maxPts, 0));
//     return {
//         count,
//         avgAge,
//         totalPts,
//         totalMaxPts,
//         primeIndicator: getPrimeIndicatorColor(avgAge, playerType.thresholds)
//     };
// };