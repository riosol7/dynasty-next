import styles from "./PerformanceInsights.module.css";
import Image from "next/image";
import * as Interfaces from "@/interfaces";
import { PLAYER_BASE_URL } from "@/constants";
import { findPlayerByID, getAllTimeLeagueStats, overallHighScoreRanking } from "@/utils";
import { useLeagueContext, usePlayerContext } from "@/context";

export default function HighScoreRecord({ record, type }: Interfaces.HighScoreRecordProps) {
    const { legacyLeague } = useLeagueContext();
    const { players } = usePlayerContext();
    const allTimeLeagueStats = getAllTimeLeagueStats(legacyLeague);
    const overallLeagueHighScoreList: Interfaces.HighScoreRecord[] = allTimeLeagueStats.teamHighScores;
    const overallPlayerHighScoreList: Interfaces.HighScoreRecord[] = allTimeLeagueStats.playerHighScores;
    const foundPlayer = findPlayerByID(record.starter!, players);

    return (
        type === "team" ? 
        <div className={`${styles.performanceRow}`} style={{ paddingBlock:"1em" }}>
            <div className="w-8/12 flex items-center">
                <p className="font-bold" style={{ width: "25px" }}>{record.rank}</p>
                <p>{record.points}</p>
            </div>
            <div style={{ color:"whitesmoke" }} className="w-4/12 flex items-center">
                <p className="w-4/12">{record.week}</p>
                <p className="w-4/12">{record.season}</p>
                <p className="w-4/12 text-end">{overallHighScoreRanking(record.points, overallLeagueHighScoreList)?.rank}</p>
            </div>
        </div>
        : 
        <div className={`${styles.performanceRow}`} style={{ paddingTop:".8em" }}>
            <div className="w-8/12 flex items-center">
                <p className="font-bold" style={{width: "25px"}}>{record.rank}</p>
                <Image className={styles.playerImage} src={`${PLAYER_BASE_URL}${record.starter}.jpg`} alt="player" width={60} height={60}/>
                <div>
                    <p className="font-bold">
                        {foundPlayer.first_name} {foundPlayer.last_name}
                    </p>
                    <p className="font-light text-xs">{foundPlayer.position}</p>
                </div>
            </div>
            <div style={{ color:"whitesmoke" }} className="w-4/12 flex items-center">
                <p className="w-3/12">{record.week}</p>
                <p className="w-3/12">{record.season}</p>
                <p className="w-3/12">{record.points}</p>
                <p className="w-3/12 flex justify-end">{overallHighScoreRanking(record?.points!, overallPlayerHighScoreList)?.rank}</p>
            </div>
        </div>
    );
};
