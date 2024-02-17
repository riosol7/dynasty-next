"use client";
import styles from "./LeagueRankings.module.css";
import React, { useState, useEffect } from "react";
import { useLeagueContext } from "@/context";
import { Icon } from "@iconify-icon/react";
import Standings from "./Standings";
import DynastyRankings from "./Dynasty";
import PowerRankings from "./Power";

export default function LeagueRankings() {
    const { legacyLeague, loadLegacyLeague } = useLeagueContext();

    const [rankings, setRankings] = useState("Standings");
    const [season, setSeason] = useState(legacyLeague[0].season);
    const [tournament, setTournament] = useState(false);
    
    const handleRankings = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRankings(e.target.value);
    };

    const handleSeason = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSeason(e.target.value);
    };

    const handleTournament = () => {
        setTournament(!tournament);
    };

    useEffect(() => {
        if (season === "") {
            setSeason(legacyLeague[0].season)
        }
    }, [season, legacyLeague]);

    return (
        <>
            <div className="flex items-center justify-between sticky top-0 pt-5 pb-2">
                <div className="flex items-center">
                    <Icon icon="ion:podium" className={styles.icon}/>
                    <select className={styles.selectLeagueRanking} onChange={handleRankings} value={rankings}>
                        <option value={"Standings"}>Standings</option>
                        <option value={"Dynasty"}>Dynasty</option>
                        <option value={"Power"}>Power</option>
                    </select>
                </div>
                {rankings === "Standings" || rankings === "Power" ?
                    <div className="flex items-center">
                        {season !== "All Time" && rankings !== "Power" ?
                            <Icon icon="mdi:bracket" onClick={() => handleTournament()} className={`mx-4`} style={tournament ? {fontSize:"1.4rem", color:"#a9dfd8"} : {fontSize:"1.4rem", color:"#cbcbcb"}}/>
                        : <></>
                        }
                        <div className="flex items-center">
                            <select className={styles.selectRankingSeason} onChange={handleSeason} value={season}>
                                {legacyLeague?.slice().map((league, i) => 
                                    <option key={i} value={league.season}>{league.season}</option>
                                )}
                                {(rankings ==="Standings" || rankings === "Power") && tournament === false ?
                                    <option value="All Time">All Time</option>
                                :<></>}
                            </select>
                        </div>
                    </div>
                : <></>} 
            </div>
            {rankings === "Standings" ? 
                <Standings tournament={tournament} season={season}/>
            : rankings === "Dynasty" ?
                <DynastyRankings/>
            : rankings === "Power" ?
                <PowerRankings season={season}/>
            : <></>}
        </>
    );
};