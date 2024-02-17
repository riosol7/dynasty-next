"use client";
import { useState } from "react";
import styles from "./Market.module.css";
import PositionMarket from "./PositionMarket";
import WaiverActivity from "./WaiverActivity";
import { useLeagueContext, usePlayerContext } from "@/context";
import { processWaiverBids, validateWaiverBidLeagues } from "@/utils";
import { Icon } from "@iconify-icon/react";
import * as Interfaces from "@/interfaces";

export default function MarketWidget() {
    const { legacyLeague } = useLeagueContext();
    const { players } = usePlayerContext();
    const [selectSeason, setSelectSeason] = useState<string>("All Time");
    const handleSeason = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectSeason(e.target.value);
    };
    const waivers: Interfaces.Waivers = processWaiverBids(legacyLeague, players);
    const validWaiverBidLeagues: Interfaces.League[] = validateWaiverBidLeagues(legacyLeague);

    return (
        <div className="py-5">
            <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                    <Icon icon="ant-design:stock-outlined"  style={{color:"#a9dfd8", fontSize:"1.1rem"}} />
                    <p className="font-bold mx-1">Market</p>
                </div>
                <div className="flex items-center">
                    <select onChange={handleSeason} className={`mr-5 ${styles.selectTrend}`} value={selectSeason}>
                        <option value={"All Time"}>All Time</option>
                        {validWaiverBidLeagues?.slice().map((league, i) => 
                            <option key={i} value={league.season}>{league.season}</option>
                        )}
                    </select>
                    {/* <a className={styles.anchorCell} href={`/market`}>
                        <Icon className={styles.arrow} icon="material-symbols:arrow-right-alt-rounded" style={{ fontSize: "1.5rem", color: "#cbcbcb" }}/>
                    </a> */}
                </div>
            </div>
            <PositionMarket waivers={waivers} selectSeason={selectSeason}/>
            <div className="py-5">
                <WaiverActivity waivers={waivers} selectSeason={selectSeason}/>
            </div>
        </div>
    );
};