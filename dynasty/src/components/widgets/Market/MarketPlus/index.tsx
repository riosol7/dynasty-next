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
            <div className="">
                <div className="flex items-center justify-between">
                    {POSITIONS.slice().map((position, i) => {
                        const positionWaivers: Interfaces.Transaction[] = waivers && waivers[position as keyof typeof waivers]!;
                        const filteredWaivers: Interfaces.Transaction[] = filteredTransactionsBySeason(positionWaivers, selectSeason);
                        const recentPositionWaivers: Interfaces.Transaction[] = findRecentWaivers(filteredWaivers);
                        const positionPercentageChanged = recentPositionWaivers && calculatePercentageChange(recentPositionWaivers[0]?.settings?.waiver_bid, recentPositionWaivers[1]?.settings?.waiver_bid);
                        const percentageChanged = recentPositionWaivers && calculatePercentageChange(recentPositionWaivers[0]?.settings?.waiver_bid, recentPositionWaivers[1]?.settings?.waiver_bid);
                        const lastPrice = recentPositionWaivers && recentPositionWaivers[0]?.settings?.waiver_bid || 0;

                        return (
                            <div key={i} className={`${styles.positionBox} border border-[${selectPosition === position ? "#a9dfd8" : "#2a2c3e"}] ${styles.hover} ${i === POSITIONS.length - 1 ? "" : "mr-4"}`} onClick={() => handlePosition(position)}>
                                <p className="pb-5">{position}</p>
                                <div className={`pt-5 pb-2 ${positionPercentageChanged > 0 ? "text-green-500" : "text-red-500"}`}>
                                    <p className="text-xl">${recentPositionWaivers && recentPositionWaivers[0]?.settings?.waiver_bid}</p>
                                    <div className="font-light text-xs pt-1">
                                        <p className={`text-sm ${percentageChanged > 0 ? "text-green-500" : "text-red-500"}`}>
                                            {percentageChanged > 0 ? "+" : ""}${lastPrice - (recentPositionWaivers && recentPositionWaivers[1]?.settings?.waiver_bid)} ({percentageChanged > 0 ? "+" : ""}{percentageChanged} %)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="py-5">
                <TrendChart waivers={filteredWaivers} height={200}/>
            </div>
            <div className={`flex items-center border-b border-[#2a2c3e] text-sm text-gray-400 py-3`}>
                {validWaiverBidLeagues.slice().reverse().map((league, i) => 
                    <p key={i} className={`${styles.hoverText} ${selectSeason === league.season ? "text-white" : ""} ${i === 0 ? "" : "mx-4"}`} 
                    onClick={() => handleSeason(league.season)}>{league.season}</p>
                )}
                <p onClick={() => handleSeason("All Time")} className={`${styles.hoverText} ${selectSeason === "All Time" ? "text-white" : ""}`}>ALL</p>
            </div>
            <div className="pt-2 pb-5">
                <h2 className="pt-5 pb-4 border-b-2 border-[#2a2c3e] font-bold">{selectSeason} Key Statistics</h2>
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
                    <p className="w-3/12">Volume</p>
                </div>
                <div className="pt-1 flex items-center text-xs">
                    <p className="w-3/12">$ {lowestBid}</p>
                    <p className="w-3/12">$ {highestBid}</p>
                    <p className="w-3/12">$ {averageBid}</p>
                    <p className="w-3/12">{volume}</p>
                </div>
            </div>
            <div className="pt-5 mt-5">
                <div className="flex items-center pt-5 mt-5">
                    <h2 className="font-bold">{selectSeason} Waivers</h2>
                </div>
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
