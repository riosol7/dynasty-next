import { roundToHundredth }from "./calculationUtils";
import * as Interfaces from "../../interfaces";

export const getTotalPts = (league: Interfaces.League, matches: Interfaces.Match[][], rID: number, pID: string) : { pts: number, maxPts: number } => {
    let historyMaxPts: number = 0;
    let currentMaxPts: number = 0;
    let historyPts: number = 0; 
    let currentPts: number = 0;

    historyPts = league?.history?.map(legacy => 
        Object.entries(legacy.matchups).map((week: any) => week[1].filter((team: Interfaces.Match) => team.roster_id === rID)[0].starters
            .find((starter: string) => starter === pID) !== undefined 
            ? Object.entries(week[1].filter((team: Interfaces.Match) => team.roster_id === rID)[0].players_points)
                .filter(p => p[0] === pID)[0][1] 
            : 0
        ).reduce((partialSum: number, a: any) => partialSum + a, 0)
    ).reduce((partialSum: number, a: any) => partialSum + a, 0);

    currentPts = matches?.map(match => match.filter(team => team.roster_id === rID)[0]?.starters.find((starter: string) => starter === pID) !== undefined 
        ? Object.entries(match.filter(team => team.roster_id === rID)[0].players_points)
            .filter(player => player[0] === pID)[0][1]
        : 0
        ).reduce((partialSum,a) => partialSum + a, 0)

    let checkHUndefined = league?.history?.map(legacy => Object.entries(legacy.matchups)
        .map((week: any) => Object.entries(week[1].filter((team: Interfaces.Match) => team.roster_id === rID)[0].players_points)
            .filter(player => player[0] === pID)[0]).filter(team => team !== undefined)).filter(team => team.length > 0);
    
    let checkCUndefined: any[] = [];

    if (matches[0]?.length > 0) {
        checkCUndefined = matches?.map(week => Object.entries(week.filter(team => team.roster_id === rID)[0]?.players_points)
            .filter(player => player[0] === pID)[0]).filter(team => team !== undefined)
            // .filter(team => team !== [])
    }

    if (checkHUndefined && checkHUndefined[0]?.length > 0 && checkCUndefined?.length > 0) {
        historyMaxPts = checkHUndefined.map(l => l.map(a => a[1]).reduce((partialSum: number , a: any) => partialSum + a, 0)).reduce((partialSum, a) => partialSum + a, 0)
        currentMaxPts = checkCUndefined.map((a) => a[1]).reduce((partialSum,a) => partialSum + a, 0)

    } else if(checkHUndefined && checkHUndefined[0]?.length > 0 && checkCUndefined?.length === 0){
        historyMaxPts = checkHUndefined.map(l => l.map(a => a[1]).reduce((partialSum: number, a: any) => partialSum + a, 0)).reduce((partialSum, a) => partialSum + a, 0)

    } else if(checkCUndefined?.length > 0){
        currentMaxPts = checkCUndefined.map((a) => a[1]).reduce((partialSum,a) => partialSum + a, 0)
    }
    return {
        pts: roundToHundredth(historyPts + currentPts),
        maxPts: roundToHundredth(historyMaxPts + currentMaxPts)
    };
};