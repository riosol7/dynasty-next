import Image from "next/image";
import React, { useState, useEffect } from "react";
import styles from "./Market.module.css";
import { Icon } from "@iconify-icon/react";
import { useLeagueContext } from "@/context";
import { filteredTransactionsBySeason, findLogo, getSortedTransactionRecords, handleSort, nextPage, prevPage, primeIndicator, toDateTime } from "@/utils";
import { PLAYER_BASE_URL, POSITIONS } from "@/constants";
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
        <div className={`font-bold ${
        label === "PLAYER" ? "w-3/12" : 
        label === "DATE" ? "w-3/12 flex justify-center" : 
        "w-1/12 text-center"}`}>
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

export default function WaiverActivity({ waivers, selectSeason }: Interfaces.MarketWidgetProps) {
    const { legacyLeague } = useLeagueContext();
    const [asc, setAsc] = useState(false);
    const [sort, setSort] = useState("DATE");
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(5);
    const [selectOwner, setSelectOwner] = useState("all");
    const [selectPosition, setSelectPosition] = useState("all");
    const positionWaivers = waivers && waivers[selectPosition as keyof typeof waivers];
    const filteredWaivers = filteredTransactionsBySeason(positionWaivers, selectSeason);
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
        if (waiverBidsOwnerFiltered?.length! < recordsPerPage) {
            if (waiverBidsOwnerFiltered?.length! > 10) {
                setRecordsPerPage(15);
                setCurrentPage(1);
            } else if (waiverBidsOwnerFiltered?.length! > 5) {
                setRecordsPerPage(10);
                setCurrentPage(1);
            } else {
                setRecordsPerPage(5);
                setCurrentPage(1);
            }
        };
    }, [recordsPerPage, waiverBidsOwnerFiltered]);

    return (
        <div className={styles.waiverContainer}>
            <div className={styles.waiverHeader}>
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
                <div className="w-2/12 text-center">
                    <select id={styles.selectTag} onChange={handlePosition} value={selectPosition}>
                        <option value={"all"}>ALL POSITIONS</option>
                        {POSITIONS.map((position, i) => 
                            <option key={i} value={position}>{position}</option>
                        )}
                    </select>
                </div>
                <div className="w-2/12 text-center">
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
            {records?.map((record, i) => { 
                const player = record.waiver_player;
                return (
                    <div key={i} className={`py-3 flex items-center text-sm text-white ${i === records.length - 1 ? "" : "border-b border-dashed border-[#0f0f0f]"}`}>
                        <div className="w-3/12 flex items-center">
                            {player.position !== "DEF" ?
                            <div className={styles.playerHeadShot}
                                style={{ backgroundImage: `url(${PLAYER_BASE_URL}${player.player_id}.jpg)`,}}>
                                {findLogo(player?.team).l !== "FA" ? (
                                <></>
                                // <div className={styles.positionedLogo}>
                                //     <div className={styles.nflTeamLogo} style={{ backgroundImage: `url(${findLogo(player?.team).l!})` }}></div>
                                // </div>
                                ) : (
                                <></>
                                )}
                            </div>
                            : <Image alt="" width={60} height={60} src={findLogo(player?.team).l!}/>}
                            <div className="pl-3">
                                <p className="" style={{color:sort === "PLAYER" ? "#a9dfd8" : ""}}>{player?.first_name} {player?.last_name}</p>
                                {player.position === "DEF" ? <></> : 
                                <>
                                    <p className="text-xs text-gray-400 font-light">#{player.number} {player.team || "FA"}</p>
                                    <p style={{ fontSize: "11px" }} className="text-gray-400">{player?.years_exp === 0 ? "ROOKIE" : `EXP ${player?.years_exp}`}</p>
                                </>}
                            </div>
                        </div>
                        <p className={`w-1/12 ${styles.waiverCell}`} style={{color:sort === "AGE" ? "#a9dfd8" : primeIndicator(player?.age, player?.position)}}>{player?.age}</p>
                        <p className={`w-2/12 ${styles.waiverCell}`} style={{color:sort === "all" ? "#a9dfd8" : ""}}>{player?.position}</p>
                        <p className={`w-2/12 ${styles.waiverCell}`}>{record.creator}</p>
                        <p className={`w-1/12 ${styles.waiverCell}`} style={{color:sort === "BID" ? "#a9dfd8" : ""}}>${record.settings.waiver_bid}</p>
                        <p className={`w-3/12 ${styles.waiverCell}`} style={{color:sort === "DATE" ? "#a9dfd8" : ""}}>{toDateTime(record.created)}</p>
                    </div>
                );
            })}
            <div className={styles.waiverPagination}>
                <Icon className={styles.paginateArrows} 
                onClick={() => prevPage(currentPage, setCurrentPage)} 
                icon="material-symbols:chevron-left-rounded" 
                style={{color: currentPage === 1 ? "#232227" : "#a9dfd8"}}/>
                <div id={styles.showPages}>
                    <p style={{color:"gray"}}>Showing</p>
                    <select style={{ background:"black", color:"white", border:"none" }} onChange={handleShowPage} value={recordsPerPage}>
                        <option value={5}>5</option>
                        {waiverBidsOwnerFiltered?.length! > 5 ? <option value={10}>10</option> : <></>}
                        {waiverBidsOwnerFiltered?.length! > 10 ? <option value={15}>15</option> : <></>}
                    </select>
                    <p style={{color:"gray"}}>out of {waiverBidsOwnerFiltered?.length}</p>
                </div>
                <p className="mx-2 font-bold" style={{color:"#111827"}}>|</p>
                <div className="mr-2 flex items-center">
                    <p style={{color:"gray"}}>Page</p>
                    <select id={styles.selectPageNumber} onChange={paginate} value={currentPage}>
                        {pageNumbers.map((number, i) => (
                            <option key={i} value={number}>{number}</option>
                        ))}
                    </select>
                </div>
                <Icon className={styles.paginateArrows} 
                onClick={() => nextPage(currentPage, npage, setCurrentPage)} 
                icon="material-symbols:chevron-right-rounded" 
                style={{color: waiverBidsOwnerFiltered?.length! > recordsPerPage ? "#a9dfd8" : "#232227"}}/>
            </div>
        </div>
    );
};