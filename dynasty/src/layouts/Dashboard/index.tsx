"use client";
import styles from "./Dashboard.module.css";
import { useState } from "react";
import { useLeagueContext } from "@/context/sleeper/LeagueContext";
import * as Interfaces from "../../interfaces";
import SideNavBar from "@/components/navigation/SideNavBar";
import LeagueNav from "@/components/navigation/LeagueNav";

export default function DashboardLayout({ children }: Interfaces.ChildrenProps) {
    const { league, loadLeague } = useLeagueContext();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div>
            <LeagueNav league={league} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
            <div className={styles.dashboardLayout} style={{ 
                width: isSidebarOpen ? "" : "100%",
                paddingLeft: isSidebarOpen ? "" : "calc(5rem)",
                marginLeft: isSidebarOpen ? "200px" : "0" 
            }}>
                <SideNavBar isSidebarOpen={isSidebarOpen}/>
                <div className={styles.dashboardContent}>
                    {children}
                </div>
            </div>
        </div>
    )
}
