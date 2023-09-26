import Image from "next/image";
import styles from "./SideNavBar.module.css";
import vs from "@/assets/images/vs.png";
import * as Interfaces from "@/interfaces";
import { Icon } from '@iconify-icon/react';

export default function SideNavBar({isSidebarOpen}: Interfaces.SideNavBarProps) {

    return (
        <nav className={styles.sideBar} style={{ width: isSidebarOpen? "200px": "0px" }}>
            <div className={`py-5 flex justify-center items-center`}>
                <div id={styles.activeIcon}></div>
                <Icon className={styles.iconSize} icon="bxs:dashboard"/>
            </div>
            <div className="py-5 flex justify-center items-center">
                <Image className={styles.iconSize} width={24} height={24} src={vs} alt="vs"/>
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
