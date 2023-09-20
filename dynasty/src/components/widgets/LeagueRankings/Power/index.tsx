import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { getPowerRankings, handleSort } from "@/utils";
import { useLeagueContext } from "@/context";
import styles from "../LeagueRankings.module.css";
import PowerRow from "./PowerRow";

interface PowerRankings {
    season: string;
}

export default function PowerRankings({season}: PowerRankings) {
    const { legacyLeague, loadLegacyLeague } = useLeagueContext(); 
    const [sort, setSort] = useState("")
    const [asc, setAsc] = useState(false)

    const powerRankings = getPowerRankings(season, legacyLeague);
  
    return (
        <>
            <div className="pt-2">
                <div className="flex py-3" style={{borderBottom:".5px solid #2a2c3e", fontSize:".7rem", color:"#7d91a6"}}>
                    <div className="w-7/12 flex items-center">
                        {sort === "RANK" ?
                            <div className="w-1/12 flex items-center">
                                <p className={styles.standingCell} onClick={() => setAsc(!asc)}>RANK</p>
                                <Icon icon={asc ? "bi:caret-up-fill" : "bi:caret-down-fill"} style={{color:"#a9dfd8"}}/>
                            </div>
                        :
                            <p className={`w-1/12 ${styles.standingCell}`} onClick={() => handleSort(sort, "RANK", asc, setAsc, setSort)}>RANK</p>
                        }
                        <p className={styles.standingCell}>TEAM</p>
                    </div>
                    <div className="w-5/12 flex items-center justify-end space-x-2">
                        <p className={`w-1/12 ${styles.standingCell}`}>W</p>
                        <p className={`w-1/12 ${styles.standingCell}`}>L</p>
                        <p className={`w-1/12 ${styles.standingCell}`}>PCT</p>
                        <p className={`w-1/12 flex items-center ${styles.standingCell}`}><Icon icon="emojione-monotone:four-leaf-clover"style={{fontSize:"13.2px", color:"#289a5d"}}/>Rate</p>
                        <p className={`w-1/12 ${styles.standingCell}`}>GP</p>
                    </div>
                </div>
            </div>
            {powerRankings?.map((roster , i) => 
                <PowerRow key={i} roster={roster} season={season}/>
            )}
        </>
    );
};