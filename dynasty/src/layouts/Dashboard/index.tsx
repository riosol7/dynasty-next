"use client";
import styles from "./Dashboard.module.css";
import { useState } from "react";
import { useLeagueContext } from "@/context/sleeper/LeagueContext";
import * as Interfaces from "../../interfaces";
import SideNavBar from "@/components/navigation/SideNavBar";
import LeagueNav from "@/components/navigation/LeagueNav";

export default function DashboardLayout({ children }: Interfaces.ChildrenProps) {
    const { legacyLeague, loadLegacyLeague } = useLeagueContext();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <LeagueNav league={legacyLeague[0]} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
            <div className={styles.dashboardLayout}>
                <SideNavBar isSidebarOpen={isSidebarOpen}/>
                <div className={styles.dashboardContent}>
                    {children}
                </div>
            </div>
        </>
    );
};
