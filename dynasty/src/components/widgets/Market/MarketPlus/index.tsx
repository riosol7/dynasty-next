"use client";
import styles from "../Market.module.css";
import { POSITIONS } from "@/constants";
import { useLeagueContext, usePlayerContext } from "@/context";
import { Waivers } from "@/types";
import { calculatePercentageChange, processWaiverBids, findRecentWaivers, findLowestBid, findHighestBid, roundToHundredth } from "@/utils";
import React, { useState } from "react";

const positionStyles = {
    QB: styles.qbHUD,
    RB: styles.rbHUD,
    WR: styles.wrHUD,
    TE: styles.teHUD,
    K: styles.kHUD,
};

export default function MarketPlus() {
    const { legacyLeague } = useLeagueContext();
    const { players, loadPlayers } = usePlayerContext();
    const [ selectPosition, setSelectPosition ] = useState("QB");
    const [ selectSeason, setSelectSeason ] = useState("All Time");

    const waivers = processWaiverBids(legacyLeague, players);
    const selectedWaivers = waivers[selectPosition as keyof typeof waivers];
    const recentWaivers = findRecentWaivers(selectedWaivers);
    const percentageChanged = recentWaivers && calculatePercentageChange(recentWaivers[0]?.settings?.waiver_bid, recentWaivers[1]?.settings?.waiver_bid);
    const lowestBid = findLowestBid(selectedWaivers);
    const highestBid = findHighestBid(selectedWaivers);
    const volume = selectedWaivers?.length || 0;
    const averageBid = roundToHundredth(selectedWaivers?.reduce((r, c) => r + c.settings.waiver_bid, 0)! / volume);
    const lastPrice = recentWaivers && recentWaivers[0]?.settings?.waiver_bid || 0; 
    return (
        <div>
            <div className="pt-5">
                <p className="text-3xl pb-1">{selectPosition}</p>
                <p className="text-2xl">${lastPrice}</p>
                <div className="text-sm flex items-center">
                    <p className={`text-sm ${percentageChanged > 0 ? "text-green-500" : "text-red-500"}`
                    }>{percentageChanged > 0 ? "+" : ""}${lastPrice - (recentWaivers && recentWaivers[1]?.settings?.waiver_bid)} ({percentageChanged > 0 ? "+" : ""}{percentageChanged} %)
                    </p>
                    <p className="ml-1">{selectSeason}</p>
                </div>
            </div>
            <div className="py-5">
                <h2 className="pt-5 pb-4 border-b-2 border-gray-900 font-bold">{selectSeason} Key Statistics</h2>
                <div className="pt-4 flex items-center text-xs font-bold">
                    <p className="w-3/12">Last Price</p>
                    <p className="w-3/12">Top Spender</p>
                    <p className="w-3/12">Most Outbids</p>
                    <p className="w-3/12">Most Valuable</p>
                </div>
                <div className="pt-1 flex items-center text-xs">
                    <p className="w-3/12">$ {lowestBid}</p>
                    <p className="w-3/12">$ {highestBid}</p>
                    <p className="w-3/12">$ {averageBid}</p>
                    <p className="w-3/12">{volume}</p>
                </div>
                <div className="pt-4 flex items-center text-xs font-bold">
                    <p className="w-3/12">Low</p>
                    <p className="w-3/12">High</p>
                    <p className="w-3/12">Average</p>
                    <p className="w-3/12">Volume</p>
                </div>
                <div className="pt-1 flex items-center text-xs">
                    <p className="w-3/12">$ {lowestBid}</p>
                    <p className="w-3/12">$ {highestBid}</p>
                    <p className="w-3/12">$ {averageBid}</p>
                    <p className="w-3/12">{volume}</p>
                </div>
            </div>
            <div className="py-5 font-bold">
                <h2 className="pt-5 pb-4 border-b-2 border-gray-900">Positions</h2>
                <div className="pt-5 flex items-center justify-between">
                    {POSITIONS.slice().filter(position => position !== selectPosition).map((position, i) => {
                        const positionWaivers = waivers[position as keyof typeof waivers];
                        const recentPositionWaivers = findRecentWaivers(positionWaivers);
                        const positionPercentageChanged = recentPositionWaivers && calculatePercentageChange(recentPositionWaivers[0]?.settings?.waiver_bid, recentPositionWaivers[1]?.settings?.waiver_bid);
                        return (
                            <div key={i} className={`border border-[#2a2c3e] p-3 ${styles.hover}`} style={{width: "200px", borderRadius: "4px"}} onClick={() => setSelectPosition(position)}>
                                <p className="pb-5">{position}</p>
                                <div className={`pt-5 pb-2 ${positionPercentageChanged > 0 ? "text-green-500" : "text-red-500"}`}>
                                <p className="text-xl">${recentPositionWaivers && recentPositionWaivers[0]?.settings?.waiver_bid}</p>
                                <p className="font-light text-xs pt-1">{positionPercentageChanged > 0 ? "+" : ""}{positionPercentageChanged} %</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
