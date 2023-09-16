import React from "react";
import styles from "./MainDashboard.module.css";
import MVPSlider from "@/components/sliders/MVP";
import MarketWidget from "@/components/widgets/Market";

export default function MainDashboard() {
    return (
        <div className={styles.mainDashboardLayout}>
            <MVPSlider/>
            <MarketWidget/>
        </div>
    )
}
