import styles from "./Team.module.css";
import * as Interfaces from "../../interfaces";
import TeamHeader from "@/components/headers/Team";

export default function TeamLayout({ children, tab, setTab, name }: Interfaces.TeamLayoutProps) {

    return (
        <>
            <TeamHeader name={name}/>
            <div className="flex items-center">
                <div className="w-1/12">
                {tab === "Summary" ?
                    <p className={styles.tab} style={{borderBottom: "2px solid #a9dfd8"}}>Summary</p>
                :
                    <p className={styles.tab} onClick={() => setTab("Summary")}>Summary</p>
                }
                </div>
                <div className="w-1/12">
                {tab === "Dynasty" ?
                    <p className={styles.tab} style={{borderBottom: "2px solid #a9dfd8"}}>Dynasty</p>
                :
                    <p className={styles.tab} onClick={() => setTab("Dynasty")}>Dynasty</p>
                }
                </div>
                <div className="w-1/12">
                {tab === "Power" ?
                    <p className={styles.tab} style={{borderBottom: "2px solid #a9dfd8"}}>Power</p>
                :
                    <p className={styles.tab} onClick={() => setTab("Power")}>Power</p>
                }
                </div>
            </div>
            {children}
        </>
    );
};