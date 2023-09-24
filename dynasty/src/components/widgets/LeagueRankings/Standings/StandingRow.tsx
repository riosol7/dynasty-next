import Image from "next/image";
import styles from "../LeagueRankings.module.css";
import * as Interfaces from "../../../../interfaces";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";
import { Icon } from "@iconify-icon/react";
import { winPCT } from "../../../../utils";

export default function StandingRow({roster, season}: Interfaces.RankingRowProps) { 

    return (
        <a href={`/Owner/${roster.roster_id}`} className={`py-3 ${styles.anchorCell}`} style={{fontSize:"14px"}}>
            <div className="w-7/12 text-truncate">
                <div className="flex items-center">
                    <p className="w-1/12 ml-2 font-bold" style={{color:"#acb6c3", fontSize:".9rem"}}>{roster.settings.rank}</p>
                    <Image width={29} height={29} alt="avatar" src={`${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar}`} className={styles.userAvatar}/>
                    <div className="mx-1">
                        {roster?.owner?.metadata?.team_name ?
                            <p className="mx-1">{roster.owner.metadata.team_name} 
                                <span className="mx-1" style={{fontSize:"10px", color:"#cbcbcb"}}>{roster.owner.display_name}</span>
                            </p>
                        :
                            <p className="mx-1">{roster.owner.display_name}</p>
                        }
                        <div className="pb-2 mx-1">
                            {season === "All Time" ?
                                <p style={{fontSize:".6rem", color:"#7d91a6"}}>WIN {roster.settings.all_play_win_rate}%</p>
                            :
                                <p style={{fontSize:".6rem", color:"#7d91a6"}}>WIN {winPCT(roster.settings.wins, roster.settings.losses) || 0}%</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-2/12 text-truncate">
                {season === "All Time" ?
                    <p>{roster.settings.all_time_wins}-{roster.settings.all_time_losses}</p>
                :
                    <p>{roster.settings.wins}-{roster.settings.losses}-{roster.settings.ties}
                    {roster?.metadata?.streak ?
                        <Icon icon={roster?.metadata?.streak?.includes("W") === true ? "bi:caret-up-fill" : "bi:caret-down-fill"} className="mx-1" 
                        style={roster?.metadata?.streak?.includes("W") === true ?{color:"#368727", fontSize:".7rem"}:{color:"#cc1d00", fontSize:".7rem"}}/>
                    :<></>
                    }{roster.metadata.streak}
                    </p>
                }
            </div>
            {season === "All Time" ?
                <div className="w-3/12 flex items-center" style={{fontSize:"12px", color:"white"}}>
                    <p className="w-4/12">{roster.settings.all_time_fpts}</p>
                    <p className="w-4/12">{roster.settings.all_time_ppts}</p>
                    <p className="w-4/12">{roster.settings.all_time_fpts_against}</p>
                </div>
            :
                <div className="w-3/12 flex items-center" style={{fontSize:"12px", color:"white"}}>
                    <p className="w-4/12">{roster.settings.fpts}.{roster.settings.fpts_decimal}</p>
                    <p className="w-4/12">{roster.settings.ppts}.{roster.settings.ppts_decimal}</p>
                    <p className="w-4/12">{roster.settings.fpts_against}.{roster.settings.fpts_against_decimal}</p>
                </div>
            }
        </a>
    );
};
