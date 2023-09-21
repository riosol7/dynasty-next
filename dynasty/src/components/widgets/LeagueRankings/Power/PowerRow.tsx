import Image from "next/image";
import styles from "../LeagueRankings.module.css";
import * as Interfaces from "../../../../interfaces";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";
import { roundToHundredth, winPCT } from "@/utils";

export default function PowerRow({roster, season}: Interfaces.PowerRowProps) {
    const ap_wins = roster.settings.all_play_wins;
    const ap_losses = roster.settings.all_play_losses;
    const ap_win_rate = roster.settings.all_play_win_rate;

    return (
            <a href={`/Owner/${roster.roster_id}`} className={`py-3 ${styles.anchorCell}`} style={{fontSize:"14px"}}>
                <div className="w-7/12 flex items-center">
                    <p className="w-1/12 mx-2 font-bold" style={{color:"#acb6c3", fontSize:".9rem"}}>{roster.power_rank}</p>
                    <div className="flex items-center">
                        <Image width={29} height={29} alt="avatar" src={`${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar}`} className={styles.userAvatar}/>
                        {roster?.owner?.metadata?.team_name ?
                            <p className="mx-1">{roster.owner.metadata.team_name}
                                <span className="mx-1" style={{fontSize:"10px", color:"#cbcbcb"}}>{roster.owner.display_name}</span>
                            </p>
                        : <p className="mx-1">{roster.owner.display_name}</p>
                        }
                        <p className="pb-2 mx-1" style={{fontSize:".6rem", color:"#7d91a6"}}>WIN {ap_win_rate}%</p>
                    </div>
                </div>
                <div className="w-5/12 flex items-center justify-end">
                    <p className="w-1/12">{ap_wins}</p>  
                    <p className="w-1/12">{ap_losses}</p>
                    <p className="w-1/12">{ season !== "All Time" ?
                        roundToHundredth(winPCT(roster.settings.wins, roster.settings.losses) - ap_win_rate) || 0
                    : 0 // Add the allTimeStats configuration to subtract from ap_win_rate; ap_win_rate is already configured w/ season info.
                    }</p>  
                </div>
            </a>
    )
}