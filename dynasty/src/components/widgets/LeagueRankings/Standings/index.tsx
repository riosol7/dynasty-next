import React from "react";
import * as Interfaces from "../../../../interfaces";

export default function Standings({season, playoffs}: Interfaces.StandingProps) {
    
    return (
        season === "All Time" ?
            <div className="py-2">
                {/* <StandingTableHeader asc={asc} handleSort={handleSort} setAsc={setAsc} sort={sort}/>
                {sort === "RANK" || sort === "RECORD" ? (
                    sort === "RANK"
                    ? asc
                        ? renderStandingRows(allTimeStats, sort, true).reverse()
                        : renderStandingRows(allTimeStats, sort, false)
                    : asc
                    ? renderStandingRows(allTimeStats, "winPCT", true).reverse()
                    : renderStandingRows(allTimeStats, "winPCT", false)
                ) : sort === "PF" ? (
                    renderStandingRows(allTimeStats, "fpts", asc)
                ) : sort === "MAX PF" ? (
                    renderStandingRows(allTimeStats, "ppts", asc)
                ) : sort === "PA" ? (
                    renderStandingRows(allTimeStats, "fpts_against", asc)
                ) : (
                    <></>
                )} */}
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
                {/* <StandingTableHeader asc={asc1} handleSort={handleSort1} setAsc={setAsc1} sort={sort1} division={1}/>
                {sort1 === "RANK" || sort1 === "RECORD" ? (
                sort1 === "RANK"
                    ? asc1
                    ? renderStandingRows(divisionOneRank, sort1, true).reverse()
                    : renderStandingRows(divisionOneRank, sort1, false)
                    : asc1
                    ? renderStandingRows(divisionOneRank, "winPCT", true).reverse()
                    : renderStandingRows(divisionOneRank, "winPCT", false)
                ) : sort1 === "PF" ? (
                renderStandingRows(divisionOneRank, "fpts", asc1)
                ) : sort1 === "MAX PF" ? (
                renderStandingRows(divisionOneRank, "ppts", asc1)
                ) : sort1 === "PA" ? (
                renderStandingRows(divisionOneRank, "fpts_against", asc1)
                ) : (
                <></>
                )} */}
            </div>
            <div className="py-2">
                {/* <StandingTableHeader asc={asc2} handleSort={handleSort2} setAsc={setAsc2} sort={sort2} division={2}/>
                {sort2 === "RANK" || sort2 === "RECORD" ? (
                sort2 === "RANK"
                    ? asc2
                    ? renderStandingRows(divisionTwoRank, sort2, true).reverse()
                    : renderStandingRows(divisionTwoRank, sort2, false)
                    : asc2
                    ? renderStandingRows(divisionTwoRank, "winPCT", true).reverse()
                    : renderStandingRows(divisionTwoRank, "winPCT", false)
                ) : sort2 === "PF" ? (
                renderStandingRows(divisionTwoRank, "fpts", asc2)
                ) : sort2 === "MAX PF" ? (
                renderStandingRows(divisionTwoRank, "ppts", asc2)
                ) : sort2 === "PA" ? (
                renderStandingRows(divisionTwoRank, "fpts_against", asc2)
                ) : (
                <></>
                )} */}
            </div>
            <div className="py-2">
                {/* <StandingTableHeader asc={asc} handleSort={handleSort} setAsc={setAsc} sort={sort}/>
                {sort === "RANK" || sort === "RECORD" ? (
                sort === "RANK"
                    ? asc
                    ? renderStandingRows(foundLegacyRoster, sort, true).reverse()
                    : renderStandingRows(foundLegacyRoster, sort, false)
                    : asc
                    ? renderStandingRows(foundLegacyRoster, "winPCT", true).reverse()
                    : renderStandingRows(foundLegacyRoster, "winPCT", false)
                ) : sort === "PF" ? (
                renderStandingRows(foundLegacyRoster, "fpts", asc)
                ) : sort === "MAX PF" ? (
                renderStandingRows(foundLegacyRoster, "ppts", asc)
                ) : sort === "PA" ? (
                renderStandingRows(foundLegacyRoster, "fpts_against", asc)
                ) : (
                <></>
                )} */}
            </div>
        </>
    );
};
