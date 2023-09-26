import Image from "next/image";
// import { Icon } from "@iconify-icon/react";
import { findLogo, findLeagueByTeamName } from "@/utils";
import { PLAYER_BASE_URL } from "@/constants";
import { useLeagueContext } from "@/context";
import * as Interfaces from "@/interfaces";

export default function DraftWidget({ name }: Interfaces.TeamParamProps) {
    const { legacyLeague } = useLeagueContext();

    const foundLeague = findLeagueByTeamName(name, legacyLeague);
    const foundUser = foundLeague?.users.find(user => user.display_name === name);
    const topDraftPick = foundLeague?.draft?.picks?.find(pick => pick.picked_by === foundUser?.user_id);

    // function MouseOver(event) {
    //     event.target.style.color="#a9dfd8";
    // }
    // function MouseOut(event){
    //     event.target.style.color="#7f7f7f";
    // }

    return (
        <div style={{fontSize:"14px", minWidth:"420px"}}>
            <div style={{background:"linear-gradient(49deg, rgba(15,15,15,1) 0%, rgba(17,17,17,1) 100%)", color:"white"}}>
                <div className="flex justify-between">
                    <div className="pt-3" style={{paddingLeft:"1.5em"}}>
                        <div>
                            <p style={{fontSize:"1.3em"}}>{topDraftPick?.metadata.first_name}</p>
                            <p className="font-bold" style={{fontSize:"1.7em"}}>{topDraftPick?.metadata.last_name}</p>
                        </div>
                        <div className="pt-2"> 
                            <p className="text-center font-bold py-1" style={{
                                width:"85px",
                                color:findLogo(topDraftPick?.metadata.team!).color,
                                background:findLogo(topDraftPick?.metadata.team!).bgColor2
                            }}>#{topDraftPick?.metadata.number} {topDraftPick?.metadata.position}</p>
                            <div className="flex items-center mt-2">
                                <p>round {topDraftPick?.round}</p>
                                <p style={{paddingLeft:"1em"}}>pick {topDraftPick?.pick_no}</p>
                            </div>
                        </div>
                    </div>
                    <div className="" style={{
                        backgroundImage:`url(${findLogo(topDraftPick?.metadata.team!).l})`,
                        backgroundPosition:"left",
                        backgroundSize:"100%",
                        backgroundRepeat:"no-repeat",
                    }}>
                        <Image src={`${PLAYER_BASE_URL}${topDraftPick?.player_id}.jpg`} alt="player" width={212} height={166} style={{objectFit:"cover", objectPosition:"center"}}/>
                    </div>
                    {/* <div className="pt-2"onClick={() => openModal("Draft")}>
                        <Icon onMouseOver={MouseOver} onMouseOut={MouseOut} icon="ic:outline-more-vert" style={{fontSize:"2em",background:"none",color:"#7f7f7f"}}/>
                    </div> */}
                </div>
            </div>  
        </div>
    )
}
