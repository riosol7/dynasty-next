import React from "react";
import { Icon } from "@iconify/react";
import { winPCT } from "../../../utils";

export default function StandingRow({owner, selectSzn,}) { 
    const avatarBaseURL = process.env.REACT_APP_SLEEPER_AVATAR_THUMBS_BASE_URL;
    const dummyAvatar = process.env.REACT_APP_DUMMY_AVATAR;
    const roster = selectSzn === "All Time" ? owner : owner.owner;

    return (
        <div className="team d-flex py-3 align-items-center" style={{fontSize:"14px"}}>
            <a href={`/Owner/${owner.roster_id}`} className="cellLink">
                <div className="col-sm-7 text-truncate">
                    <div className="d-flex align-items-center">
                        <div className="col-sm-1">
                            <p className="m-0 mx-2 bold" style={{color:"#acb6c3", fontSize:".9rem"}}>{owner.rank}</p>
                        </div>
                        <div className="">
                            <img className="ownerLogo" style={{width:"24px"}} alt="avatar" src={`${avatarBaseURL}${roster?.avatar? roster.avatar : dummyAvatar}`}/>
                        </div>
                        <div className="mx-1">
                            {roster?.team_name ?
                                <p className="m-0 mx-1">{roster.team_name} 
                                    <span className="m-0 mx-1" style={{fontSize:"10px", color:"#cbcbcb"}}>{roster.display_name}</span>
                                </p>
                            :
                                <p className="m-0 mx-1">{roster.display_name}</p>
                            }
                            <div className="pb-2 mx-1">
                                {selectSzn === "All Time" ?
                                    <p className="m-0" style={{fontSize:".6rem", color:"#7d91a6"}}>WIN {owner.percentage}%</p>
                                :
                                    <p className="m-0" style={{fontSize:".6rem", color:"#7d91a6"}}>WIN {winPCT(owner.settings.wins, owner.settings.losses) || 0}%</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-2 text-truncate">
                    {selectSzn === "All Time" ?
                        <p className="m-0">{owner.record}</p>
                    :
                        <p className="m-0">{owner.settings.wins}-{owner.settings.losses}-{owner.settings.ties}
                            {owner?.metadata?.streak ?                                        
                                owner.metadata.streak.includes("W") === true ?
                                    <span className="mx-1" style={{fontSize:".6rem"}}>
                                        <Icon icon="bi:caret-up-fill" style={{color:"#368727", fontSize:".7rem"}}/>{owner.metadata.streak}
                                    </span>
                                :
                                    <span className="mx-1" style={{fontSize:".6rem"}}>
                                        <Icon icon="bi:caret-down-fill" style={{color:"#cc1d00", fontSize:".7rem"}}/>{owner.metadata.streak}
                                    </span>
                            : <></>
                            } 
                        </p>
                    }
                </div>
                {selectSzn === "All Time" ?
                    <div className="col-sm-3 d-flex align-items-center" style={{fontSize:"12px", color:"white"}}>
                        <div className="col-sm-4">
                            <p className="m-0">{owner.fpts}</p>
                        </div>
                        <div className="col-sm-4">
                            <p className="m-0">{owner.ppts}</p>
                        </div>
                        <div className="col-sm-4">
                            <p className="m-0">{owner.fpts_against}</p>
                        </div>
                    </div>
                :
                    <div className="col-sm-3 d-flex align-items-center" style={{fontSize:"12px", color:"white"}}>
                        <div className="col-sm-4">
                            <p className="m-0">{owner.settings.fpts}.{owner.settings.fpts_decimal}</p>
                        </div>
                        <div className="col-sm-4">
                            <p className="m-0">{owner.settings.ppts}.{owner.settings.ppts_decimal}</p>
                        </div>
                        <div className="col-sm-4">
                            <p className="m-0">{owner.settings.fpts_against}.{owner.settings.fpts_against_decimal}</p>
                        </div>
                    </div>
                }
            </a>
        </div>
    )
}
