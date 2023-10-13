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
import { getSortedPlayerRecords, primeIndicator, processPlayers, processRosters, sortPlayersByFantasyMarket, totalPlayerPoints } from "@/utils";
import { PLAYER_BASE_URL, POSITIONS } from "@/constants";

export default function PlayerList() {
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
    const [recordsPerPage, setRecordsPerPage] = useState(5);
    const [selectOwner, setSelectOwner] = useState("all");
    const [selectPosition, setSelectPosition] = useState("all");

    const processedPlayers = processPlayers(players, ktc, superFlex, fc, dp, fantasyPro);
    const processedRosters = processRosters(legacyLeague[0], processedPlayers);
    const sortedPlayers = sortPlayersByFantasyMarket(processedPlayers, fantasyMarket);
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
    
    const formatDate = (inputDate: string): string => {
        const dateParts = inputDate.split('-');
        if (dateParts.length !== 3) {
        throw new Error('Invalid date format. Please provide a date in the format YYYY-MM-DD.');
        }
    
        const [year, month, day] = dateParts;
        return `${month}-${day}-${year}`;
    };

    const convertToFeet = (heightInches: number): string => {
        const feet = Math.floor(heightInches / 12);
        const inches = heightInches % 12;
        return `${feet}'${inches}"`;
    };
    return (
        <div>
            <div className="flex items-center text-xs font-bold text-[#7d91a6]">
                <div className="w-1/12">
                    <p className="text-center">RANKING</p>
                    <div className="flex items-center">
                        <p className="w-6/12 flex items-center">OVR <Icon icon={`bi:caret-${asc ? "up" : "down"}-fill`} style={{ color: "#a9dfd8" }}/></p>
                        
                        <p className="w-6/12">POS</p>
                    </div>
                </div>
                <div className="w-1/12 text-center">
                    <p>POSITION</p>
                    <div className="flex items-center">
                        {POSITIONS.map((position, idx) =>
                            <p key={idx} className="w-3/12">{position}</p>
                        )}
                    </div>
                </div>
                <div className="w-2/12 pl-2">
                    <p>PLAYER</p>
                    <div className="flex items-center">
                        <p className="w-6/12">AGE (D.O.B)</p>
                        <p className="w-6/12">TEAM</p>
                    </div>
                </div>
                <p className="w-1/12">COLLEGE</p>
                <div className="w-1/12">
                    <p>FANTASY PTS</p>
                    <div className="flex items-center">
                        <p className="w-6/12">FPTS</p>
                        <p className="w-6/12">PPTS</p>
                    </div>
                </div>
                <div className="w-2/12">
                    <p className="text-center">PASSING</p>
                    <div className="flex items-center">
                        <p className="w-3/12">CMP</p>
                        <p className="w-3/12">ATT</p>
                        <p className="w-3/12">YD</p>
                        <p className="w-3/12">TD</p>
                    </div>
                </div>
                <div className="w-2/12">
                    <p className="text-center">RECEIVING</p>
                    <div className="flex items-center">
                        <p className="w-3/12">REC</p>
                        <p className="w-3/12">TAR</p>
                        <p className="w-3/12">YD</p>
                        <p className="w-3/12">TD</p>
                    </div>
                </div>
                <div className="w-1/12">
                    <p className="text-center">RUSHING</p>
                    <div className="flex items-center">
                        <p className="w-4/12">ATT</p>
                        <p className="w-4/12">YD</p>
                        <p className="w-4/12">TD</p>
                    </div>
                </div>
                <p className="w-1/12 text-center">VALUE</p>

            </div>
            {records?.map((record, i) =>
            <div key={i} className="flex items-center py-2">
                <div className="w-1/12 flex items-center justify-center">
                    <p className="font-bold">{(record[fantasyMarket as keyof typeof record] as Interfaces.MarketContent).rank}</p>
                    <p className="ml-1">({(record[fantasyMarket as keyof typeof record] as Interfaces.MarketContent).positionRank})</p>
                </div>
                {/* <Image className={styles.ownerLogo} alt="avatar" width={25} height={25} src={`${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar}`}/> */}
                <div className={`w-1/12 ${styles.headshot}`} style={{backgroundImage: `url(${PLAYER_BASE_URL}${record.player_id}.jpg)`}}></div>
                <div className="w-2/12 pl-2 font-bold">
                    <p>{record.full_name}</p>
                    <p className="text-xs">{record.team} #{record.number}</p>
                    <p className="text-[#7c90a5] text-xs">EXP {record.years_exp}</p>
                    <div className="flex items-center text-xs py-1">
                        <p style={{color: primeIndicator(record.age, record.position)}}><span className="text-gray-300">AGE </span>{record.age}</p>
                        <p className="ml-1 text-gray-300">({formatDate(record.birth_date || "0000-00-00")})</p>
                    </div>
                    <div className="flex items-center">
                        <p className="w-6/12 text-xs text-gray-300">height <span className="text-white">{convertToFeet(Number(record.height))}</span></p>
                        <p className="w-6/12 text-xs text-gray-300">weight <span className="text-white">{record.weight}</span><span className="font-light">lbs</span></p>  
                    </div>
                </div>
                <p className="w-1/12 text-sm">{record.college}</p>
                <div className="w-1/12 flex items-center">
                    <p className="w-6/12">0</p>
                    <p className="w-6/12">0</p>
                </div>
                <div className="w-2/12 flex items-center">
                    <p className="w-3/12">CMP</p>
                    <p className="w-3/12">ATT</p>
                    <p className="w-3/12">YD</p>
                    <p className="w-3/12">TD</p>
                </div>
                <div className="w-2/12 flex items-center">
                    <p className="w-3/12">REC</p>
                    <p className="w-3/12">TAR</p>
                    <p className="w-3/12">YD</p>
                    <p className="w-3/12">TD</p>
                </div>
                <div className="w-1/12 flex items-center">
                    <p className="w-4/12">ATT</p>
                    <p className="w-4/12">YD</p>
                    <p className="w-4/12">TD</p>
                </div>
                <p className="w-1/12 text-center">{(record[fantasyMarket as keyof typeof record] as Interfaces.MarketContent).value} ({(record[fantasyMarket as keyof typeof record] as Interfaces.MarketContent).trend})</p>
            </div>
            )}
        </div>
    );
};