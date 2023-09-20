"use client";
import React, { useState } from "react";
import { useLeagueContext } from "@/context";
import { Icon } from "@iconify-icon/react";
import Standings from "./Standings";
import DynastyRankings from "./Dynasty";
import PowerRankings from "./Power";

export default function LeagueRankings() {
    const { legacyLeague, loadLegacyLeague } = useLeagueContext();

    const [rankings, setRankings] = useState("Standings");
    const [season, setSeason] = useState(legacyLeague[0].season);
    const [playoffs, setPlayoffs] = useState(false);

    
    const handleRankings = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRankings(e.target.value);
    };

    const handleSeason = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSeason(e.target.value);
    };

    const handlePlayoffs = () => {
        setPlayoffs(!playoffs);
    };

    return (
        <>
            <div className="flex items-center justify-between sticky top-0 pt-3 pb-2">
                <div className="flex items-center">
                    <Icon icon="icon-park-outline:ranking" className="text-[#a9dfd8] text-1.1rem"/>
                    <select className="m-0 mx-1 font-bold bg-black text-white border-none" onChange={handleRankings} value={rankings}>
                        <option value={"Standings"}>Standings</option>
                        <option value={"Dynasty"}>Dynasty</option>
                        <option value={"Power"}>Power</option>
                    </select>
                </div>
                {rankings === "Standings" || rankings === "Power" ?
                    <div className="flex items-center">
                        {season !== "All Time" && rankings !== "Power" ?
                            <Icon icon="mdi:bracket" onClick={() => handlePlayoffs()} className={`mx-4`} style={playoffs ? {fontSize:"1.4rem", color:"#a9dfd8"} : {fontSize:"1.4rem", color:"#cbcbcb"}}/>
                        : <></>
                        }
                        <div className="flex items-center">
                            <select className="p-2" onChange={handleSeason} value={season} style={{fontSize:".8em", borderRadius:"25px", border:"2px solid #3bdbba", background:"black", color:"white"}}>
                                {legacyLeague?.slice().map((league, i) => 
                                    <option key={i} value={league.season}>{league.season}</option>
                                )}
                                {(rankings ==="Standings" || rankings === "Power") && playoffs === false ?
                                    <option value="All Time">All Time</option>
                                :<></>
                                }
                            </select>
                        </div>
                    </div>
                : <></>} 
            </div>
            {rankings === "Standings" ? 
                <Standings playoffs={playoffs} season={season}/>
            : rankings === "Dynasty" ?
                <DynastyRankings/>
            : rankings === "Power" ?
                <PowerRankings season={season}/>
            : <></>
            }
        </>
    );
};
