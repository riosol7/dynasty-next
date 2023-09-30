import styles from "./PerformanceInsights.module.css";
import Image from "next/image";
import * as Interfaces from "@/interfaces";
import { PLAYER_BASE_URL } from "@/constants";
import { findPlayerByID, getAllTimeLeagueStats, overallHighScoreRanking } from "@/utils";
import { useLeagueContext, usePlayerContext } from "@/context";


export default function TopScoringPlayer({ record }: Interfaces.TopScoringPlayerRecordProps) {
    const { legacyLeague } = useLeagueContext();
    const { players } = usePlayerContext();
    const allTimeLeagueStats = getAllTimeLeagueStats(legacyLeague);

    const overallHighScoreList: Interfaces.TopScoringPlayerRecord[] = allTimeLeagueStats.playerHighScores;
    
    return (
        <div className={`${styles.performanceRow}`}>
            <div className="w-8/12 flex items-center pt-1">
                <p className="font-bold" style={{width: "25px"}}>{record.rank}</p>
                <Image className={styles.playerImage} src={`${PLAYER_BASE_URL}${record.starter}.jpg`} alt="player" width={60} height={60}/>
                <div>
                    <p className="font-bold">
                        {findPlayerByID(record.starter, players).first_name} {findPlayerByID(record.starter, players).last_name}
                    </p>
                    <p className="font-light text-xs">{findPlayerByID(record.starter, players).position}</p>
                </div>
            </div>
            <div style={{ color:"whitesmoke" }} className="w-4/12 flex items-center">
                <p className="w-3/12">{record.week}</p>
                <p className="w-3/12">{record.season}</p>
                <p className="w-3/12">{record.starter_points}</p>
                <p className="w-3/12 flex justify-end">{overallHighScoreRanking(record?.starter_points!, overallHighScoreList)?.rank}</p>
            </div>
        </div>
    );
};
