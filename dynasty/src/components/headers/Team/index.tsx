import Image from "next/image";
import DraftWidget from "@/components/widgets/Draft";
import { Icon } from "@iconify-icon/react";
import { useLeagueContext } from "@/context";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";
import { findUserEXP, findUserByName, findRosterByOwnerID, findLeagueByTeamName } from "@/utils";
import * as Interfaces from "@/interfaces";
// Change header background color from black to background gradient color similar to the DraftWidget background, the navbars should also inherit the new colors.
export default function TeamHeader({ name }: Interfaces.TeamParamProps) {
    const { legacyLeague } = useLeagueContext();

    const foundLeague = findLeagueByTeamName(name, legacyLeague);
    const foundUser = findUserByName(name, foundLeague);
    const foundRoster = findRosterByOwnerID(foundUser.user_id, foundLeague);

    return (
        <div className="flex items-center justify-between flex-wrap my-4">
            <div className="flex items-center">
                <Image style={{borderRadius:"50%", border:"4px outset #a9dfd8", padding:"4px", background:"black"}} alt="avatar" width={100} height={100} src={`${SLEEPER_AVATAR_BASE_URL}${foundUser?.avatar}`}/>
                <div className="mx-3">
                    <div className="flex items-center">
                        <p className="font-bold" style={{fontSize:"18px"}}>{foundUser?.metadata?.team_name ? foundUser?.metadata?.team_name : foundUser?.display_name}</p>
                        <p style={{color:"#cbcbcb", fontWeight:"lighter", paddingLeft:"6px"}}>@{foundUser?.display_name}</p>         
                    </div>
                    <p className="flex items-center" style={{fontSize:"14.5px"}}>
                        {foundRoster?.settings.wins}
                        <span style={{color:"whitesmoke"}}>-</span>  
                        {foundRoster?.settings.losses}
                        <span style={{color:"whitesmoke"}}>-</span>  
                        {foundRoster?.settings.ties}
                        <Icon icon="ic:round-circle" className="mx-2" style={{fontSize:".35em", color:"#698b87"}}/>
                        <span style={{color:"whitesmoke"}}>{foundRoster?.settings.rank}</span>
                        <span>{
                            foundRoster?.settings.rank === 1 ?
                                "st"
                            : foundRoster?.settings.rank === 2?
                                "nd"
                            : foundRoster?.settings.rank === 3?
                                "rd" : "th"
                        }</span>
                    </p>
                    <p className="font-bold" style={{fontSize:"11.5px",color:"#7d91a6"}}>EXP {findUserEXP(foundUser?.user_id!, legacyLeague)}</p>
                </div>
            </div>
            <DraftWidget name={name}/>
        </div>
    );
};
