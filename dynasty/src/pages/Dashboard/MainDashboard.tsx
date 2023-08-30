import React from "react";
import styles from "./MainDashboard.module.css";
import MVPSlider from "@/components/sliders/MVP";

export default function MainDashboard() {
    return (
        <div className={styles.mainDashboardLayout}>
            <MVPSlider/>
        </div>
    )
}
