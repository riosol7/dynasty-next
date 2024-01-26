import styles from "./Team.module.css";
import * as Interfaces from "../../interfaces";
import TeamHeader from "@/components/headers/Team";
import { useLeagueContext, useSeasonContext } from "@/context";

export default function TeamLayout({ children, name }: Interfaces.TeamLayoutProps) {
    const { selectSeason, onChange } = useSeasonContext()!;
    const { legacyLeague } = useLeagueContext();

    return (
        <div>
            <div className={`${styles.teamNav}`}>
                <select id={styles.selectSeason} onChange={onChange} value={selectSeason}>
                {legacyLeague.map((league, idx) => (
                    <option key={idx} value={league.season}>{`${league.season} PERFORMANCE INSIGHTS`}</option>
                ))}
                </select>
                <div className="flex items-center pl-5">
                    <div><p>TOTAL VALUE</p></div>
                    <div><p>AVG. AGE</p></div>
                    <div><p>PLAYERS</p></div>
                </div>
            </div>
            <TeamHeader name={name}/>
            {children}
        </div>
    );
};