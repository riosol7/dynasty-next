import styles from "./TeamHeader.module.css";
import Image from "next/image";
import DraftWidget from "@/components/widgets/Draft";
import { Icon } from "@iconify-icon/react";
import { useLeagueContext } from "@/context";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";
import { findUserEXP, findUserByName, findRosterByOwnerID, findLeagueByTeamName, placementRankings } from "@/utils";
import * as Interfaces from "@/interfaces";
// Change header background color from black to background gradient color similar to the DraftWidget background, the navbars should also inherit the new colors.
export default function TeamHeader({ name }: Interfaces.TeamParamProps) {
    const { legacyLeague } = useLeagueContext();

    const foundLeague = findLeagueByTeamName(name, legacyLeague);
    const foundUser = findUserByName(name, foundLeague);
    const foundRoster = findRosterByOwnerID(foundUser.user_id, foundLeague);

    return (
        <div className="flex items-start justify-between flex-wrap">
            <div className="flex items-center">
                <div className={styles.avatarBackground}>
                    <Image alt="avatar" width={100} height={100} src={`${SLEEPER_AVATAR_BASE_URL}${foundUser?.avatar}`}
                    style={{borderRadius:"50%", padding:"4px", background:"black"}}/>
                </div>
                <div className="mx-3">
                    <p className="font-bold" style={{fontSize:"18px"}}>{foundUser?.metadata?.team_name ? foundUser?.metadata?.team_name : foundUser?.display_name}</p>
                    <p style={{color:"#cbcbcb"}}>@{foundUser?.display_name}</p>         
                    <p className="font-bold pt-1" style={{fontSize:"11.5px",color:"#7d91a6"}}>EXP {findUserEXP(foundUser?.user_id!, legacyLeague)}</p>
                </div>
            </div>
            <DraftWidget name={name}/>
        </div>
    );
};
