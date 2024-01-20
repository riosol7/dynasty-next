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
    findLeagueBySeason, 
    findPlayerOwnedBy, 
    findUserByPlayerID, 
    formatDate, 
    getMatchups, 
    getSortedPlayerRecords, 
    nextPage, 
    prevPage, 
    primeIndicator, 
    processPlayers, 
    processRosters, 
    sortPlayersByFantasyMarket,
    totalFantasyPointsByPlayerID,
} from "@/utils";
import { PLAYER_BASE_URL, POSITION_COLORS, SLEEPER_AVATAR_BASE_URL, VALID_POSITIONS } from "@/constants";

export default function PlayerList({ type }: { type? : string})  {
    const { fantasyMarket } = useFantasyMarket()!;
    const { legacyLeague, loadLegacyLeague } = useLeagueContext(); 
    const { players, loadPlayers } = usePlayerContext();
    const { ktc, loadKTC } = useKTCContext();
    const { superFlex, loadSuperFlex } = useSuperFlexContext();
    const { fc, loadFC } = useFantasyCalcContext();
    const { dp, loadDP } = useDynastyProcessContext();
    const { fantasyPro, loadFantasyPro } = useFantasyProContext();
    const [asc, setAsc] = useState<boolean>(false);
    const [sort, setSort] = useState("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [recordsPerPage, setRecordsPerPage] = useState<number>(15);
    const [selectOwner, setSelectOwner] = useState("");
    const [selectPosition, setSelectPosition] = useState("");
    const [selectFantasySeason, setSelectFantasySeason] = useState<string>("All Time");
    const [selectRanking, setSelectRanking] = useState<string>("DYNASTY");

    const foundSeason: Interfaces.League = findLeagueBySeason(selectFantasySeason, legacyLeague);
    const numOfWeeks: number = getMatchups(foundSeason.matchups).length;
    const weeksArray: number[] = Array.from({ length: numOfWeeks }, (_, index) => index + 1);
    const processedPlayers: Interfaces.Player[] = processPlayers(players, ktc, superFlex, fc, dp, fantasyPro);
    const availablePlayers = processedPlayers?.filter(player => findUserByPlayerID(player.player_id, legacyLeague[0]).display_name === "");
    const filteredPlayers = type === "available" ? availablePlayers : processedPlayers;
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
    const handleSelectRanking = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectRanking(e.target.value);
    };
    return (
        <div>
            <div className="flex items-center justify-between pt-5 pb-3 border-b-2 border-solid border-[#2a2c3e]">
                {type === "available" ? <h2 className="font-bold">Available Players</h2> :
                <div className="flex items-center">
                    <Icon icon="solar:ranking-bold-duotone" style={{color: "#a9dfd8", fontSize:"1.6rem"}}/>
                    <h2 className="font-bold ml-1">Player Rankings</h2>                
                </div>
                }
                <div className="flex align-items-center" style={{fontSize:"13px"}}>
                    <select className={styles.selectTag} onChange={handleSeason} value={selectFantasySeason}>
                        {legacyLeague?.slice().map((league, i) => 
                            <option key={i} value={league.season}>{league.season}</option>
                        )}
                        <option value="All Time">All Time</option>
                    </select>
                    {selectFantasySeason !== "All Time" ?
                    <>
                        <p className="mx-2 font-bold" style={{color:"#111827"}}>|</p>
                        <select className={styles.selectTag}>
                            <option>Season</option>
                            {weeksArray.map((week, i) =>
                                <option key={i} value={week}>{`Week ${week}`}</option>
                            )}
                        </select>
                    </>
                    :<></>}
                    <p className="mx-2 font-bold" style={{color:"#111827"}}>|</p>
                    <div className={styles.showPages}>
                        <p>Show</p>
                        <select className={styles.selectTag} onChange={handleShowPage} value={recordsPerPage}>
                            <option value={15}>15</option>
                            {sortedPlayers?.length > 15 ? <option value={30}>30</option> : <></>}
                            {sortedPlayers?.length > 30 ? <option value={50}>50</option> : <></>}
                        </select>
                    </div>
                    <p className="mx-2 font-bold" style={{color:"#111827"}}>|</p>
                    <div className="flex items-center">
                        <Icon onClick={() => prevPage(currentPage, setCurrentPage)} icon="material-symbols:chevron-left-rounded" 
                        style={{fontSize: "1.5em", color: currentPage === 1 ? "#232227" : "#a9dfd8"}}/>
                        <div className="mx-2 flex items-center text-sm">
                            <select className={styles.selectTag} onChange={paginate} value={currentPage}>
                                {pageNumbers.map((number, i) => (
                                    <option key={i} value={number}>{number}</option>
                                ))}
                            </select>
                        </div>
                        <Icon onClick={() => nextPage(currentPage, npage, setCurrentPage)} icon="material-symbols:chevron-right-rounded" 
                        style={{fontSize: "1.5em", color: sortedPlayers?.length > recordsPerPage ? "#a9dfd8" : "#232227"}}/>
                    </div>
                </div>
            </div>
            <div className="text-center">
                <div className="flex items-center text-xs font-bold text-[#7d91a6] border-b-2 border-dotted border-[#0f0f0f] py-2">
                    <p className="w-44">
                        <select className={styles.selectTag} onChange={handleSelectRanking} value={selectRanking} style={{color: "#7d91a6"}}>
                            <option value={"DYNASTY"}>DYNASTY</option>
                            <option value={"FANTASY"}>FANTASY</option>
                        </select>
                    </p>
                    <p className="w-1/12">POSITION</p>
                    <div className="w-3/12 flex">
                        <p className="w-7/12">PLAYER</p>
                        <p className="w-5/12">SCORE</p>
                    </div>
                    <p className="w-2/12">PASSING</p>
                    <p className="w-2/12">RECEIVING</p>
                    <p className="w-2/12">RUSHING</p>
                </div>
                <div className="flex items-center text-xs text-[#7d91a6] border-b-2 border-solid border-[#0f0f0f] py-2 ">
                    <div className={`flex items-center ${selectRanking === "DYNASTY" ? "w-44" : "w-1/12"}`}>
                        {selectRanking === "DYNASTY" ?
                        <>
                            <p className={`w-3/12 ${styles.sortDivider} border-r-2`}>OVR <Icon icon={`bi:caret-${asc ? "up" : "down"}-fill`} style={{ color: "#a9dfd8" }}/></p>
                            <p className={`w-3/12 ${styles.sortDivider} border-r-2`}>POS</p>
                            <p className={`w-6/12 ${styles.sortDivider}`}>VALUE</p>
                        </>
                        :
                        <>
                            <p className={`w-6/12 ${styles.sortDivider} border-r-2`}>OVR <Icon icon={`bi:caret-${asc ? "up" : "down"}-fill`} style={{ color: "#a9dfd8" }}/></p>
                            <p className={`w-6/12 ${styles.sortDivider}`}>POS</p>
                        </>}
                    </div>
                    <div className="w-1/12 flex items-center">
                        {VALID_POSITIONS.map((position, idx) =>
                            <p key={idx}
                            style={{color: POSITION_COLORS[position as keyof typeof POSITION_COLORS]}}
                            className={`w-3/12 border-[#0f0f0f] ${idx === 0 ? "border-l-2" : idx === position.length ? "" : "border-x-2"}`}>{position}</p>
                        )}
                    </div>
                    <div className="w-3/12 flex">
                        <div className="w-7/12 flex items-center pl-3">
                            <p className={`w-6/12 ${styles.sortDivider} border-r-2`}>AGE</p>
                            <p className={`w-6/12 ${styles.sortDivider} border-r-2`}>TEAM</p>
                        </div>
                        <div className="w-5/12 flex items-center">
                            <p className={`w-6/12 ${styles.sortDivider} border-r-2`}>FPTS</p>
                            <p className={`w-6/12 ${styles.sortDivider} border-r-2`}>PPTS <Icon icon={`bi:caret-${asc ? "up" : "down"}-fill`} style={{ color: "#a9dfd8" }}/></p>
                        </div>
                    </div>
                    <div className="w-2/12 flex items-center">
                        <p className={`w-3/12 ${styles.sortDivider} border-r-2`}>CMP</p>
                        <p className={`w-3/12 ${styles.sortDivider} border-r-2`}>ATT</p>
                        <p className={`w-3/12 ${styles.sortDivider} border-r-2`}>YD</p>
                        <p className={`w-3/12 ${styles.sortDivider} border-r-2`}>TD</p>
                    </div>
                    <div className="w-2/12 flex items-center">                
                        <p className={`w-3/12 ${styles.sortDivider} border-r-2`}>REC</p>
                        <p className={`w-3/12 ${styles.sortDivider} border-r-2`}>TAR</p>
                        <p className={`w-3/12 ${styles.sortDivider} border-r-2`}>YD</p>
                        <p className={`w-3/12 ${styles.sortDivider} border-r-2`}>TD</p>
                    </div>
                    <div className="w-2/12 flex items-center">
                        <p className={`w-4/12 ${styles.sortDivider} border-r-2`}>ATT</p>
                        <p className={`w-4/12 ${styles.sortDivider} border-r-2`}>YD</p>
                        <p className={`w-3/12 ${styles.sortDivider}`}>TD</p>
                    </div>
                </div>
            </div>
            {records?.map((record, i) => {
                const user = findUserByPlayerID(record.player_id, legacyLeague[0]);
                const fantasyPoints = totalFantasyPointsByPlayerID(record.player_id, legacyLeague, selectFantasySeason);
                const marketContentInfo = (record[fantasyMarket as keyof typeof record] as Interfaces.MarketContent);
                return (
                    <div key={i} className="text-sm flex items-center py-2 border-b border-dashed border-[#0f0f0f]">
                        <div className={`flex items-center justify-center text-center ${selectRanking === "DYNASTY" ? "w-44" : "w-1/12"}`}>
                            {selectRanking === "DYNASTY" ?
                            <>
                                <p className="w-3/12">{marketContentInfo?.rank || 0}</p>
                                <p className="w-3/12">{marketContentInfo?.positionRank || 0}</p>
                                <div className="w-6/12 font-light">
                                    <p className="font-normal">{marketContentInfo?.value}</p>
                                    <div className="flex items-center justify-center pt-1">
                                        {marketContentInfo?.trend === "0" ?
                                        <></>:
                                        <Icon className="trendIcon" 
                                        icon={
                                            marketContentInfo?.trend === null || marketContentInfo?.trend === undefined ? "" : 
                                            `solar:graph-${marketContentInfo?.trend?.includes("-") ? "down" : "up"}-line-duotone`} 
                                        style={{fontSize:"20px", 
                                        color: 
                                        marketContentInfo?.trend === null || marketContentInfo?.trend === undefined ? "" : 
                                        marketContentInfo?.trend?.includes("-") ? "#F12B05" : "#35C2BC"
                                        }}/>}
                                        <p className="pl-1 text-xs">{
                                        marketContentInfo?.trend === null || marketContentInfo?.trend === undefined ? "" : 
                                        marketContentInfo?.trend === "0" ? "" :
                                        marketContentInfo?.trend?.includes("-") ? marketContentInfo?.trend :
                                        `+${marketContentInfo?.trend}`
                                        }</p>
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <p className="w-6/12">{0}</p>
                                <p className="w-6/12">
                                    <span className="font-normal">(</span>
                                    {0}
                                    <span className="font-normal">)</span>
                                </p>
                            </>}
                        </div>
                        <div className={`w-1/12`}>
                            <div className={`${styles.headshot}`} style={{backgroundImage: `url(${PLAYER_BASE_URL}${record.player_id}.jpg)`}}></div>
                            <div className="flex items-center justify-center text-xs font-bold pt-1"> 
                                <p className={styles.positionHUD} style={{color: POSITION_COLORS[record.position as keyof typeof POSITION_COLORS]}}>{record.position}</p>
                                <p className="ml-1">{record.team} <span className="font-light">#{record.number}</span></p>
                            </div>
                        </div>
                        <div className="w-3/12 px-2">
                            <p className="font-bold">{record.full_name}</p>
                            <div className="flex items-center text-xs pt-1">
                                <p style={{color: primeIndicator(record.age, record.position)}}><span className="text-gray-300">AGE </span>{record.age}</p>
                                <p className="ml-1 text-gray-300 font-light">({formatDate(record.birth_date || "0000-00-00")})</p>
                            </div>
                            <div className="text-end">
                                <div className="flex justify-between items-end">
                                    <div className="pt-1 flex items-center">
                                        {user?.avatar !== "," ?
                                            <Image className={`${styles.ownerLogo}`} alt="avatar" width={25} height={25} src={`${SLEEPER_AVATAR_BASE_URL}${user?.avatar}`}/>
                                        : "FA"}
                                        <p className="text-xs text-center ml-1">{user.display_name}</p>
                                    </div>
                                    <p className="text-xs">{fantasyPoints.fpts} <span className="font-normal">/</span> {fantasyPoints.ppts}<span className="font-bold" style={{color:"#7c90a5"}}> pts</span></p>
                                </div>
                                <div className="bg-gray-700 rounded-full h-1 my-1">
                                    <div className="bg-indigo-400 h-1 rounded-full" style={{ width: `${calculatePercentage(fantasyPoints.fpts, fantasyPoints.ppts)}%` }}></div>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-[#7c90a5] text-xs">{findPlayerOwnedBy(record.player_id, legacyLeague, user.user_id)}</p>
                                    <p className="text-xs">
                                        <span className="font-normal">(</span>
                                        {`${calculatePercentage(fantasyPoints.fpts, fantasyPoints.ppts)}%`}
                                        <span className="font-normal">)</span>
                                    </p>
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
                            <p className="w-3/12">-</p>
                            <p className="w-3/12">-</p>
                            <p className="w-3/12">-</p>
                            <p className="w-3/12">-</p>
                        </div>
                        <div className="w-2/12 flex items-center text-center">
                            <p className="w-3/12">-</p>
                            <p className="w-3/12">-</p>
                            <p className="w-3/12">-</p>
                            <p className="w-3/12">-</p>
                        </div>
                        <div className="w-2/12 flex items-center text-center">
                            <p className="w-4/12">-</p>
                            <p className="w-4/12">-</p>
                            <p className="w-4/12">-</p>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};