import React, { useState, useEffect } from "react";
import { useLeagueContext } from "@/context";
import { findLeagueBySeason } from "@/utils";
import * as Interfaces from "../../../../interfaces";

interface SortingConfig {
    sort: string;
    asc: boolean;
};

const sortingConfig: SortingConfig = {
    sort: 'RANK',
    asc: false,
};

export default function Standings({season, playoffs}: Interfaces.StandingProps) {
    const { legacyLeague } = useLeagueContext();

    const currentRosters = legacyLeague[0].rosters;
    const numberOfDivisions = legacyLeague[0].settings.divisions || 0;
    const initialDivisionStates = Array.from({ length: numberOfDivisions }, () => (sortingConfig));
    const foundRostersBySeason = findLeagueBySeason(season, legacyLeague)?.rosters!;

    const [overallStandings, setOverallStandings] = useState(sortingConfig);
    const [divisionStates, setDivisionStates] = useState(initialDivisionStates);
    
    const updateOverallStandings = (newSortingConfig: SortingConfig) => {
        setOverallStandings(newSortingConfig);
    };

    const updateDivisionState = (divisionIndex: number, newSort: string, newAsc: boolean) => {
        setDivisionStates((prevStates) => prevStates.map((prevState, index) =>
            index === divisionIndex ? { ...prevState, sort: newSort, asc: newAsc } : prevState
        ));
    };

    const findDivisionRosters = (division: number) => {
        return foundRostersBySeason?.filter(roster => roster.settings.division === division);
    };

    useEffect(() => {
        if (divisionStates.length === 0) {
            setDivisionStates(initialDivisionStates);
        };
    }, [divisionStates]);

    type StatKeys = keyof Interfaces.Roster['settings'];

    const getStatValue = (owner: Interfaces.Roster, statKey: StatKeys): number => {
        if (owner.settings && owner.settings[statKey] !== undefined) {
            return owner.settings[statKey];
        };
      
        return 0;
    };
    
    const renderStandingRows = (rosters: Interfaces.Roster[], sortKey: string, ascending: boolean) => rosters?.slice().sort((a, b) => (ascending ? 
    getStatValue(a, sortKey) - getStatValue(b, sortKey) : getStatValue(b, sortKey) - getStatValue(a, sortKey)))
    .map((owner, i) => (
        <StandingRow
            key={i}
            season={season}
            owner={owner}
            league={league}
        />
    ));

    return (
        season === "All Time" ?
            <div className="py-2">
                <StandingTableHeader asc={overallStandings.asc} updateStandings={updateOverallStandings} sort={overallStandings.sort}/>
                {overallStandings.sort === "RANK" || overallStandings.sort === "RECORD" ? (
                    overallStandings.sort === "RANK"
                    ? overallStandings.asc
                        ? renderStandingRows(currentRosters, overallStandings.sort, true).reverse()
                        : renderStandingRows(currentRosters, overallStandings.sort, false)
                    : overallStandings.asc
                    ? renderStandingRows(currentRosters, "winPCT", true).reverse()
                    : renderStandingRows(currentRosters, "winPCT", false)
                ) : overallStandings.sort === "PF" ? (
                    renderStandingRows(currentRosters, "fpts", overallStandings.asc)
                ) : overallStandings.sort === "MAX PF" ? (
                    renderStandingRows(currentRosters, "ppts", overallStandings.asc)
                ) : overallStandings.sort === "PA" ? (
                    renderStandingRows(currentRosters, "fpts_against", overallStandings.asc)
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
                        <StandingTableHeader asc={divisionState.asc} updateStandings={updateDivisionState} sort={divisionState.sort} division={index + 1}/>
                        {divisionState.sort === "RANK" || divisionState.sort === "RECORD" ? (
                            divisionState.sort === "RANK"
                                ? divisionState.asc
                                ? renderStandingRows(findDivisionRosters(index + 1), divisionState.sort, true).reverse()
                                : renderStandingRows(findDivisionRosters(index + 1), divisionState.sort, false)
                                : divisionState.asc
                                ? renderStandingRows(findDivisionRosters(index + 1), "winPCT", true).reverse()
                                : renderStandingRows(findDivisionRosters(index + 1), "winPCT", false)
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
                <StandingTableHeader asc={overallStandings.asc} updateStandings={updateOverallStandings} sort={overallStandings.sort}/>
                {overallStandings.sort === "RANK" || overallStandings.sort === "RECORD" ? (
                    overallStandings.sort === "RANK"
                    ? overallStandings.asc
                    ? renderStandingRows(foundRostersBySeason, overallStandings.sort, true).reverse()
                    : renderStandingRows(foundRostersBySeason, overallStandings.sort, false)
                    : overallStandings.asc
                    ? renderStandingRows(foundRostersBySeason, "winPCT", true).reverse()
                    : renderStandingRows(foundRostersBySeason, "winPCT", false)
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
