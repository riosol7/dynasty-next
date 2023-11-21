import styles from "../LeagueRankings.module.css";
import React, { useState, useEffect } from "react";
import { useLeagueContext } from "@/context";
import { findLeagueBySeason, sortAllTimeRostersByType } from "@/utils";
import { StatKeys } from "@/types";
import * as Interfaces from "@/interfaces";
import StandingRow from "./StandingRow";
import StandingTableHeader from "./StandingTableHeader";
import Tournament from "../Tournament";

export default function Standings({ season, tournament }: Interfaces.StandingProps) {
    const { legacyLeague, loadLegacyLeague } = useLeagueContext();
    const league = findLeagueBySeason(season, legacyLeague);
    const numberOfDivisions = legacyLeague[0].settings.divisions || 0;
    const initialDivisionStates = Array.from({ length: numberOfDivisions }, () => (Interfaces.sortingConfig));
    const allTimeRosters = sortAllTimeRostersByType(legacyLeague, "All Time");
    const foundRostersBySeason = findLeagueBySeason(season, legacyLeague).rosters;
    const [overallStandings, setOverallStandings] = useState(Interfaces.sortingConfig);
    const [divisionStates, setDivisionStates] = useState(initialDivisionStates);
    
    const updateOverallStandings = (newSortingConfig: Interfaces.SortingConfigProps) => {
        setOverallStandings(newSortingConfig);
    };

    const updateDivisionState = (divisionIndex: number, newSort: string, newAsc: boolean) => {
        setDivisionStates((prevStates) => prevStates.map((prevState, index) =>
            index === divisionIndex ? { ...prevState, sort: newSort, asc: newAsc } : prevState
        ));
    };

    const findDivisionRosters = (division: number) => {
        return foundRostersBySeason?.filter(roster => roster.settings.division === division)
        .map((roster, i) => { return {...roster, settings:{...roster.settings, rank: i + 1}}});
    };

    const getStatValue = (owner: Interfaces.Roster, statKey: StatKeys): number => {
        if (owner.settings && owner.settings[statKey] !== undefined) {
            // Attempt to convert the value to a number, or default to 0 if not possible
            const value = Number(owner.settings[statKey]);
            return isNaN(value) ? 0 : value;
        }
        return 0;
    };
    
    const renderStandingRows = (rosters: Interfaces.Roster[], sortKey: StatKeys, ascending: boolean) => {
        return rosters?.slice().sort((a, b) => ascending ? 
            getStatValue(a, sortKey) - getStatValue(b, sortKey) : getStatValue(b, sortKey) - getStatValue(a, sortKey)
        ).map((roster, i) => (
            <StandingRow key={i} season={season} roster={roster} />
        ));
    };

    const calculateRosterStats = (rosters: Interfaces.Roster[], division?: number) => {
        const foundRosters = division ? findDivisionRosters(division) : rosters;
        const initialValue = {
            wins: 0,
            losses: 0,
            ties: 0,
            ppts: 0,
            fpts: 0,
            pa: 0,
          };
        const totals = foundRosters.reduce((acc, roster) => {
            acc.wins += roster.settings.wins || 0;
            acc.losses += roster.settings.losses || 0;
            acc.ties += roster.settings.ties || 0;
            acc.ppts += roster.settings.ppts || 0;
            acc.fpts += roster.settings.fpts || 0;
            acc.pa += roster.settings.fpts_against || 0;
            return acc;
        }, initialValue);

        return totals;
    };

    useEffect(() => {
        if (divisionStates.length === 0) {
            setDivisionStates(initialDivisionStates);
        };
    }, [divisionStates, legacyLeague]);
    
    return (
        season === "All Time" ?
            <div className="py-2">
                <StandingTableHeader asc={overallStandings.asc} updateOverallStandings={updateOverallStandings} sort={overallStandings.sort}/>
                {overallStandings.sort === "rank" ? (
                    renderStandingRows(allTimeRosters!, overallStandings.sort, overallStandings.asc)
                ) : overallStandings.sort === "fpts" ? (
                    renderStandingRows(allTimeRosters!, "fpts", overallStandings.asc)
                ) : overallStandings.sort === "ppts" ? (
                    renderStandingRows(allTimeRosters!, "ppts", overallStandings.asc)
                ) : overallStandings.sort === "fpts_against" ? (
                    renderStandingRows(allTimeRosters!, "fpts_against", overallStandings.asc)
                ) : (
                    <></>
                )}
            </div>
        : tournament ? <Tournament season={season}/> :
        <>
            <div className="text-sm py-4">
                <div className={`pb-3 ${styles.performanceHeader}`} style={{borderBottom:".5px solid #2a2c3e", fontSize:".7rem", color:"#7d91a6"}}>
                    <p className="w-7/12">DIVISIONS</p>
                    <p className="w-2/12">RECORD</p>
                    <p className="w-1/12">PF</p>
                    <p className="w-1/12">MAX PF</p>
                    <p className="w-1/12">PA</p>
                </div>
                {divisionStates.map((_, idx) => 
                <div key={idx} className={`${styles.performanceSubTitleRow}`}>
                    <p className="w-7/12">Division {idx + 1}</p>
                    <p className="w-2/12">{calculateRosterStats(foundRostersBySeason, idx + 1).wins}
                    -{calculateRosterStats(foundRostersBySeason, idx + 1).losses}
                    -{calculateRosterStats(foundRostersBySeason, idx + 1).ties}</p>
                    <p className="w-1/12">{calculateRosterStats(foundRostersBySeason, idx + 1).fpts}</p>
                    <p className="w-1/12">{calculateRosterStats(foundRostersBySeason, idx + 1).ppts}</p>
                    <p className="w-1/12">{calculateRosterStats(foundRostersBySeason, idx + 1).pa}</p>
                </div>)}
                <div className={styles.performanceEndTitleRow}>
                    <p className="w-7/12">Total</p>
                    <p className="w-2/12">{calculateRosterStats(foundRostersBySeason).wins}
                    -{calculateRosterStats(foundRostersBySeason).losses}
                    -{calculateRosterStats(foundRostersBySeason).ties}</p>
                    <p className="w-1/12">{calculateRosterStats(foundRostersBySeason).fpts}</p>
                    <p className="w-1/12">{calculateRosterStats(foundRostersBySeason).ppts}</p>
                    <p className="w-1/12">{calculateRosterStats(foundRostersBySeason).pa}</p>
                </div>
            </div>
            <div className="py-2">
                {divisionStates.map((divisionState, index) => (
                <div key={index}>
                    <StandingTableHeader asc={divisionState.asc} updateDivisionState={updateDivisionState} sort={divisionState.sort} division={index + 1}/>
                    {divisionState.sort === "rank" ? (
                        renderStandingRows(findDivisionRosters(index + 1), divisionState.sort, divisionState.asc)
                    ) : divisionState.sort === "fpts" ? (
                    renderStandingRows(findDivisionRosters(index + 1), "fpts", divisionState.asc)
                    ) : divisionState.sort === "ppts" ? (
                    renderStandingRows(findDivisionRosters(index + 1), "ppts", divisionState.asc)
                    ) : divisionState.sort === "fpts_against" ? (
                    renderStandingRows(findDivisionRosters(index + 1), "fpts_against", divisionState.asc)
                    ) : (
                    <></>
                    )} 
                </div>
                ))}
            </div>
            <div className="py-2">
                <StandingTableHeader asc={overallStandings.asc} updateOverallStandings={updateOverallStandings} sort={overallStandings.sort}/>
                {overallStandings.sort === "rank" ? (
                    renderStandingRows(foundRostersBySeason, overallStandings.sort, overallStandings.asc)
                ) : overallStandings.sort === "fpts" ? (
                renderStandingRows(foundRostersBySeason, "fpts", overallStandings.asc)
                ) : overallStandings.sort === "ppts" ? (
                renderStandingRows(foundRostersBySeason, "ppts", overallStandings.asc)
                ) : overallStandings.sort === "fpts_against" ? (
                renderStandingRows(foundRostersBySeason, "fpts_against", overallStandings.asc)
                ) : (
                <></>
                )}
            </div>
        </>
    );
};
