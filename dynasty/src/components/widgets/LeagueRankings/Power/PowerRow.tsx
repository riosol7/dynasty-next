import React from "react";
import * as Interfaces from "../../../../interfaces";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";
// import { roundToHundredth } from "@/utils";
// NEED TO CONVERT TO TAILWIND, AND FIGURE OUT LUCK RATE.
export default function PowerRow({roster}: Interfaces.RosterProps) {
    const ap_wins = roster.settings.all_play_wins;
    const ap_losses = roster.settings.all_play_losses;
    const ap_win_rate = roster.settings.all_play_rate;

    return (
        <div className="team py-3" style={{fontSize:"14px"}}>
            <a href={`/Owner/${roster.roster_id}`} className="cellLink">
                <div className="col-sm-7 d-flex align-items-center">
                    <div className="col-sm-1">
                        <p className="m-0 mx-2 bold" style={{color:"#acb6c3", fontSize:".9rem"}}>{roster.power_rank}</p>
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="">
                            <img className="ownerLogo" style={{width:"24px"}} alt="avatar" src={`${SLEEPER_AVATAR_BASE_URL}${roster.owner.avatar}`}/>
                        </div>
                        <div className="mx-1">
                            {roster?.owner?.metadata?.team_name ?
                                <p className="mx-1">{roster.owner.metadata.team_name}
                                    <span className="mx-1" style={{fontSize:"10px", color:"#cbcbcb"}}>{roster.owner.display_name}</span>
                                </p>
                            : <p className="mx-1">{roster.owner.display_name}</p>
                            }
                            <div className="pb-2 mx-1">
                                <p className="" style={{fontSize:".6rem", color:"#7d91a6"}}>WIN {ap_win_rate}%</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-5 d-flex align-items-center justify-content-end">
                    <p className="col-sm-1 m-0">{ap_wins}</p>  
                    <p className="col-sm-1 m-0">{ap_losses}</p>  
                    {/* <p className="col-sm-1 m-0">{roundToHundredth(winPCT(r.settings.wins,r.settings.losses)-r.apR) || 0}</p>   */}
                </div>
            </a>
        </div>
    )
}