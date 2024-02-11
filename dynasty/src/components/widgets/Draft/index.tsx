import Image from "next/image";
import styles from "./DraftWidget.module.css";
import { findLogo, findLeagueByTeamName } from "@/utils";
import { PLAYER_BASE_URL } from "@/constants";
import { useLeagueContext } from "@/context";
import * as Interfaces from "@/interfaces";

export default function DraftWidget({ name }: Interfaces.TeamParamProps) {
    const { legacyLeague } = useLeagueContext();

    const foundLeague = findLeagueByTeamName(name, legacyLeague);
    const foundUser = foundLeague?.users.find(user => user.display_name === name);
    const topDraftPick = foundLeague?.draft?.picks?.find(pick => pick.picked_by === foundUser?.user_id);

    return (
        <div className={styles.draftWidgetBackground}>
            <div className="flex justify-between">
                <div className="pt-3 pl-5 pr-2">
                    <div>
                        <p style={{fontSize:"15px"}}>{topDraftPick?.metadata.first_name}</p>
                        <p className="font-bold" style={{fontSize:"1.7em"}}>{topDraftPick?.metadata.last_name}</p>
                    </div>
                    <div className="pt-2"> 
                        <div className={styles.playerBioIcon} style={{
                        color:findLogo(topDraftPick?.metadata.team!).color,
                        background:findLogo(topDraftPick?.metadata.team!).bgColor2}}>
                            <div className={styles.teamLogo} style={{
                            backgroundImage:`url(${findLogo(topDraftPick?.metadata.team!).l})`}}></div>
                            <p className="px-1">#{topDraftPick?.metadata.number} {topDraftPick?.metadata.position}</p>
                        </div>
                        <div className="flex items-center mt-2">
                            <p>round {topDraftPick?.round}</p>
                            <p style={{paddingLeft:"1em"}}>pick {topDraftPick?.pick_no}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <Image src={`${PLAYER_BASE_URL}${topDraftPick?.player_id}.jpg`} alt="player" width={220} height={212}/>
                </div>
            </div>
        </div>  
    )
}
