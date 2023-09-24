"use client";
import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { handleSort, processPlayers, processRosters, sortDynastyRosters } from "@/utils";
import { 
    useFantasyMarket,
    useDynastyProcessContext,
    useFantasyCalcContext,
    useFantasyProContext,
    useKTCContext,
    useLeagueContext,
    usePlayerContext,
    useSuperFlexContext,
 } from "@/context";
 import DynastyRow from "./DynastyRow";
 import styles from "../LeagueRankings.module.css";
 import * as Interfaces from "../../../../interfaces";

function SortHeader({ sort, label, asc, setAsc, setSort}: Interfaces.SortProps) {
    return (
        <div className="w-1/12 flex items-center">
            {sort === label || (label === "TEAM" && sort === "TEAM") ? (
                <SortIcon onClick={() => setAsc(!asc)} asc={asc} label={label} />
            ) : (
                <p className={styles.standingCell} onClick={() => handleSort(sort, label, asc, setAsc, setSort)}>{label === "TEAM" ? "TOTAL" : label}</p>
            )}
        </div>
    );
};
function SortIcon({ onClick, asc, label }: Interfaces.SortIconProps) {
    return (
        <div className="flex items-center">
            <p className={styles.standingCell} onClick={onClick}>{label === "TEAM" ? "TOTAL" : label}</p>
            <Icon icon={`bi:caret-${asc ? "down" : "up"}-fill`} style={{color: "#a9dfd8"}}/>
        </div>
    );
};

export default function DynastyRankings() {
    const { fantasyMarket } = useFantasyMarket()!;
    const { legacyLeague, loadLegacyLeague } = useLeagueContext(); 
    const { players, loadPlayers } = usePlayerContext();
    const { ktc, loadKTC } = useKTCContext();
    const { superFlex, loadSuperFlex } = useSuperFlexContext();
    const { fc, loadFC } = useFantasyCalcContext();
    const { dp, loadDP } = useDynastyProcessContext();
    const { fantasyPro, loadFantasyPro } = useFantasyProContext();

    const [sort, setSort] = useState("TEAM")
    const [asc, setAsc] = useState(false)

    const processedPlayers = processPlayers(players, ktc, superFlex, fc, dp, fantasyPro);
    const processedRosters = processRosters(legacyLeague[0], processedPlayers);

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
                        label="TEAM"
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
            {sortDynastyRosters(processedRosters, asc, sort, fantasyMarket)?.map((roster, i) => 
                <DynastyRow key={i} roster={roster} sort={sort} fantasyMarket={fantasyMarket}/>
            )}
        </>
    )
}
