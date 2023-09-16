import React from "react";
import Image from "next/image";
import styles from "./LeagueNav.module.css";
import { useFantasyMarket } from "@/context";
import * as Interfaces from "../../../interfaces";
import { Icon } from '@iconify-icon/react';

function LeagueStatus({ league }: Interfaces.LeagueProps) {
    const statusClasses = {
        "pre_draft": "text-whitesmoke",
        "complete": "text-whitesmoke",
        "in_season": "text-whitesmoke",
    };
  
    return (
        <p className={`m-0 ${statusClasses[league.status]}`}>
            {league.status === "pre_draft" && "Pre Draft"}
            {league.status === "complete" && "Post Season"}
            {league.status === "in_season" && "In Season"}
            <span className="ml-2 text-white">{league.season}</span>
        </p>
    );
}

function LeagueSettings({ league }: Interfaces.LeagueProps) {
    return (
        <div className="flex items-center">
            <p className="m-0 mx-4 text-whitesmoke">
                Divisions <span className="ml-2 text-white">{league.settings?.divisions}</span>
            </p>
            <p className="m-0 text-whitesmoke">
                Rosters <span className="ml-2 text-white">{league.total_rosters}</span>
            </p>
        </div>
    );
};

export default function LeagueNav({ league, isSidebarOpen, setIsSidebarOpen }: Interfaces.LeagueNavProps) {
    const { fantasyMarket, onChange } = useFantasyMarket()!;

    const avatarBaseURL = process.env.NEXT_PUBLIC_SLEEPER_AVATAR_THUMB_BASE_URL;

    return (
        <nav className={styles.navigation}>
            <div className="flex items-center">
                <Icon className={styles.hamburger} icon="charm:menu-hamburger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}/>
                <div className="flex items-center flex-wrap">
                    <a href={`/`} id={styles.leagueAnchor} style={{ width: "270px" }}>
                        <div className="flex items-center">
                            <div className="flex justify-center mr-4">
                                <Image className="rounded" width={36} height={36} alt="avatar" src={`${avatarBaseURL}${league.avatar}`}/>
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
            <div className="flex justify-center items-center p-2 bg-gray-900 rounded-full w-10 h-10">
                <Icon icon="ion:search-outline" style={{fontSize: "18px"}}/>
            </div>
            <div>
                <select id={styles.selectMarket} onChange={onChange} value={fantasyMarket}>
                    <option value={"ktc"}>{"KeepTradeCut"}</option>
                    <option value={"fc"}>{"FantasyCalc"}</option>
                    <option value={"sf"}>{"SuperFlex"}</option>
                    <option value={"dp"}>{"DynastyProcess"}</option>
                </select>
            </div>
            <div className={styles.activity}>
                <Icon icon="fe:activity" style={{color: "#a9dfd8", fontSize: "1.5em"}}/>
            </div>
        </nav>
    )
}
