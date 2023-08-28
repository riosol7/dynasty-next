"use client";
import styles from "./Dashboard.module.css";
import * as Interfaces from "../../interfaces";
import { useLeagueContext } from "@/context/LeagueContext";
import LeagueNav from "@/components/navigation/LeagueNav";

export default function DashboardLayout({ children }: Interfaces.ChildrenProps) {
    const { league, loadLeague } = useLeagueContext();

    return (
        <div className={styles.dashboard}>
            <LeagueNav league={league}/>
            {children}
        </div>
    )
}
