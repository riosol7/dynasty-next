import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { handleSort } from "@/utils";
import styles from "../LeagueRankings.module.css";

interface SortHeader {
    asc: boolean;
    label: string;
    sort: string;
    setAsc: React.Dispatch<React.SetStateAction<boolean>>;
    setSort: React.Dispatch<React.SetStateAction<string>>;
};

interface SortIcon {
    asc: boolean;
    label: string;
    onClick: () => void;
};

function SortHeader({ sort, label, asc, setAsc, setSort}: SortHeader) {
    return (
        <div className="w-1/12 flex items-center">
            {sort === label || (label === "TOTAL" && sort === "TEAM") ? (
                <SortIcon onClick={() => setAsc(!asc)} asc={asc} label={label} />
            ) : (
                <p className={styles.standingCell} onClick={() => handleSort(sort, label, asc, setAsc, setSort)}>{label}</p>
            )}
        </div>
    );
};
function SortIcon({ onClick, asc, label }: SortIcon) {
    return (
        <div className="flex items-center">
            <p className={styles.standingCell} onClick={onClick}>{label}</p>
            <Icon icon={`bi:caret-${asc ? "down" : "up"}-fill`} style={{color: "#a9dfd8"}}/>
        </div>
    );
};

export default function DynastyRankings() {
    const [sort, setSort] = useState("TEAM")
    const [asc, setAsc] = useState(false)

    return (
        <>
            <div className="pt-2">
                <div className="flex py-3" style={{borderBottom: ".5px solid #2a2c3e", fontSize: ".7rem", color: "#7d91a6"}}>
                    <div className="w-7/12 flex items-center">
                        <div className="w-1/12 flex items-center">
                            <p>RANK</p>
                        </div>
                        <p className={styles.standingCell}>TEAM</p>
                    </div>
                    <SortHeader
                        sort={sort}
                        asc={asc}
                        setAsc={setAsc}
                        setSort={setSort}
                        label="TOTAL"
                    />
                    <SortHeader
                        sort={sort}
                        asc={asc}
                        setAsc={setAsc}
                        setSort={setSort}
                        label="QB"
                    />
                    <SortHeader
                        sort={sort}
                        asc={asc}
                        setAsc={setAsc}
                        setSort={setSort}
                        label="RB"
                    />
                    <SortHeader
                        sort={sort}
                        asc={asc}
                        setAsc={setAsc}
                        setSort={setSort}
                        label="WR"
                    />
                    <SortHeader
                        sort={sort}
                        asc={asc}
                        setAsc={setAsc}
                        setSort={setSort}
                        label="TE"
                    />
                </div>
            </div>
            {/* <div>
                {processedRosters?.[`${sort.toLowerCase()}Rank`].sort((a, b) => (asc ? a.rank - b.rank : b.rank - a.rank)).map((roster, i) => (
                    <DynastyRow key={i} roster={roster} sort={sort}/>
                ))}
            </div> */}
        </>
    )
}
