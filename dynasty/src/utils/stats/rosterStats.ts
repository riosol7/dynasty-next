import * as Interfaces from "@/interfaces";
import { findLeagueBySeason, processRosters, sortPlayersByFantasyMarket, calculateAverage, roundToHundredth, accumulatePoints } from "..";

export const getTeamStats = (rID: number, selectSeason: string, legacyLeague: Interfaces.League[], fantasyMarket: string, processedPlayers: Interfaces.Player[]) => {
    const league: Interfaces.League = findLeagueBySeason(selectSeason, legacyLeague);
    
    const processedRosters = processRosters(league, processedPlayers);
    const updatedRoster = processedRosters.find(newRoster => newRoster.roster_id === rID)!;

    const validPlayers = (updatedRoster?.players as Interfaces.Player[])?.filter(player => player.position !== "DEF" && player.position !== "K")!;
    const qbs = sortPlayersByFantasyMarket(validPlayers, fantasyMarket, "QB");
    const rbs = sortPlayersByFantasyMarket(validPlayers, fantasyMarket, "RB");
    const wrs = sortPlayersByFantasyMarket(validPlayers, fantasyMarket, "WR");
    const tes = sortPlayersByFantasyMarket(validPlayers, fantasyMarket, "TE");
    const avgQBAge = calculateAverage(qbs?.reduce((total, obj) => {return total + Number(obj.age)}, 0), qbs?.length);
    const avgRBAge = calculateAverage(rbs?.reduce((total, obj) => {return total + Number(obj.age)}, 0), rbs?.length);
    const avgWRAge = calculateAverage(wrs?.reduce((total, obj) => {return total + Number(obj.age)}, 0), wrs?.length);
    const avgTEAge = calculateAverage(tes?.reduce((total, obj) => {return total + Number(obj.age)}, 0), tes?.length);
    const avgTeamAge = calculateAverage(validPlayers?.reduce((total, obj) => {return total + Number(obj.age)}, 0), validPlayers?.length);

    const selectedRoster = (updatedRoster && updatedRoster[fantasyMarket as keyof typeof updatedRoster] as Interfaces.DynastyValue);
    const qbMarketValue = selectedRoster?.qb;
    const rbMarketValue = selectedRoster?.rb;
    const wrMarketValue = selectedRoster?.wr;
    const teMarketValue = selectedRoster?.te;
    const teamMarketValue = roundToHundredth(
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
        team: {
            players: validPlayers?.length,
            age: avgTeamAge,
            value: teamMarketValue
        } 
    };
};