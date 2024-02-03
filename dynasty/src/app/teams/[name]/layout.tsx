"use client";
import styles from "../Teams.module.css";
import React from "react";
import * as Interfaces from "@/interfaces";
import TeamNav from "@/components/navigation/TeamNav";
import { SeasonProvider, useLeagueContext } from "@/context";

export default function Teamlayout({children, params: { name }}: Interfaces.TeamLayoutParams) {
    const { legacyLeague } = useLeagueContext();

    return (
        <SeasonProvider season={legacyLeague[0].season || ""}>
            <TeamNav name={name}/>
            <div className={styles.tbody}>
                {children}
            </div>
        </SeasonProvider>
    )
}
