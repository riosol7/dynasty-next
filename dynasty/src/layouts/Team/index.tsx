import styles from "./Team.module.css";
import * as Interfaces from "../../interfaces";
import TeamHeader from "@/components/headers/Team";
import { useLeagueContext, useSeasonContext } from "@/context";

export default function TeamLayout({ children, name }: Interfaces.TeamLayoutProps) {
    const { selectSeason, onChange } = useSeasonContext()!;
    const { legacyLeague } = useLeagueContext();

    return (
        <>
            <TeamHeader name={name}/>
            <div className="flex items-center justify-between">
                <p className="font-bold" style={{color:"lightgrey"}}>PERFORMANCE INSIGHTS</p>
                <select id={styles.selectSeason} onChange={onChange} value={selectSeason}>
                {legacyLeague.map((league, idx) => (
                    <option key={idx} value={league.season}>{league.season}</option>
                ))}
                </select>
            </div>
            {children}
        </>
    );
};