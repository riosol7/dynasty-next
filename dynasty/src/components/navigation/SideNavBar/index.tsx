import { useEffect, useState } from 'react';
import styles from "./SideNavBar.module.css";
import * as Interfaces from "@/interfaces";
import { Icon } from '@iconify-icon/react';

export default function SideNavBar({isSidebarOpen}: Interfaces.SideNavBarProps) {
    const [currentPath, setCurrentPath] = useState('/');

    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, []);

    const dashboardActive = currentPath === "/";
    const matchupActive = currentPath === "/matchups";

    return (
        <nav className={styles.sideBar} style={{ width: isSidebarOpen? "200px": "0px" }}>
            <div className={`py-5 flex justify-center items-center`}>
                {dashboardActive ? <div id={styles.activeIcon}></div> : null}
                <a href={`/`}><Icon className={styles.iconSize} icon="bxs:dashboard" style={{color: dashboardActive ? "white" : "#7f7f7f"}}/></a>
            </div>
            <div className="py-5 flex justify-center items-center">
                {matchupActive ? <div id={styles.activeIcon}></div> : null}
                <a href={`/matchups`}><Icon icon="tabler:vs" className={styles.iconSize} style={{color: matchupActive ? "white" : "#7f7f7f"}}/></a>
            </div>
            <div className="py-5 flex justify-center items-center">
                <Icon className={styles.iconSize} icon="material-symbols:history-rounded" style={{color:"#7f7f7f"}}/>
            </div>
            <div className="py-5 flex justify-center items-center">
                <Icon className={styles.iconSize} icon="carbon:blog" style={{color:"#7f7f7f"}}/>
            </div>
        </nav>
    );
};
