import React from "react";
import { handleSort } from "@/utils";
import { Icon } from "@iconify-icon/react";
import * as Interfaces from "../../../../interfaces";

function SortIcon({ asc, onClick }: Interfaces.SortIcon) {
    return (
        <div className="d-flex align-items-center" onClick={onClick}>
            <Icon icon={`bi:caret-${asc ? "up" : "down"}-fill`} style={{ color: "#a9dfd8" }}/>
        </div>
    );
}
  
function SortableHeader({
    label,
    asc,
    sort,
    updateOverallStandings,
    updateDivisionState,
    division,
  }: StandingTableHeaderProps) {
    const isSorted = sort === label;
    const handleSortClick = () => {
        if (isSorted) {
            // Call the update functions here
            if (division !== undefined && updateDivisionState!) {
                updateDivisionState(division, label, !asc);
            } else if (updateOverallStandings!) {
                updateOverallStandings({ sort: label, asc: !asc });
            };
        } else {
            // handleStandingSort(sort, label!, asc, updateOverallStandings, updateDivisionState);
        };
    };
    return (
      <div className={label === "RECORD" ? "w-2/12 flex items-center" : "w-1/12 flex items-center"}>
        <p className="m-0 StandingCell" onClick={handleSortClick}>
          {label}
        </p>
        {isSorted && <SortIcon asc={asc} onClick={handleSortClick} />}
      </div>
    );
};

export interface StandingTableHeaderProps {
    label?: string;
    sort: string;
    asc: boolean;
    updateOverallStandings?: (newSortingConfig: Interfaces.SortingConfig) => void;
    updateDivisionState?: (divisionIndex: number, newSort: string, newAsc: boolean) => void;
    division?: number;
};
export default function StandingTableHeader({ asc, sort, updateOverallStandings, updateDivisionState, division }: StandingTableHeaderProps) {
    return (
        <div className="flex py-3" style={{borderBottom:".5px solid #2a2c3e", fontSize:".7rem", color:"#7d91a6"}}>
            <div className="w-7/12 flex items-center"> 
                <div className="w-1/12">
                    <SortableHeader
                        label="RANK"
                        asc={asc}
                        updateOverallStandings={updateOverallStandings}
                        updateDivisionState={updateDivisionState}
                        sort={sort}
                    />
                </div>
                <p className="StandingCell">{division? `DIVISION ${division}` : "TEAM"}</p>
            </div>
            <SortableHeader
                label="RECORD"
                asc={asc}
                updateOverallStandings={updateOverallStandings}
                updateDivisionState={updateDivisionState}
                sort={sort}
            />
            <SortableHeader
                label="PF"
                asc={asc}
                updateOverallStandings={updateOverallStandings}
                updateDivisionState={updateDivisionState}
                sort={sort}
            />
            <SortableHeader
                label="MAX PF"
                asc={asc}
                updateOverallStandings={updateOverallStandings}
                updateDivisionState={updateDivisionState}
                sort={sort}
            />
            <SortableHeader
                label="PA"
                asc={asc}
                updateOverallStandings={updateOverallStandings}
                updateDivisionState={updateDivisionState}
                sort={sort}
            />
        </div>
    )
}