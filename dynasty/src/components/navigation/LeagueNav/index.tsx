"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from '@iconify-icon/react';
import styles from "./LeagueNav.module.css";
import { useFantasyMarket, useLeagueContext } from "@/context";
import { SLEEPER_AVATAR_THMUB_BASE_URL } from "@/constants";
import * as Interfaces from "../../../interfaces";

function LeagueStatus({ league }: Interfaces.LeagueProps) {
    const statusClasses = {
        "pre_draft": "text-whitesmoke",
        "in_season": "text-whitesmoke",
        "post_season": "text-whitesmoke",
        "complete": "text-whitesmoke",
    };
  
    return (
        <p className={`m-0 ${statusClasses[league.status]}`}>
            {league.status === "pre_draft" && "Pre Draft"}
            {league.status === "complete" && "Finished Season"}
            {league.status === "in_season" && "In Season"}
            <span className="ml-2 text-white">{league.season}</span>
        </p>
    );
};

function LeagueSettings({ league }: Interfaces.LeagueProps) {
    return (
        <div className="flex items-center">
            <p className="mx-4 text-whitesmoke">
                Divisions <span className="ml-2 text-white">{league.settings?.divisions}</span>
            </p>
            <p className="text-whitesmoke">
                Rosters <span className="ml-2 text-white">{league.total_rosters}</span>
            </p>
        </div>
    );
};

export default function LeagueNav({ isSidebarOpen, setIsSidebarOpen }: Interfaces.LeagueNavProps) {
    const [currentPath, setCurrentPath] = useState('/');

    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, []);
    const { fantasyMarket, onChange } = useFantasyMarket()!;
    const { legacyLeague, loadLegacyLeague } = useLeagueContext();
    const league = legacyLeague[0];
    const matchupsActive = currentPath === "/matchups" ? true : false;

    return (
        <nav className={styles.navigation}>
            <div className="flex items-center">
                <Icon className={`${styles.hamburger}`} icon="charm:menu-hamburger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}/>
                <div className="flex items-center flex-wrap">
                    <a href={`/`} id={styles.leagueAnchor} style={{ width: "270px" }}>
                        <div className="flex items-center">
                            <div className="flex justify-center mr-4">
                                {loadLegacyLeague ?
                                    <Icon icon="line-md:loading-twotone-loop" style={{fontSize:"35px", color: "#a9dfd8"}} />
                                : <Image className="rounded" width={36} height={36} alt="avatar" src={`${SLEEPER_AVATAR_THMUB_BASE_URL}${league.avatar}`}/>}
                            </div>
                            <p className="font-bold m-0 text-2x1">{league.name}</p>
                        </div>
                    </a>
                    <div className="flex items-center text-sm text-gray-500">
                        <LeagueStatus league={league} />
                        <LeagueSettings league={league} />
                    </div>
                </div>
            </div>
            <div className="flex items-center rounded-full pl-2 pr-1 border border-gray-700">
                <Icon icon="ion:search-outline" style={{ fontSize: "18px", color: "white" }}/>
                <input
                    type="text"
                    className="bg-black outline-none pl-2 py-1"
                    placeholder="Search"
                />
                <Icon icon="iconamoon:microphone-duotone" className={styles.mic}/>
            </div>
            {matchupsActive ? 
            <></> : <select id={styles.selectMarket} 
            className="mr-3" 
            onChange={onChange} 
            value={fantasyMarket}>
                <option value={"ktc"}>{"KeepTradeCut"}</option>
                <option value={"fc"}>{"FantasyCalc"}</option>
                <option value={"dp"}>{"DynastyProcess"}</option>
            </select>}
        </nav>
    );
};
