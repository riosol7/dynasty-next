import Image from "next/image";
import React, { useState, useEffect } from "react";
import styles from "./Market.module.css";
import { Icon } from "@iconify-icon/react";
import { useLeagueContext } from "@/context";
import { filteredTransactionsBySeason, findLogo, getSortedTransactionRecords, handleSort, nextPage, prevPage, primeIndicator, toDateTime } from "@/utils";
import { PLAYER_BASE_URL } from "@/constants";
import * as Interfaces from "@/interfaces";

const SELECT_TAG={border:"none", background:"inherit",color:"#7d91a6",fontSize:".7rem",fontWeight:"bold"};
const SHOW_PAGES={
    display: "flex",
    alignItems: "center",
    borderBottom:"none", 
    background:"inherit",
    color:"#e4e1e0",
    fontSize:"13.5px",
    fontWeight:"normal",
    paddingBlock:"3px",
};

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
        <div className={`font-bold ${label === "PLAYER" || label === "DATE" ? "w-3/12" : "w-1/12"}`}>
        {isSorting ? (
            <div className="flex items-center" onClick={handleClick}>
                <p className="m-0 text-[#7d91a6]">{label}</p>
                <Icon icon={icon} style={{ color: "#a9dfd8" }} />
            </div>
        ) : (
            <p className="m-0 text-[#7d91a6] cursor-pointer" onClick={handleClick}>{label}</p>
        )}
        </div>
    );
};

