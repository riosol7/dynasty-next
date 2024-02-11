"use client";
import TrendChart from "@/components/charts/LineCharts/TrendChart";
import styles from "../Market.module.css";
import { Icon } from "@iconify-icon/react";
import { PLAYER_BASE_URL, POSITIONS } from "@/constants";
import { useLeagueContext, usePlayerContext } from "@/context";
import { Waivers } from "@/types";
import { calculatePercentageChange, processWaiverBids, findRecentWaivers, findLowestBid, findHighestBid, roundToHundredth, filteredTransactionsBySeason, toDateTime, findPlayerByID, getSortedTransactionRecords, nextPage, prevPage, handleSort, findTopSpender } from "@/utils";
import React, { useState } from "react";
import * as Interfaces from "@/interfaces";

function TableHeaderCell({ label, sort, asc, setAsc, setSort}: Interfaces.SortProps) {
    const isSorting = sort === label;

    const handleClick = () => {
        if (isSorting) {
            setAsc(!asc);
        } else {
            handleSort(sort, label, asc, setAsc, setSort);
        };
    };

    const icon = asc ? "bi:caret-up-fill" : "bi:caret-down-fill";

    return (
        <div className={`font-bold ${label === "PLAYER" ? "w-4/12" : "w-2/12"}`}>
        {isSorting ? (
            <div className="flex items-center" onClick={handleClick}>
                <p className="text-[#7d91a6]">{label}</p>
                <Icon icon={icon} style={{ color: "#a9dfd8" }} />
            </div>
        ) : (
            <p className="text-[#7d91a6] cursor-pointer" onClick={handleClick}>{label}</p>
        )}
        </div>
    );
};

