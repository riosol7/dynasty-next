import styles from "./PerformanceInsights.module.css";
import Image from "next/image";
import * as Interfaces from "@/interfaces";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";
import { useLeagueContext } from "@/context";
import { findRosterByRosterID, findUserByOwnerID, winPCT } from "@/utils";

export default function RivalryRecord({ record }: Interfaces.RivalryRecordProps) {
    const { legacyLeague } = useLeagueContext();
    const foundOpponentRoster = findRosterByRosterID(record.opponentID, legacyLeague[0].rosters);
    const foundOpponentUser = findUserByOwnerID(foundOpponentRoster.owner_id, legacyLeague[0]);
    return (
        <div className={styles.performanceRow}>
            <div className="w-8/12 flex items-center py-2">
                <p className="font-bold" style={{width: "35px"}}>{record.rank}</p>
                <Image src={SLEEPER_AVATAR_BASE_URL + foundOpponentUser.avatar} width={48} height={48} alt="avatar"/>
                <p className="ml-3">{foundOpponentUser.display_name}</p>
            </div>
            <div className="w-4/12 flex items-center" style={{ color:"whitesmoke" }}>
                <p className="w-3/12">{record.wins}</p>
                <p className="w-3/12">{record.losses}</p>
                <p className="w-3/12">{winPCT(record.wins, record.losses)}</p>
                <p className="w-3/12">{record.wins + record.losses}</p>
            </div>
        </div>
    );
};