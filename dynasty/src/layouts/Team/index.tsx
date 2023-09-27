import styles from "./Team.module.css";
import * as Interfaces from "../../interfaces";
import TeamHeader from "@/components/headers/Team";
import { useLeagueContext, useSeasonContext } from "@/context";

export default function TeamLayout({ children, tab, setTab, name }: Interfaces.TeamLayoutProps) {
    const { selectSeason, onChange } = useSeasonContext()!;
    const { legacyLeague } = useLeagueContext();

    return (
        <>
            <TeamHeader name={name}/>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {tab === "Summary" ?
                        <p className={styles.tab} style={{borderBottom: "2px solid #a9dfd8"}}>Summary</p>
                    :
                        <p className={styles.tab} onClick={() => setTab("Summary")}>Summary</p>
                    }
                    {tab === "Dynasty" ?
                        <p className={styles.tab} style={{borderBottom: "2px solid #a9dfd8"}}>Dynasty</p>
                    :
                        <p className={styles.tab} onClick={() => setTab("Dynasty")}>Dynasty</p>
                    }
                    {tab === "Power" ?
                        <p className={styles.tab} style={{borderBottom: "2px solid #a9dfd8"}}>Power</p>
                    :
                        <p className={styles.tab} onClick={() => setTab("Power")}>Power</p>
                    }
                </div>
                {tab !== "Dynasty" ?
                    <select id={styles.selectSeason} onChange={onChange} value={selectSeason}>
                    {legacyLeague.map((league, idx) => (
                        <option key={idx} value={league.season}>{league.season}</option>
                    ))}
                    </select>
                :<></>
                }
            </div>
            {children}
        </>
    );
};