import React, { useRef, useEffect, useState } from 'react';
import styles from "./Market.module.css";
import * as Interfaces from "@/interfaces";
import { POSITIONS } from "@/constants";
import { 
    calculatePercentageChange, 
    findRecentWaivers, 
    findHighestBid, 
    findLowestBid, 
    findTopSpender, 
    filteredTransactionsBySeason,
    roundToHundredth 
} from "@/utils";
import TrendChart from "@/components/charts/LineCharts/TrendChart";
import VolumeChart from "@/components/charts/BarCharts/VolumeChart";

const positionStyles = {
    QB: styles.qbHUD,
    RB: styles.rbHUD,
    WR: styles.wrHUD,
    TE: styles.teHUD,
    K: styles.kHUD,
    DEF: styles.defHUD,
};

export default function PositionMarket({ waivers, selectSeason }: Interfaces.MarketWidgetProps ) {
    return (
        <div className="py-3">
            <div className={`text-center ${styles.positionHeader}`}>
                <div style={{ width: "70px" }}>POSITION</div>
                <div className="w-3/12">{selectSeason === "All Time" ? selectSeason.toLocaleUpperCase() : selectSeason } TREND</div>
                <div className="w-1/12">LAST PRICE</div>
                <div className="w-1/12">CHANGE %</div>
                <div className="w-1/12">AVG</div>
                <div className="w-1/12">LOW</div>
                <div className="w-1/12">HIGH</div>
                <div className="w-1/12">QTY</div>
                <div className="w-1/12">TOP SPENDER</div>
                <div className="w-2/12">VOLUME</div>
            </div>
            {POSITIONS.map((position, i) => {
                const positionWaivers = waivers && waivers[position as keyof typeof waivers]!;
                const filteredWaivers = filteredTransactionsBySeason(positionWaivers, selectSeason);
                const recentWaivers = findRecentWaivers(filteredWaivers);
                const highestBid = findHighestBid(filteredWaivers);
                const lowestBid = findLowestBid(filteredWaivers);
                const totalQTY = filteredWaivers?.length;
                const averageBid = roundToHundredth(filteredWaivers?.reduce((r, c) => r + c.settings.waiver_bid, 0)! / totalQTY);
                const lastPrice = recentWaivers && recentWaivers[0]?.settings?.waiver_bid;
                const prevPrice = recentWaivers && recentWaivers[1]?.settings?.waiver_bid;
                return (
                    <a key={i} href={`/market?position=${position}&season=${selectSeason}`} className={`${styles.positionRow}`}>
                        <div style={{width: "70px"}} className={styles.positionCell}>
                            <div className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold ${positionStyles[position as keyof typeof positionStyles]}`}>{position}</div>
                        </div>
                        <div className={`w-3/12 ${styles.positionCell}`}>
                            <TrendChart waivers={filteredWaivers} height={50} width={250}/>
                        </div>
                        <p className={`w-1/12 ${styles.positionCell}`}>{lastPrice}</p>
                        <div className={`w-1/12 ${styles.positionCell}`}>
                            <p className={`${calculatePercentageChange(lastPrice, prevPrice) > 0 ? "text-green-500" : "text-red-500"}`}>
                            {calculatePercentageChange(lastPrice, prevPrice) > 0 ? "+" : ""}
                            {calculatePercentageChange(lastPrice, prevPrice)} %
                            </p>
                        </div>
                        <p className="w-1/12">{averageBid}</p>     
                        <p className="w-1/12">{lowestBid}</p>
                        <p className="w-1/12">{highestBid}</p>
                        <p className="w-1/12">{totalQTY}</p>
                        <div className={`w-1/12 text-xs`}>
                            <p className="text-[darkgray]">@{findTopSpender(filteredWaivers)?.owner}</p>
                            <p>${findTopSpender(filteredWaivers)?.bid}</p>
                        </div>
                        <div className="w-2/12 flex justify-center">
                            <VolumeChart waivers={filteredWaivers} height={50} width={250}/>
                        </div>
                    </a>
                );
            })}
        </div>
    );
};