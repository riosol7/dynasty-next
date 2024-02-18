"use client";
import React, { useState } from "react";
import TrendChart from "@/components/charts/LineCharts/TrendChart";
import styles from "../Market.module.css";
import { POSITIONS } from "@/constants";
import { useLeagueContext, usePlayerContext } from "@/context";
import { Waivers } from "@/types";
import * as Interfaces from "@/interfaces";
import { useRouter, useSearchParams } from "next/navigation";
import PlayerRow from "../PlayerRow";
import PlayerHeader from "../PlayerHeader";
import { 
    calculatePercentageChange, 
    processWaiverBids, 
    findRecentWaivers,
    findLowestBid, 
    findHighestBid, 
    roundToHundredth, 
    filteredTransactionsBySeason, 
    getSortedTransactionRecords,  
    findTopSpender, 
    validateWaiverBidLeagues, 
} from "@/utils";
import VolumeChart from "@/components/charts/BarCharts/VolumeChart";

const positionStyles = {
    QB: styles.qbHUD,
    RB: styles.rbHUD,
    WR: styles.wrHUD,
    TE: styles.teHUD,
    K: styles.kHUD,
    DEF: styles.defHUD,
};

export default function MarketPlus() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectPosition: string = searchParams.get("position")!;
    const selectSeason: string = searchParams.get("season")!;
    const { legacyLeague } = useLeagueContext();
    const { players } = usePlayerContext();
    const [ asc, setAsc ] = useState<boolean>(false);
    const [ sort, setSort ] = useState<string>("DATE");
    const [ currentPage, setCurrentPage] = useState<number>(1);
    const [ recordsPerPage, setRecordsPerPage ] = useState<number>(5);
    const [ selectOwner, setSelectOwner ] = useState<string>("all");
    const validWaiverBidLeagues: Interfaces.League[] = validateWaiverBidLeagues(legacyLeague);

    const waivers: Interfaces.Waivers = processWaiverBids(legacyLeague, players);
    const positionWaivers: Interfaces.Transaction[] = waivers && waivers[selectPosition as keyof typeof waivers]!;
    const filteredWaivers: Interfaces.Transaction[] = filteredTransactionsBySeason(positionWaivers, selectSeason);
    
    // NEEDs CORRECTION ??
    const waiverBidsOwnerFiltered = filteredWaivers.filter(waiver => {
        if (selectOwner !== "all") {
            return waiver.creator === selectOwner;
        } else {
            return [];
        };
    });
    
    const records = getSortedTransactionRecords(waiverBidsOwnerFiltered!, sort, asc, currentPage, recordsPerPage);
    const npage = Math.ceil(waiverBidsOwnerFiltered?.length! / recordsPerPage);
    const pageNumbers = Array.from({ length: npage }, (_, i) => i + 1);
 
    const lowestBid = findLowestBid(filteredWaivers);
    const highestBid = findHighestBid(filteredWaivers);
    const volume = filteredWaivers?.length || 0;
    const averageBid = roundToHundredth(filteredWaivers?.reduce((r, c) => r + c.settings.waiver_bid, 0)! / volume);
    
    const handleSeason = (season: string) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("season", season);
        const currentUrl = window.location.href;
        const newUrl = currentUrl.split('?')[0] + '?' + newSearchParams.toString();
        router.replace(newUrl, undefined);
    };

    const handlePosition = (position: string) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("position", position);
        const currentUrl = window.location.href;
        const newUrl = currentUrl.split('?')[0] + '?' + newSearchParams.toString();
        router.replace(newUrl, undefined);
    };

    const handleOwner = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectOwner(e.target.value)
    };
    const topSpender = findTopSpender(waivers[selectPosition as keyof Waivers]);
    return (
        <div>
            <div className="pb-5">
                <div className="pt-3 pb-4 flex justify-between items-center">
                    <h2 className="font-bold">{selectSeason} Key Statistics</h2>
                    <div className={`flex items-center text-sm text-gray-400`}>
                        {validWaiverBidLeagues.slice().reverse().map((league, i) => 
                            <p key={i} className={`${styles.hoverText} ${selectSeason === league.season ? "text-white" : ""} ${i === 0 ? "" : "mx-4"}`} 
                            onClick={() => handleSeason(league.season)}>{league.season}</p>
                        )}
                        <p onClick={() => handleSeason("All Time")} className={`${styles.hoverText} ${selectSeason === "All Time" ? "text-white" : ""}`}>ALL</p>
                    </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                    {POSITIONS.slice().map((position, i) => {
                    const positionWaivers: Interfaces.Transaction[] = waivers && waivers[position as keyof typeof waivers]!;
                    const filteredWaivers: Interfaces.Transaction[] = filteredTransactionsBySeason(positionWaivers, selectSeason);
                    const recentPositionWaivers: Interfaces.Transaction[] = findRecentWaivers(filteredWaivers);
                    const currentPrice: number = recentPositionWaivers && recentPositionWaivers[0]?.settings?.waiver_bid || 0;
                    const prevPrice: number = recentPositionWaivers && recentPositionWaivers[1]?.settings?.waiver_bid || 0
                    const positionPercentageChanged: number = recentPositionWaivers && calculatePercentageChange(currentPrice, prevPrice) || 0;
                    return (
                        <div key={i} 
                        className={`${styles.positionBoxContainer} ${i === POSITIONS.length - 1 ? "" : "mr-4"}`} 
                        onClick={() => handlePosition(position)}>
                            <div className={`${styles.positionBoxOuterLayer} ${selectPosition === position ? positionStyles[position as keyof typeof positionStyles] : `bg-[#2a2c3e]`}`}>
                                <div className={`${styles.hover} ${styles.positionBoxInnerLayer}`}>
                                    <p className="pb-5">{position}</p>
                                    <div className={`pt-5 pb-2 ${positionPercentageChanged === 0 || positionPercentageChanged === Infinity ? "text-white" :
                                    positionPercentageChanged > 0 ? "text-green-500" : "text-red-500"}`}>
                                        <p className="text-xl">${currentPrice}</p>
                                        <div className="font-light text-xs pt-1">
                                            <p className={`text-sm ${positionPercentageChanged === 0 || positionPercentageChanged === Infinity ? "text-white" :
                                            positionPercentageChanged > 0 ? "text-green-500" : "text-red-500"}`}>
                                                {positionPercentageChanged > 0 ? "+" : ""}${currentPrice - (prevPrice)} ({positionPercentageChanged > 0 ? "+" : ""}{positionPercentageChanged} %)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );})}
                </div>
                <div className="">
                    <div className="pt-4 flex items-center text-xs font-bold">
                        <p className="w-3/12">Last Price</p>
                        <p className="w-3/12">Top Spender</p>
                        <p className="w-3/12">Most Outbids</p>
                        <p className="w-3/12">Most Valuable</p>
                    </div>
                    <div className="pt-1 flex items-center text-xs">
                        <p className="w-3/12">$ {lowestBid}</p>
                        <p className="w-3/12">{topSpender?.owner}: $ {topSpender?.bid}</p>
                        <p className="w-3/12">-</p>
                        <p className="w-3/12">-</p>
                    </div>
                    <div className="pt-4 flex items-center text-xs font-bold">
                        <p className="w-3/12">Low</p>
                        <p className="w-3/12">High</p>
                        <p className="w-3/12">Average</p>
                        <p className="w-3/12">Quantity</p>
                    </div>
                    <div className="pt-1 flex items-center text-xs">
                        <p className="w-3/12">$ {lowestBid}</p>
                        <p className="w-3/12">$ {highestBid}</p>
                        <p className="w-3/12">$ {averageBid}</p>
                        <p className="w-3/12">{volume}</p>
                    </div>
                </div>
            </div>
            <div className="py-5">
                <TrendChart waivers={filteredWaivers} height={300}/>
            </div>
            <div className={`py-5 border-[#2a2c3e]`}>
                <p className="my-5 pt-5 text-sm text-center font-bold border-b border-gray-800 pb-3">Volume</p>
                <VolumeChart waivers={filteredWaivers} height={40}/>
            </div>
            <div className="mt-5 pt-5">
                <div className="py-5 text-sm">
                    <PlayerHeader 
                    asc={asc} 
                    currentPage={currentPage}
                    handleOwner={handleOwner}
                    plus={true}
                    recordsPerPage={recordsPerPage}
                    selectOwner={selectOwner}
                    setAsc={setAsc}
                    setCurrentPage={setCurrentPage}
                    setRecordsPerPage={setRecordsPerPage}
                    setSort={setSort}
                    sort={sort}
                    waiverBids={waiverBidsOwnerFiltered}/>
                    {records.map((record, i) => 
                        <PlayerRow key={i} record={record} sort={sort}/>
                    )}
                </div>
            </div>
        </div>
    );
};
