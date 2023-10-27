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
            <div className={`${styles.navItem} ${styles.hover}`}>
                {dashboardActive ? <div id={styles.activeIcon}></div> : null}
                <div>
                    <a href={`/`} className="flex items-center justify-center">
                        <Icon className={styles.iconSize} icon="bxs:dashboard" 
                        style={{
                            color: dashboardActive ? "white" : "#7f7f7f"
                        }}/>
                    </a>
                    <p className={styles.navTitle} style={{ color: dashboardActive ? "white" : "#7f7f7f" }}>Dashboard</p>
                </div>
            </div>
            <div className={`${styles.navItem} ${styles.hover}`}>
                {matchupActive ? <div id={styles.activeIcon}></div> : null}
                <div>
                    <a href={`/matchups`}  className="flex items-center justify-center"><Icon icon="tabler:vs" className={styles.iconSize} style={{color: matchupActive ? "white" : "#7f7f7f"}}/></a>
                    <p className={styles.navTitle} style={{ color: matchupActive ? "white" : "#7f7f7f" }}>Matchups</p>
                </div>
            </div>
            <div className={`${styles.navItem} ${styles.hover}`}>
                <Icon className={styles.iconSize} icon="material-symbols:history-rounded" style={{color:"#7f7f7f"}}/>
            </div>
            <div className={`${styles.navItem} ${styles.hover}`}>
                <Icon className={styles.iconSize} icon="carbon:blog" style={{color:"#7f7f7f"}}/>
            </div>
        </nav>
    );
};
