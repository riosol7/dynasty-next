import Image from "next/image";
import React from "react";
import styles from "./Market.module.css";
import { PLAYER_BASE_URL } from "@/constants";
import { findLogo, primeIndicator, toDateTime } from "@/utils";
import * as Interfaces from "@/interfaces";

export default function PlayerRow({record, sort}: Interfaces.PlayerRowProps) {
    const player: Interfaces.Player = record.waiver_player;
    const teamLogoSize: number = 50;

    return (
        <div className={`${styles.playerRow}`}>
            <div className="w-2/12 flex items-center">
                {player.position !== "DEF" ?
                <div className={styles.playerHeadShot}
                style={{ backgroundImage: `url(${PLAYER_BASE_URL}${player.player_id}.jpg)`,}}>
                </div>
                : <Image alt="" width={teamLogoSize} height={teamLogoSize} src={findLogo(player?.team).l!}/>}
                <div className="pl-3 text-xs">
                    <div style={{color:sort === "PLAYER" ? "#a9dfd8" : ""}}>
                        <p>{player?.first_name}</p>
                        <p>{player?.last_name}</p>
                    </div>
                    {/* {player.position === "DEF" ? <></> : 
                    <p className="text-xs text-gray-400">{player?.years_exp === 0 ? "ROOKIE" : `EXP ${player?.years_exp}`}</p>} */}
                </div>
            </div>
            <p className={`w-1/12 ${styles.waiverCell}`} style={{color:sort === "AGE" ? "#a9dfd8" : primeIndicator(player?.age, player?.position)}}>{player?.age || "-"}</p>
            <p className={`w-2/12 ${styles.waiverCell}`} style={{color:sort === "all" ? "#a9dfd8" : ""}}>{player?.position}</p>
            <p className={`w-2/12 ${styles.waiverCell}`}>{record.creator}</p>
            <p className={`w-1/12 ${styles.waiverCell}`} style={{color:sort === "BID" ? "#a9dfd8" : ""}}>${record.settings.waiver_bid}</p>
            <p className={`w-2/12 ${styles.waiverCell}`} style={{color:sort === "DATE" ? "#a9dfd8" : ""}}>{toDateTime(record.created)}</p>
            <p className="w-2/12"></p>
        </div>
    );
};
