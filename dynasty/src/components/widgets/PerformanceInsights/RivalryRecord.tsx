import styles from "./PerformanceInsights.module.css";
import { Icon } from "@iconify-icon/react";
import Image from "next/image";
import * as Interfaces from "@/interfaces";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";
import { useLeagueContext } from "@/context";
import { findRosterByRosterID, findUserByOwnerID, winPCT } from "@/utils";

export default function RivalryRecord({ record, type }: Interfaces.RivalryRecordProps) {
    const { legacyLeague } = useLeagueContext();
    const foundOpponentRoster = findRosterByRosterID(record.opponentID, legacyLeague[0].rosters);
    const foundOpponentUser = findUserByOwnerID(foundOpponentRoster.owner_id, legacyLeague[0]);
    return (
        <a href={`/teams/${foundOpponentUser.display_name}`} className={`${styles.performanceSubTitleRow} ${styles.fontHover} ${styles.anchorCell}`}>
            <div className="w-8/12 flex items-center">
                <p className="font-bold mx-2" style={{width: "25px"}}>{record.rank}</p>
                <Image src={SLEEPER_AVATAR_BASE_URL + foundOpponentUser.avatar} width={48} height={48} alt="avatar"/>
                <p className="ml-3">{foundOpponentUser.display_name}</p>
            </div>
            <div className="w-4/12 flex items-center" style={{ color:"whitesmoke" }}>
                <p className="w-5/12">{record.wins}-{record.losses}</p>
                <p className="w-5/12 flex items-center">{winPCT(record.wins, record.losses)}
                <Icon icon="material-symbols:percent" style={{color:"#a9dfd8", fontSize:"1em"}}/>
                </p>
                <p className="w-2/12">{type === "Rivalry" ? record.wins + record.losses : ""}</p>
            </div>
        </a>
    );
};