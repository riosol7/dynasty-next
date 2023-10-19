"use client";
import styles from "./Market.module.css";
import PositionMarket from "./PositionMarket";
import WaiverActivity from "./WaiverActivity";
import { useLeagueContext, usePlayerContext } from "@/context";
import { processWaiverBids } from "@/utils";
import { Icon } from "@iconify-icon/react";

export default function MarketWidget() {
    const { legacyLeague, loadLegacyLeague } = useLeagueContext();
    const { players, loadPlayers } = usePlayerContext();

    const waivers = processWaiverBids(legacyLeague, players);

    return (
        <div className="py-5">
            <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                    <Icon icon="ant-design:stock-outlined"  style={{color:"#a9dfd8", fontSize:"1.1rem"}} />
                    <p className="font-bold mx-1">Market</p>
                </div>
                <a className={styles.anchorCell} href={`/market`}>
                    <Icon className={styles.arrow} icon="material-symbols:arrow-right-alt-rounded" style={{ fontSize: "1.5rem", color: "#cbcbcb" }}/>
                </a>
            </div>
            <PositionMarket waivers={waivers}/>
            <WaiverActivity waivers={waivers}/>
        </div>
    );
};