"use client";
import Image from "next/image";
import { Icon } from "@iconify-icon/react";
import * as Interfaces from "@/interfaces"; 
import React, { useState } from "react";
import styles from "./PlayerList.module.css";
import { 
    useDynastyProcessContext, 
    useFantasyCalcContext, 
    useFantasyMarket, 
    useFantasyProContext, 
    useKTCContext, 
    useLeagueContext, 
    usePlayerContext, 
    useSuperFlexContext 
} from "@/context";
import { 
    calculatePercentage,
    convertToFeet, 
    findUserByPlayerID, 
    formatDate, 
    getSortedPlayerRecords, 
    nextPage, 
    prevPage, 
    primeIndicator, 
    processPlayers, 
    processRosters, 
    sortPlayersByFantasyMarket,
    totalFantasyPointsByPlayerID,
} from "@/utils";
import { PLAYER_BASE_URL, POSITIONS, POSITION_COLORS, SLEEPER_AVATAR_BASE_URL } from "@/constants";

export default function PlayerList({ type }: { type? : string})  {
    const { fantasyMarket } = useFantasyMarket()!;
    const { legacyLeague, loadLegacyLeague } = useLeagueContext(); 
    const { players, loadPlayers } = usePlayerContext();
    const { ktc, loadKTC } = useKTCContext();
    const { superFlex, loadSuperFlex } = useSuperFlexContext();
    const { fc, loadFC } = useFantasyCalcContext();
    const { dp, loadDP } = useDynastyProcessContext();
    const { fantasyPro, loadFantasyPro } = useFantasyProContext();
    const [asc, setAsc] = useState(false);
    const [sort, setSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(15);
    const [selectOwner, setSelectOwner] = useState("");
    const [selectPosition, setSelectPosition] = useState("");
    const [selectFantasySeason, setSelectFantasySeason] = useState("All Time");

    const processedPlayers = processPlayers(players, ktc, superFlex, fc, dp, fantasyPro);
    const filteredPlayers = type === "available" ? processedPlayers.filter(player => findUserByPlayerID(player.player_id, legacyLeague[0]).display_name === "")
    : processedPlayers;
    const processedRosters = processRosters(legacyLeague[0], processedPlayers);
    const sortedPlayers = sortPlayersByFantasyMarket(filteredPlayers, fantasyMarket);
    const records = getSortedPlayerRecords(sortedPlayers, sort, asc, currentPage, recordsPerPage);
    const npage = Math.ceil(processedPlayers?.length / recordsPerPage);
    const pageNumbers = Array.from({ length: npage }, (_, i) => i + 1);
    const loading = loadLegacyLeague && loadPlayers && loadKTC && loadSuperFlex && loadFC && loadDP && loadFantasyPro;
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
    const handleSeason = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectFantasySeason(e.target.value);
    };
    return (
        <div>
            
            <div className="flex items-center justify-between pt-5 pb-4 border-b-2 border-solid border-gray-900">
                {type === "available" ? <h2>Available Players</h2> : ""}
                <div className="flex items-center">
                    <Icon onClick={() => prevPage(currentPage, setCurrentPage)} icon="material-symbols:chevron-left-rounded" style={{fontSize: "1.5em", color: currentPage === 1 ? "#232227" : "#a9dfd8"}}/>
                    <div className="mx-2 flex items-center text-sm">
                        <select className="font-bold bg-transparent text-white border-none" onChange={paginate} value={currentPage}>
                            {pageNumbers.map((number, i) => (
                                <option key={i} value={number}>{number}</option>
                            ))}
                        </select>
                    </div>
                    <Icon onClick={() => nextPage(currentPage, npage, setCurrentPage)} icon="material-symbols:chevron-right-rounded" style={{fontSize: "1.5em", color: sortedPlayers?.length > recordsPerPage ? "#a9dfd8" : "#232227"}}/>
                </div>
                <div className="flex align-items-center">
                    <div className={styles.showPages}>
                        <p>Show</p>
                        <select style={{background:"inherit", color:"white", border:"none"}} onChange={handleShowPage} value={recordsPerPage}>
                            <option value={15}>15</option>
                            {sortedPlayers?.length > 15 ? <option value={30}>30</option> : <></>}
                            {sortedPlayers?.length > 30 ? <option value={50}>50</option> : <></>}
                        </select>
                    </div>
                    <select className="ml-5" onChange={handleSeason} value={selectFantasySeason} style={{fontSize:".8em",background:"black", color:"white"}}>
                        {legacyLeague?.slice().map((league, i) => 
                            <option key={i} value={league.season}>{league.season}</option>
                        )}
                        <option value="All Time">All Time</option>
                    </select>
                </div>
            </div>
            <div className="flex items-center text-xs text-center font-bold text-[#7d91a6] border-b border-dashed border-[#2a2c3e] py-2">
                <p className="w-1/12">FANTASY</p>
                <p className="w-1/12">POSITION</p>
                <div className="w-3/12 flex text-center">
                    <p className="w-7/12">PLAYER</p>
                    <p className="w-5/12">SCORE</p>
                </div>
                <p className="w-2/12">PASSING</p>
                <p className="w-2/12">RECEIVING</p>
                <p className="w-2/12">RUSHING</p>
                <p className="w-1/12">DYNASTY</p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#7d91a6] border-b border-solid border-[#0f0f0f] py-1">
                <div className="w-1/12 flex items-center">
                    <p className="w-6/12 flex items-center">OVR <Icon icon={`bi:caret-${asc ? "up" : "down"}-fill`} style={{ color: "#a9dfd8" }}/></p>
                    <p className="w-6/12">POS</p>
                </div>
                <div className="w-1/12 text-center flex items-center">
                    {POSITIONS.map((position, idx) =>
                        <p key={idx} className="w-3/12">{position}</p>
                    )}
                </div>
                <div className="w-3/12 flex">
                    <div className="w-7/12 flex items-center pl-3">
                        <p className="w-6/12">AGE</p>
                        <p className="w-6/12">TEAM</p>
                    </div>
                    <div className="w-5/12 flex items-center">
                        <p className="w-6/12">FPTS</p>
                        <p className="w-6/12 flex items-center">PPTS <Icon icon={`bi:caret-${asc ? "up" : "down"}-fill`} style={{ color: "#a9dfd8" }}/></p>
                    </div>
                </div>
                <div className="w-2/12 flex items-center text-center">
                    <p className="w-3/12">CMP</p>
                    <p className="w-3/12">ATT</p>
                    <p className="w-3/12">YD</p>
                    <p className="w-3/12">TD</p>
                </div>
                <div className="w-2/12 flex items-center text-center">                
                    <p className="w-3/12">REC</p>
                    <p className="w-3/12">TAR</p>
                    <p className="w-3/12">YD</p>
                    <p className="w-3/12">TD</p>
                </div>
                <div className="w-2/12 flex items-center text-center">
                    <p className="w-4/12">ATT</p>
                    <p className="w-4/12">YD</p>
                    <p className="w-4/12">TD</p>
                </div>
                <p className="w-1/12 text-center">VALUE</p>
            </div>
            {records?.map((record, i) => {
                const user = findUserByPlayerID(record.player_id, legacyLeague[0]);
                const fantasyPoints = totalFantasyPointsByPlayerID(record.player_id, legacyLeague, selectFantasySeason);
                return (
                    <div key={i} className="text-sm flex items-center py-2 border-b border-dashed border-[#0f0f0f]">
                        <div className="w-1/12 font-bold flex items-center justify-center">
                            <p className="w-6/12">{(record[fantasyMarket as keyof typeof record] as Interfaces.MarketContent)?.rank || 0}</p>
                            <p className="w-6/12">({(record[fantasyMarket as keyof typeof record] as Interfaces.MarketContent)?.positionRank || 0})</p>
                        </div>
                        <div className={`w-1/12`}>
                            <div className={`${styles.headshot}`} style={{backgroundImage: `url(${PLAYER_BASE_URL}${record.player_id}.jpg)`}}></div>
                            <div className="flex items-center justify-center text-xs font-bold pt-1"> 
                                <p className={styles.positionHUD} style={{color: POSITION_COLORS[record.position as keyof typeof POSITION_COLORS]}}>{record.position}</p>
                                <p className="ml-1">{record.team} #{record.number}</p>
                            </div>
                        </div>
                        <div className="w-3/12 px-2 font-bold">
                            <p>{record.full_name}</p>
                            <div className="flex items-center text-xs pt-1">
                                <p style={{color: primeIndicator(record.age, record.position)}}><span className="text-gray-300">AGE </span>{record.age}</p>
                                <p className="ml-1 text-gray-300">({formatDate(record.birth_date || "0000-00-00")})</p>
                            </div>
                            <div className="text-end">
                                <div className="flex justify-between items-end">
                                    <div className="pt-1 flex items-center">
                                        {user?.avatar !== "," ?
                                            <Image className={`${styles.ownerLogo}`} alt="avatar" width={25} height={25} src={`${SLEEPER_AVATAR_BASE_URL}${user?.avatar}`}/>
                                        : "FA"}
                                        <p className="text-xs text-center ml-1">{user.display_name}</p>
                                    </div>
                                    <p className="text-xs">{fantasyPoints.fpts} / {fantasyPoints.ppts}<span className="font-bold" style={{color:"#7c90a5"}}> pts</span></p>
                                </div>
                                <div className="bg-gray-700 rounded-full h-1 my-1">
                                    <div className="bg-indigo-400 h-1 rounded-full" style={{ width: `${calculatePercentage(fantasyPoints.fpts, fantasyPoints.ppts)}%` }}></div>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-[#7c90a5] text-xs">since 2021</p>
                                    <p className="text-xs">({`${calculatePercentage(fantasyPoints.fpts, fantasyPoints.ppts)}%`})</p>
                                </div>
                            </div>
                            <div className="pt-1">
                                <div className="flex items-center justify-between text-xs py-1">
                                    <div>
                                        <p className="text-gray-300">height</p>
                                        <p className="text-white">{convertToFeet(Number(record.height))}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-300">weight</p>
                                        <p className="text-white">{record.weight}<span className="font-light">lbs</span></p>
                                    </div>
                                    <div>
                                        <p className="text-gray-300">exp</p>
                                        <p className="text-white">{record.years_exp}<span className="font-light">yrs</span></p>
                                    </div>
                                    <div>
                                        <p className="text-gray-300">college</p>
                                        <p className="text-white">{record.college}</p>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <div className="w-2/12 flex items-center text-center">
                            <p className="w-3/12">CMP</p>
                            <p className="w-3/12">ATT</p>
                            <p className="w-3/12">YD</p>
                            <p className="w-3/12">TD</p>
                        </div>
                        <div className="w-2/12 flex items-center text-center">
                            <p className="w-3/12">REC</p>
                            <p className="w-3/12">TAR</p>
                            <p className="w-3/12">YD</p>
                            <p className="w-3/12">TD</p>
                        </div>
                        <div className="w-2/12 flex items-center text-center">
                            <p className="w-4/12">ATT</p>
                            <p className="w-4/12">YD</p>
                            <p className="w-4/12">TD</p>
                        </div>
                        <p className="w-1/12 text-center">{(record[fantasyMarket as keyof typeof record] as Interfaces.MarketContent).value} ({(record[fantasyMarket as keyof typeof record] as Interfaces.MarketContent).trend})</p>
                    </div>
                )
            })}
        </div>
    );
};