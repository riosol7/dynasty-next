import * as Interfaces from "@/interfaces";
import { findLeagueBySeason, processRosters, sortPlayersByFantasyMarket, calculateAverage, roundToHundredth, accumulatePoints } from "..";

export const getTeamStats = (
    rID: number, 
    selectSeason: string, 
    legacyLeague: Interfaces.League[], 
    fantasyMarket: string, 
    processedPlayers: Interfaces.Player[])  => {
        
    const league: Interfaces.League = findLeagueBySeason(selectSeason, legacyLeague);
    const processedRosters = processRosters(league, processedPlayers);
    const updatedRoster = processedRosters.find(newRoster => newRoster.roster_id === rID)!;
    const players: Interfaces.Player[] = (updatedRoster?.players as Interfaces.Player[])!;
    const validPlayers: Interfaces.Player[] = players?.filter(player => player.position !== "DEF" && player.position !== "K")!;
    const ks: Interfaces.Player[] = players?.filter(player => player.position === "K");
    const def: Interfaces.Player[] = players?.filter(player => player.position === "DEF"); 
    const qbs: Interfaces.Player[] = sortPlayersByFantasyMarket(validPlayers, fantasyMarket, "QB");
    const rbs: Interfaces.Player[] = sortPlayersByFantasyMarket(validPlayers, fantasyMarket, "RB");
    const wrs: Interfaces.Player[] = sortPlayersByFantasyMarket(validPlayers, fantasyMarket, "WR");
    const tes: Interfaces.Player[] = sortPlayersByFantasyMarket(validPlayers, fantasyMarket, "TE");
    const avgQBAge: number = calculateAverage(qbs?.reduce((total, obj) => {return total + Number(obj.age)}, 0), qbs?.length);
    const avgRBAge: number = calculateAverage(rbs?.reduce((total, obj) => {return total + Number(obj.age)}, 0), rbs?.length);
    const avgWRAge: number = calculateAverage(wrs?.reduce((total, obj) => {return total + Number(obj.age)}, 0), wrs?.length);
    const avgTEAge: number = calculateAverage(tes?.reduce((total, obj) => {return total + Number(obj.age)}, 0), tes?.length);
    const avgTeamAge: number = calculateAverage(validPlayers?.reduce((total, obj) => {return total + Number(obj.age)}, 0), validPlayers?.length);

    const selectedRoster: Interfaces.DynastyValue = (updatedRoster && 
    updatedRoster[fantasyMarket as keyof typeof updatedRoster] as Interfaces.DynastyValue);
    const qbMarketValue: number = selectedRoster?.qb;
    const rbMarketValue: number = selectedRoster?.rb;
    const wrMarketValue: number = selectedRoster?.wr;
    const teMarketValue: number = selectedRoster?.te;
    const teamMarketValue: number = roundToHundredth(
        qbMarketValue +
        rbMarketValue +
        wrMarketValue +
        teMarketValue
    );

    const totalAllTimeQBPoints = accumulatePoints(rID, qbs, legacyLeague);
    const totalAllTimeRBPoints = accumulatePoints(rID, rbs, legacyLeague);
    const totalAllTimeWRPoints = accumulatePoints(rID, wrs, legacyLeague);
    const totalAllTimeTEPoints = accumulatePoints(rID, tes, legacyLeague);
    
    const totalSeasonalQBPoints = accumulatePoints(rID, qbs, legacyLeague, selectSeason);
    const totalSeasonalRBPoints = accumulatePoints(rID, rbs, legacyLeague, selectSeason);
    const totalSeasonalWRPoints = accumulatePoints(rID, wrs, legacyLeague, selectSeason);
    const totalSeasonalTEPoints = accumulatePoints(rID, tes, legacyLeague, selectSeason);

    return {
        qb: {
            players: qbs?.length,
            age: avgQBAge,
            value: qbMarketValue,
        },
        rb: {
            players: rbs?.length,
            age: avgRBAge,
            value: rbMarketValue,
        },
        wr: {
            players: wrs?.length,
            age: avgWRAge,
            value: wrMarketValue,
        },
        te: {
            players: tes?.length,
            age: avgTEAge,
            value: teMarketValue,
        },
        k: {
            players: ks?.length
        },
        def: {
            players: def?.length
        },
        team: {
            players: updatedRoster?.players.length,
            validPlayers: validPlayers?.length,
            age: avgTeamAge,
            value: teamMarketValue
        } 
    };
};