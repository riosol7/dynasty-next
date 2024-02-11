"use client";
import { useState } from "react";
import styles from "./Market.module.css";
import PositionMarket from "./PositionMarket";
import WaiverActivity from "./WaiverActivity";
import { useLeagueContext, usePlayerContext } from "@/context";
import { processWaiverBids } from "@/utils";
import { Icon } from "@iconify-icon/react";

export default function MarketWidget() {
    const { legacyLeague, loadLegacyLeague } = useLeagueContext();
    const { players, loadPlayers } = usePlayerContext();
    const [selectSeason, setSelectSeason] = useState<string>("All Time");
    const handleSeason = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectSeason(e.target.value);
    };
    const waivers = processWaiverBids(legacyLeague, players);
    const filteredSeasonalBids = legacyLeague.map(league => {
        return {
            transactions: league.transactions.filter(transaction => transaction.settings !== null && transaction.settings.waiver_bid), 
            season: league.season
        }
    }).filter(league => league.transactions.length > 0);
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
                        {filteredSeasonalBids?.slice().reverse().map((league, i) => 
                            <option key={i} value={league.season}>{league.season}</option>
                        )}
                    </select>
                    <a className={styles.anchorCell} href={`/market`}>
                        <Icon className={styles.arrow} icon="material-symbols:arrow-right-alt-rounded" style={{ fontSize: "1.5rem", color: "#cbcbcb" }}/>
                    </a>
                </div>
            </div>
            <PositionMarket waivers={waivers} selectSeason={selectSeason}/>
            <div className="py-4">
                <WaiverActivity waivers={waivers} selectSeason={selectSeason}/>
            </div>
        </div>
    );
};