export default function WaiverActivity({ waivers, selectSeason }: Interfaces.MarketWidgetProps) {
    const { legacyLeague, loadLegacyLeague } = useLeagueContext();
    const [asc, setAsc] = useState(false);
    const [sort, setSort] = useState("DATE");
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(5);
    const [selectOwner, setSelectOwner] = useState("all");
    const [selectPosition, setSelectPosition] = useState("all");
    const positionWaivers = waivers && waivers[selectPosition as keyof typeof waivers];
    const filteredWaivers = filteredTransactionsBySeason(positionWaivers, selectSeason);
    const waiverBidsFiltered = filteredWaivers.filter(waiver => {
        if (selectOwner !== "all") {
            return waiver.creator === selectOwner;
        } else {
            return [];
        };
    });

    const records = getSortedTransactionRecords(waiverBidsFiltered!, sort, asc, currentPage, recordsPerPage);
    const npage = Math.ceil(waiverBidsFiltered?.length! / recordsPerPage);
    const pageNumbers = Array.from({ length: npage }, (_, i) => i + 1);
    
    const handleShowPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const valueAsNumber = +e.target.value;
        setRecordsPerPage(valueAsNumber);
    };
    const handlePosition = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectPosition(e.target.value)
    };

    const handleOwner = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectOwner(e.target.value)
    };
    const paginate = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const valueAsNumber = +e.target.value;
        setCurrentPage(valueAsNumber)
    };

    useEffect(() => {
        if (waiverBidsFiltered?.length! < recordsPerPage) {
            if (waiverBidsFiltered?.length! > 10) {
                setRecordsPerPage(15);
                setCurrentPage(1);
            } else if (waiverBidsFiltered?.length! > 5) {
                setRecordsPerPage(10);
                setCurrentPage(1);
            } else {
                setRecordsPerPage(5);
                setCurrentPage(1);
            }
        };
    }, [recordsPerPage, waiverBidsFiltered]);

    return (
        <div className="pt-4">
            <div className="flex items-center justify-between pb-1">
                <div className="flex items-center">
                    <Icon onClick={() => prevPage(currentPage, setCurrentPage)} icon="material-symbols:chevron-left-rounded" style={{fontSize: "1.5em", color: currentPage === 1 ? "#232227" : "#a9dfd8"}}/>
                    <div className="mx-2 flex items-center text-sm">
                        <select className="font-bold bg-transparent text-white border-none" onChange={paginate} value={currentPage}>
                            {pageNumbers.map((number, i) => (
                                <option key={i} value={number}>{number}</option>
                            ))}
                        </select>
                    </div>
                    <Icon onClick={() => nextPage(currentPage, npage, setCurrentPage)} icon="material-symbols:chevron-right-rounded" 
                    style={{fontSize: "1.5em", color: waiverBidsFiltered?.length! > recordsPerPage ? "#a9dfd8" : "#232227"}}/>
                </div>
                <div style={SHOW_PAGES}>
                    <p>Show</p>
                    <select style={{background:"inherit", color:"white", border:"none"}} onChange={handleShowPage} value={recordsPerPage}>
                        <option value={5}>5</option>
                        {waiverBidsFiltered?.length! > 5 ? <option value={10}>10</option> : <></>}
                        {waiverBidsFiltered?.length! > 10 ? <option value={15}>15</option> : <></>}
                    </select>
                </div>
            </div>
            <div className="flex items-center py-2 text-xs text-[#7d91a6]">
                <TableHeaderCell
                    label="PLAYER"
                    sort={sort}
                    asc={asc}
                    setAsc={setAsc}
                    setSort={setSort}
                />
                <TableHeaderCell
                    label="AGE"
                    sort={sort}
                    asc={asc}
                    setAsc={setAsc}
                    setSort={setSort}
                />
                <div className="w-2/12">
                    <select style={SELECT_TAG} onChange={handlePosition} value={selectPosition}>
                        <option value={"all"}>POSITION</option>
                        <option value={"QB"}>QB</option>
                        <option value={"RB"}>RB</option>
                        <option value={"WR"}>WR</option>
                        <option value={"TE"}>TE</option>
                        <option value={"K"}>K</option>
                    </select>
                </div>
                <div className="w-2/12">
                    <select style={SELECT_TAG} onChange={handleOwner} value={selectOwner}>
                    <option value={"all"}>OWNERS</option>
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
            {records?.map((record, i) => { 
                const player = record.waiver_player;
                return (
                    <div key={i} className={`flex items-center py-2 text-sm text-white ${i === records.length - 1 ? "" : "border-b border-solid border-[#2a2c3e]"}`}>
                        <div className="w-3/12 flex items-top">
                            <div className={styles.playerHeadShot}
                                style={{ backgroundImage: `url(${PLAYER_BASE_URL}${player.player_id}.jpg)`,}}>
                                {findLogo(player?.team).l !== "FA" ? (
                                <div className={styles.positionedLogo}>
                                    <Image alt="" width={35.8} height={35.8} src={findLogo(player?.team).l!}/>
                                </div>
                                ) : (
                                <></>
                                )}
                            </div>
                            <div className="pl-4">
                                <p style={{color:sort === "PLAYER" ? "#a9dfd8" : ""}}>{player?.first_name} {player?.last_name}</p>
                                <p className="text-xs text-gray-400 font-light">#{player.number} {player.team}</p>
                                <p className="font-bold text-xs text-gray-400">{player?.years_exp === 0 ? "ROOKIE" : `EXP ${player?.years_exp}`}</p>
                            </div>
                        </div>
                        <p className="w-1/12" style={{color:sort === "AGE" ? "#a9dfd8" : primeIndicator(player?.age, player?.position)}}>{player?.age}</p>
                        <p className="w-2/12" style={{color:sort === "all" ? "#a9dfd8" : ""}}>{player?.position}</p>
                        <p className="w-2/12" style={{color:sort === "all" ? "#a9dfd8" : ""}}>{record.creator}</p>
                        <p className="w-1/12" style={{color:sort === "BID" ? "#a9dfd8" : ""}}>${record.settings.waiver_bid}</p>
                        <p className="w-3/12" style={{color:sort === "DATE" ? "#a9dfd8" : ""}}>{toDateTime(record.created)}</p>
                    </div>
                );
            })}
        </div>
    );
};