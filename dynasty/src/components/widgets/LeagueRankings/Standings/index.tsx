import React, { useState, useEffect } from "react";
import { useLeagueContext } from "@/context";
import { findRostersBySeason, sortAllTimeRosters } from "@/utils";
import * as Interfaces from "../../../../interfaces";
import StandingRow from "./StandingRow";
import StandingTableHeader from "./StandingTableHeader";

const sortingConfig: Interfaces.SortingConfig = {
    sort: 'rank',
    asc: false,
};
// Add rankings to all time and overall standings, minimize files and modulate interfaces and types.
export default function Standings({season, playoffs}: Interfaces.StandingProps) {
    const { legacyLeague } = useLeagueContext();

    const numberOfDivisions = legacyLeague[0].settings.divisions || 0;
    const initialDivisionStates = Array.from({ length: numberOfDivisions }, () => (sortingConfig));
    const allTimeRosters = sortAllTimeRosters(legacyLeague);
    const foundRostersBySeason = findRostersBySeason(season, legacyLeague);

    const [overallStandings, setOverallStandings] = useState(sortingConfig);
    const [divisionStates, setDivisionStates] = useState(initialDivisionStates);
    
    const updateOverallStandings = (newSortingConfig: Interfaces.SortingConfig) => {
        setOverallStandings(newSortingConfig);
    };

    const updateDivisionState = (divisionIndex: number, newSort: string, newAsc: boolean) => {
        setDivisionStates((prevStates) => prevStates.map((prevState, index) =>
            index === divisionIndex ? { ...prevState, sort: newSort, asc: newAsc } : prevState
        ));
    };

    const findDivisionRosters = (division: number) => {
        return foundRostersBySeason?.filter(roster => roster.settings.division === division).map((roster, i) => { return {...roster, settings:{...roster.settings, rank: i + 1}}});
    };

    useEffect(() => {
        if (divisionStates.length === 0) {
            setDivisionStates(initialDivisionStates);
        };
    }, [divisionStates]);

    const getStatValue = (owner: Interfaces.Roster, statKey: StatKeys): number => {
        if (owner.settings && owner.settings[statKey] !== undefined) {
            return owner.settings[statKey];
        };
      
        return 0;
    };
    type StatKeys = keyof Interfaces.Roster['settings'];

    const renderStandingRows = (rosters: Interfaces.Roster[], sortKey: StatKeys, ascending: boolean) => {
    return rosters
        ?.slice()
        .sort((a, b) =>
        ascending
            ? getStatValue(a, sortKey) - getStatValue(b, sortKey)
            : getStatValue(b, sortKey) - getStatValue(a, sortKey)
        )
        .map((roster, i) => (
        <StandingRow key={i} season={season} roster={roster} />
        ));
    };

    return (
        season === "All Time" ?
            <div className="py-2">
                <StandingTableHeader asc={overallStandings.asc} updateOverallStandings={updateOverallStandings} sort={overallStandings.sort}/>
                {overallStandings.sort === "rank" ? (
                    renderStandingRows(allTimeRosters, overallStandings.sort, overallStandings.asc)
                ) : overallStandings.sort === "PF" ? (
                    renderStandingRows(allTimeRosters, "fpts", overallStandings.asc)
                ) : overallStandings.sort === "MAX PF" ? (
                    renderStandingRows(allTimeRosters, "ppts", overallStandings.asc)
                ) : overallStandings.sort === "PA" ? (
                    renderStandingRows(allTimeRosters, "fpts_against", overallStandings.asc)
                ) : (
                    <></>
                )}
            </div>
        : playoffs ?
            <></>
            // <PostSeasonBracket
            //     foundHistory={foundHistory}
            //     handleRostersBySzn={handleRostersBySzn}
            //     league={league}
            //     processedRosters={processedRosters}
            //     selectSzn={selectSzn} 
            // />  
        :
        <>
            <div className="py-2">
                {divisionStates.map((divisionState, index) => (
                    <div key={index}>
                        <StandingTableHeader asc={divisionState.asc} updateDivisionState={updateDivisionState} sort={divisionState.sort} division={index + 1}/>
                        {divisionState.sort === "rank" ? (
                            divisionState.asc ?
                                renderStandingRows(findDivisionRosters(index + 1), divisionState.sort, true)
                            : renderStandingRows(findDivisionRosters(index + 1), divisionState.sort, false).reverse()
                        ) : divisionState.sort === "PF" ? (
                        renderStandingRows(findDivisionRosters(index + 1), "fpts", divisionState.asc)
                        ) : divisionState.sort === "MAX PF" ? (
                        renderStandingRows(findDivisionRosters(index + 1), "ppts", divisionState.asc)
                        ) : divisionState.sort === "PA" ? (
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
                    overallStandings.asc ? 
                        renderStandingRows(foundRostersBySeason, overallStandings.sort, true).reverse()
                    : renderStandingRows(foundRostersBySeason, overallStandings.sort, false)
                ) : overallStandings.sort === "PF" ? (
                renderStandingRows(foundRostersBySeason, "fpts", overallStandings.asc)
                ) : overallStandings.sort === "MAX PF" ? (
                renderStandingRows(foundRostersBySeason, "ppts", overallStandings.asc)
                ) : overallStandings.sort === "PA" ? (
                renderStandingRows(foundRostersBySeason, "fpts_against", overallStandings.asc)
                ) : (
                <></>
                )}
            </div>
        </>
    );
};
