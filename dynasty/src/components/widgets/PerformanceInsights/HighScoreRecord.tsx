import styles from "./PerformanceInsights.module.css";
import Image from "next/image";
import * as Interfaces from "@/interfaces";
import { PLAYER_BASE_URL } from "@/constants";
import { findLeagueBySeason, findPlayerByID, findUserByRosterID, getAllTimeLeagueStats, overallHighScoreRanking } from "@/utils";
import { useLeagueContext, usePlayerContext } from "@/context";

export default function HighScoreRecord({ record, type, index, max }: Interfaces.HighScoreRecordProps) {
    const { legacyLeague } = useLeagueContext();
    const { players } = usePlayerContext();
    const allTimeLeagueStats = getAllTimeLeagueStats(legacyLeague);
    const overallLeagueHighScoreList: Interfaces.HighScoreRecord[] = allTimeLeagueStats.teamHighScores;
    const overallPlayerHighScoreList: Interfaces.HighScoreRecord[] = allTimeLeagueStats.playerHighScores;
    const foundPlayer = findPlayerByID(record.starter!, players);
    const foundLeague = findLeagueBySeason(record.season, legacyLeague);
    const opponent = findUserByRosterID(record?.opponent_rID!, foundLeague);

    return (
        type === "team" ? 
        <div className={`${index === max ? styles.performanceRow : styles.performanceSubTitleRow} ${styles.fontHover} ${styles.anchorCell}`} style={{ padding:"1em" }}>
            <div className="w-8/12 flex items-center">
                <p className="" style={{ width: "30px" }}>{record.rank}</p>
                <p>vs. {opponent.display_name}</p>
            </div>
            <div style={{ color:"whitesmoke" }} className="w-4/12 flex items-center">
                <p className="w-5/12">Week {record.week}, {record.season}</p>
                <p className="w-5/12">{record.points} vs {record.opponent_points}</p>
                <p className="w-2/12 text-end">{overallHighScoreRanking(record.points, overallLeagueHighScoreList)?.rank}</p>
            </div>
        </div>
        : 
        <div className={`${styles.anchorCell} ${styles.fontHover} ${index === max ? styles.performanceRow : styles.performanceSubTitleRow}`} style={{ paddingBlock: "0px", paddingTop:".5em" }}>
            <div className="w-8/12 flex items-center">
                <p className="font-bold" style={{width: "25px"}}>{record.rank}</p>
                <Image className={styles.playerImage} src={`${PLAYER_BASE_URL}${record.starter}.jpg`} alt="player" width={60} height={60}/>
                <div>
                    <p className="">
                        {foundPlayer.first_name} {foundPlayer.last_name}
                    </p>
                    <p className="font-bold text-xs" style={{ color: "#7c90a5" }}>{foundPlayer.position} - {foundPlayer.team}</p>
                </div>
            </div>
            <div style={{ color:"whitesmoke" }} className="w-4/12 flex items-center">
                <p className="w-5/12">Week {record.week}, {record.season}</p>
                <p className="w-5/12">{record.points}</p>
                <p className="w-2/12 flex justify-end">{overallHighScoreRanking(record?.points!, overallPlayerHighScoreList)?.rank}</p>
            </div>
        </div>
    );
};
