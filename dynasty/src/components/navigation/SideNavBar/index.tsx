import Image from "next/image";
import styles from "./SideNavBar.module.css";
import vs from "../../../assets/images/vs.png";

export default function SideNavBar() {
    return (
        <div className={styles.sideBar}>
            <div className="mt-4 mb-5 flex justify-content-center align-items-center">
                {/* <Icon className={styles.iconSize} icon="charm:menu-hamburger" style={{color:"white"}}/> */}
            </div>
            <div className="my-5 flex justify-center items-center">
                <div id={styles.activeIcon}></div>
                {/* <Icon className={styles.iconSize} icon="bxs:dashboard"style={{}}/> */}
            </div>
            <div className="my-5 flex justify-center items-center">
                <Image className={styles.iconSize} width={24} height={24} src={vs} alt="vs"/>
            </div>
            <div className="my-5 flex justify-center items-center">
                {/* <Icon className={styles.iconSize} icon="material-symbols:history-rounded" style={{color:"#7f7f7f"}}/> */}
            </div>
            <div className="my-5 flex justify-center items-center">
                {/* <Icon className={styles.iconSize} icon="carbon:blog" style={{color:"#7f7f7f"}}/> */}
            </div>
        </div>
    )
}
