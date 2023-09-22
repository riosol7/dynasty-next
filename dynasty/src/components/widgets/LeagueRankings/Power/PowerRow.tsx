import Image from "next/image";
import styles from "../LeagueRankings.module.css";
import * as Interfaces from "../../../../interfaces";
import { useLeagueContext } from "@/context";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";
import { getAllTimeStats, roundToHundredth, winPCT } from "@/utils";

export default function PowerRow({roster, season}: Interfaces.PowerRowProps) {
    const { legacyLeague } = useLeagueContext(); 
    const allTimeStats = getAllTimeStats(roster.roster_id, legacyLeague);
    const allPlayWins = roster.settings.all_play_wins;
    const allPlayLosses = roster.settings.all_play_losses;
    const allPlayWinRate = roster.settings.all_play_win_rate;

    return (
        <a href={`/Owner/${roster.roster_id}`} className={`py-3 ${styles.anchorCell}`} style={{fontSize:"14px"}}>
            <div className="w-7/12 flex items-center">
                <p className="w-1/12 ml-2 font-bold" style={{color:"#acb6c3", fontSize:".9rem"}}>{roster.power_rank}</p>
                <div className="flex items-center">
                    <Image width={29} height={29} alt="avatar" src={`${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar}`} className={styles.userAvatar}/>
                    <div className="ml-2">
                        {roster?.owner?.metadata?.team_name ?
                            <p>{roster.owner.metadata.team_name}
                                <span className="ml-1" style={{fontSize:"10px", color:"#cbcbcb"}}>{roster.owner.display_name}</span>
                            </p>
                        : <p>{roster.owner.display_name}</p>
                        }
                        <p className="pb-2" style={{fontSize:".6rem", color:"#7d91a6"}}>WIN {allPlayWinRate}%</p>
                    </div>
                </div>
            </div>
            <div className="w-6/12 flex items-center justify-end space-x-2">
                <p className="w-2/12">{allPlayWins}</p>  
                <p className="w-2/12">{allPlayLosses}</p>
                <p className="w-2/12">{ season !== "All Time" ?
                    roundToHundredth(winPCT(roster.settings.wins, roster.settings.losses) - allPlayWinRate) || 0
                : roundToHundredth(allTimeStats.winRate - allPlayWinRate)
                }</p>  
            </div>
        </a>
    )
}