import React from "react";
import styles from "./MainDashboard.module.css";
import MVPSlider from "@/components/sliders/MVP";
import MarketWidget from "@/components/widgets/Market";
import LeagueRankings from "@/components/widgets/LeagueRankings";

export default function MainDashboard() {
    return (
        <>
            <MVPSlider/>
            <MarketWidget/>
            <LeagueRankings/>
        </>
    );
};