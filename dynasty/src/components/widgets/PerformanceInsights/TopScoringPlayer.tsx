import Image from "next/image";
import * as Interfaces from "@/interfaces";
import { getAllTimeLeagueStats } from "@/utils";
import { useLeagueContext } from "@/context";


export default function TopScoringPlayer({ record }: Interfaces.TopScoringPlayerRecordProps) {
    const { legacyLeague } = useLeagueContext();
    const allTimeLeagueStats = getAllTimeLeagueStats(legacyLeague);

    const highScoreList: Interfaces.TopScoringPlayerRecord[] = allTimeLeagueStats.playerHighScores;
    const overallHighScoreRanking = (pts: number, list: Interfaces.TopScoringPlayerRecord[]) => {
        const foundRecord = list.find((record, idx) => record.starter_points === pts);
        return foundRecord;
    };
    
    return (
        <div className="flex items-center">
            
            <p>{record.rank}</p>
            <p>{overallHighScoreRanking(record.starter_points, highScoreList)?.starter_points}</p>
        </div>
    );
};