export default function MarketPlus() {
    const { legacyLeague } = useLeagueContext();
    const { players, loadPlayers } = usePlayerContext();
    const [ asc, setAsc ] = useState<boolean>(false);
    const [ sort, setSort ] = useState<string>("DATE");
    const [ currentPage, setCurrentPage] = useState<number>(1);
    const [ recordsPerPage, setRecordsPerPage ] = useState<number>(5);
    const [ selectOwner, setSelectOwner ] = useState<string>("all");
    const [ selectPosition, setSelectPosition ] = useState<string>("QB");
    const [ selectSeason, setSelectSeason ] = useState<string>("All Time");
    const filteredSeasonalBids = legacyLeague.map(league => {
        return {
            transactions: league.transactions.filter(transaction => transaction.settings !== null && transaction.settings.waiver_bid), 
            season: league.season
        }
    }).filter(league => league.transactions.length > 0);
    const waivers = processWaiverBids(legacyLeague, players);
    const positionWaivers = waivers[selectPosition as keyof typeof waivers];
    const filteredWaivers = filteredTransactionsBySeason(positionWaivers, selectSeason);
    const recentWaivers = findRecentWaivers(filteredWaivers);
    
    // NEEDs CORRECTION 
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
    const paginate = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const valueAsNumber = +e.target.value;
        setCurrentPage(valueAsNumber)
    };
    const percentageChanged = recentWaivers && calculatePercentageChange(recentWaivers[0]?.settings?.waiver_bid, recentWaivers[1]?.settings?.waiver_bid);
    const lowestBid = findLowestBid(filteredWaivers);
    const highestBid = findHighestBid(filteredWaivers);
    const volume = filteredWaivers?.length || 0;
    const averageBid = roundToHundredth(filteredWaivers?.reduce((r, c) => r + c.settings.waiver_bid, 0)! / volume);
    const lastPrice = recentWaivers && recentWaivers[0]?.settings?.waiver_bid || 0;
    const handleSeason = (season: string) => {
        setSelectSeason(season);
    };

    const handleOwner = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectOwner(e.target.value)
    };

    const topSpender = findTopSpender(waivers[selectPosition as keyof Waivers]);
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
                <TrendChart waivers={filteredWaivers} height={200}/>
            </div>
            <div className={`flex items-center border-b border-[#2a2c3e] text-sm text-gray-400 py-3`}>
                {filteredSeasonalBids.slice().reverse().map((league, i) => 
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
            <div className="pt-5">
                <div className="flex items-center justify-between pt-5 mt-5 pb-4 border-b-2 border-[#2a2c3e]">
                    <h2 className="font-bold">{selectSeason} Waivers</h2>
                    <div className="flex items-center border-[#0f0f0f] border-2 rounded-full p-1">
                        <Icon className={"text-xl"} 
                        onClick={() => prevPage(currentPage, setCurrentPage)} 
                        icon="material-symbols:chevron-left-rounded" 
                        style={{color: currentPage === 1 ? "#232227" : "#a9dfd8"}}/>
                        <select id={styles.selectPageNumber} className="text-xs" onChange={paginate} value={currentPage}>
                        {pageNumbers.map((number, i) => (
                            <option key={i} value={number}>{number}</option>
                        ))}
                    </select>
                        <Icon className={"text-xl"} 
                        onClick={() => nextPage(currentPage, npage, setCurrentPage)} 
                        icon="material-symbols:chevron-right-rounded" 
                        style={{color: waiverBidsOwnerFiltered?.length! > recordsPerPage ? "#a9dfd8" : "#232227"}}/>
                    </div>
                </div>
                <div className="py-5 text-sm">
                    <div className="flex items-center text-[#7d91a6] font-bold" style={{fontSize:".7rem"}}>
                        <TableHeaderCell
                            label="PLAYER"
                            sort={sort}
                            asc={asc}
                            setAsc={setAsc}
                            setSort={setSort}
                        />                        
                        <div className="w-3/12"> 
                            <select id={styles.selectTag} onChange={handleOwner} value={selectOwner}>
                                <option value={"all"}>ALL OWNERS</option>
                                {legacyLeague[0]?.users?.map((user, i) => (
                                    <option key={i} value={user.display_name}>{user.display_name}</option>
                                ))}
                            </select>
                        </div>
                        <TableHeaderCell
                            label="BID"
                            sort={sort}
                            asc={asc}
                            setAsc={setAsc}
                            setSort={setSort}
                        />
                        <TableHeaderCell
                            label="DATE"
                            sort={sort}
                            asc={asc}
                            setAsc={setAsc}
                            setSort={setSort}
                        />
                    </div>
                    {records.map((record, i) => 
                        <div key={i} className={`flex items-center py-2  ${i === records.length - 1 ? "" : "border-b border-dashed border-[#0f0f0f]"}`}>
                            <div className="w-4/12 flex items-center">
                                <div className={styles.playerHeadShot} style={{backgroundImage: `url(${PLAYER_BASE_URL}${record.waiver_player.player_id}.jpg)`}}></div>
                                <div className="pl-2">
                                    <p style={{color:sort === "PLAYER" ? "#a9dfd8" : ""}}>{record.waiver_player.first_name} {record.waiver_player.last_name}</p>
                                    <div className="text-gray-400" style={{ fontSize: "11px" }}>
                                        <p>{record.waiver_player.team} #{record.waiver_player.number}</p>
                                        <p>{record.waiver_player?.years_exp === 0 ? "ROOKIE" : `EXP ${record.waiver_player?.years_exp}`}</p>
                                    </div>
                                </div>
                            </div>
                            <p className="w-3/12">{record.creator}</p>
                            <p className="w-2/12" style={{color:sort === "BID" ? "#a9dfd8" : ""}}>${record.settings.waiver_bid}</p>
                            <p className="w-2/12" style={{color:sort === "DATE" ? "#a9dfd8" : ""}}>{toDateTime(record.created)}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="py-5 font-bold">
                <h2 className="pt-5 pb-4 border-b-2 border-[#2a2c3e]">Positions</h2>
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
