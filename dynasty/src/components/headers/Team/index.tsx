import React from "react";
import Image from "next/image";
import { Icon } from "@iconify-icon/react";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";

export default function TeamHeader() {

    return (
        <div className="flexitems-center justify-between flex-wrap my-4">
            <div className="flex items-center">
                <Image style={{borderRadius:"50%", border:"4px outset #a9dfd8", padding:"4px", background:"black"}} alt="avatar" width={25} height={25} src={`${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar}`}/>
                <div className="mx-3">
                    <div className="flex items-center">
                        <p className="font-bold" style={{fontSize:"18px"}}>{roster.owner.team_name ? roster.owner.team_name : roster.owner.display_name}</p>
                        <p style={{color:"#cbcbcb", fontWeight:"lighter", paddingLeft:"6px"}}>@{roster.owner.display_name}</p>         
                    </div>
                    <p className="flex items-center" style={{fontSize:"14.5px"}}>
                        {roster.settings.wins}
                        <span style={{color:"whitesmoke"}}>-</span>  
                        {roster.settings.losses}
                        <Icon icon="ic:round-circle" className="mx-2" style={{fontSize:".35em", color:"#698b87"}}/>
                        <span style={{color:"whitesmoke"}}>{roster.rank}</span>
                        <span>{
                            roster.rank === 1?
                                "st"
                            : roster.rank === 2?
                                "nd"
                            : roster.rank === 3?
                                "rd"
                            : "th"
                        } </span>
                    </p>
                    <p className="font-bold" style={{fontSize:"11.5px",color:"#7d91a6"}}>EXP {roster.owner.exp}</p>
                </div>
            </div>
            {/* <DraftWidget
                league={league}
                topDraftPick={topDraftPick}
                openModal={openModal}
                players={players}
            /> */}
        </div>
    );
};
