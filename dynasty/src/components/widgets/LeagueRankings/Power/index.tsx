import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { handleSort } from "@/utils";
import styles from "../LeagueRankings.module.css";

interface PowerRankings {
    season: string;
}

export default function PowerRankings({season}: PowerRankings) {

    const [sort, setSort] = useState("")
    const [asc, setAsc] = useState(false)

    return (
        <>
            <div className="pt-2">
                <div className="flex py-3" style={{borderBottom:".5px solid #2a2c3e", fontSize:".7rem", color:"#7d91a6"}}>
                    <div className="w-7/12 flex items-center">
                        {sort === "RANK" ?
                            asc === false ?
                                <div className="w-1/12 flex items-center">
                                    <p className={styles.standingCell} onClick={() => setAsc(true)}>RANK</p>
                                    <Icon icon="bi:caret-down-fill" style={{color:"#a9dfd8"}}/>
                                </div>
                            :
                                <div className="w-1/12 flex items-center">
                                    <p className={styles.standingCell} onClick={() => setAsc(false)}>RANK</p>
                                    <Icon icon="bi:caret-up-fill" style={{color:"#a9dfd8"}}/>
                                </div>  
                        :
                            <p className={`w-1/12 ${styles.standingCell}`} onClick={() => handleSort(sort, "RANK", asc, setAsc, setSort)}>RANK</p>
                        }
                        <p className={styles.standingCell}>TEAM</p>
                    </div>
                    <div className="w-5/12 flex items-center justify-end space-x-2">
                        <p className={`w-1/12 ${styles.standingCell}`}>W</p>
                        <p className={`w-1/12 ${styles.standingCell}`}>L</p>
                        <p className={`w-1/12 flex items-center ${styles.standingCell}`}><Icon icon="emojione-monotone:four-leaf-clover"style={{fontSize:"13.2px", color:"#289a5d"}}/>Rate</p>
                    </div>
                </div>
            </div>
            {/* {pwrRank?.map((r,i) => 
                <PowerRow key={i} r={r} winPCT={winPCT}/>
            )} */}
        </>
    );
};