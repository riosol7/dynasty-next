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
};

export default function MarketPlus() {
    const { legacyLeague } = useLeagueContext();
    const { players, loadPlayers } = usePlayerContext();
    const [ selectPosition, setSelectPosition ] = useState("QB");
    const [ selectSeason, setSelectSeason ] = useState("All Time");

    const waivers = processWaiverBids(legacyLeague, players);
    const selectedWaivers = waivers[selectPosition as keyof typeof waivers];
    const recentWaivers = findRecentWaivers(selectedWaivers);
    const percentageChanged = calculatePercentageChange(recentWaivers[0]?.settings?.waiver_bid, recentWaivers[1]?.settings?.waiver_bid);
    const lowestBid = findLowestBid(selectedWaivers);
    const highestBid = findHighestBid(selectedWaivers);
    const volume = selectedWaivers.length;
    const averageBid = roundToHundredth(selectedWaivers?.reduce((r, c) => r + c.settings.waiver_bid, 0)! / volume);

    // POSITIONS
    return (
        <div>
            <div className="text-2xl pt-5">
                <p>$ {recentWaivers[0]?.settings?.waiver_bid}</p>
                <div className="text-sm flex items-center">
                    <p className={`text-sm ${percentageChanged > 0 ? "text-green-500" : "text-red-500"}`
                    }>{percentageChanged > 0 ? "+" : ""}${recentWaivers[0]?.settings?.waiver_bid - recentWaivers[1]?.settings?.waiver_bid} ({percentageChanged > 0 ? "+" : ""}{percentageChanged} %)
                    </p>
                    <p className="ml-1">{selectSeason}</p>
                </div>
            </div>
            <div className="py-5">
                <h2 className="pt-5 pb-4 border-b-2 border-gray-900">{selectSeason} Key Statistics</h2>
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
        </div>
    );
};
