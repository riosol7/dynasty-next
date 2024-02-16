import styles from "../LeagueRankings.module.css";
import { Icon } from "@iconify-icon/react";
import * as Interfaces from "@/interfaces";

function SortIcon({ asc, onClick }: Interfaces.SortIconProps) {
    return (
        <div className="flex items-center" onClick={onClick}>
            <Icon icon={`bi:caret-${asc ? "up" : "down"}-fill`} style={{ color: "#a9dfd8" }}/>
        </div>
    );
};

function SortableHeader({
    label,
    asc,
    sort,
    updateOverallStandings,
    updateDivisionState,
    division,
  }: Interfaces.StandingTableHeaderProps) {
    const sortKey = label === "record" ? "rank" : label;
    const isSorted = sort === sortKey;
    const handleSortClick = () => {
        if (isSorted) {
            if (division !== undefined && updateDivisionState !== undefined) {
                updateDivisionState(division - 1, sortKey, !asc);
            } else if (updateOverallStandings !== undefined) {
                updateOverallStandings({ sort: sortKey, asc: !asc });
            };
        } else {
            if (division !== undefined && updateDivisionState !== undefined && sortKey !== undefined) {
                updateDivisionState(division - 1, sortKey, asc);
            } else if (updateOverallStandings !== undefined && sortKey !== undefined) {
                updateOverallStandings({ sort: sortKey, asc: asc });
            };            
        };
    };
    return (
        <div className={label === "record" ? "w-2/12 flex items-center" : "w-1/12 flex items-center"}>
            <p className={styles.standingCell} onClick={handleSortClick}>{
            label === "fpts" ? "PF" : label === "ppts" ? "MAX PF" : label === "fpts_against" ? "PA" :
                label?.toLocaleUpperCase()
            }</p>
            {isSorted && <SortIcon asc={asc} onClick={handleSortClick} />}
        </div>
    );
};

export default function StandingTableHeader({ asc, sort, updateOverallStandings, updateDivisionState, division }: Interfaces.StandingTableHeaderProps) {
    return (
        <div className={styles.tableHeader}>
            <div className="w-7/12 flex items-center"> 
                <div className="w-1/12">
                    <SortableHeader
                        label="rank"
                        asc={asc}
                        updateOverallStandings={updateOverallStandings}
                        updateDivisionState={updateDivisionState}
                        sort={sort}
                        division={division}
                    />
                </div>
                <p className={`ml-2 ${styles.standingCell}`}>{division? `DIVISION ${division}` : "TEAM"}</p>
            </div>
            <SortableHeader
                label="record"
                asc={asc}
                updateOverallStandings={updateOverallStandings}
                updateDivisionState={updateDivisionState}
                sort={sort}
                division={division}
            />
            <SortableHeader
                label="fpts"
                asc={asc}
                updateOverallStandings={updateOverallStandings}
                updateDivisionState={updateDivisionState}
                sort={sort}
                division={division}
            />
            <SortableHeader
                label="ppts"
                asc={asc}
                updateOverallStandings={updateOverallStandings}
                updateDivisionState={updateDivisionState}
                sort={sort}
                division={division}
            />
            <SortableHeader
                label="fpts_against"
                asc={asc}
                updateOverallStandings={updateOverallStandings}
                updateDivisionState={updateDivisionState}
                sort={sort}
                division={division}
            />
        </div>
    );
};