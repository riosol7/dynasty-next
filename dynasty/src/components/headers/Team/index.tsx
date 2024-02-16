import styles from "./TeamHeader.module.css";
import DraftWidget from "@/components/widgets/Draft";
import { useLeagueContext, useSeasonContext } from "@/context";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";
import { findUserEXP, findUserByName, findLeagueBySeason } from "@/utils";
import * as Interfaces from "@/interfaces";
// Change header background color from black to background gradient color similar to the DraftWidget background, the navbars should also inherit the new colors.
export default function TeamHeader({ name }: Interfaces.TeamParamProps) {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason } = useSeasonContext()!;
    const foundLeagueBySzn: Interfaces.League = findLeagueBySeason(selectSeason, legacyLeague);
    const foundUser = findUserByName(name, foundLeagueBySzn);
    return (
        <div className="flex items-start justify-between flex-wrap">
            <div className="flex items-center">
                <div className={styles.avatarBackground}>
                    <div className={styles.avatar} style={{backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${foundUser?.avatar})`}}></div>
                </div>
                <div className="ml-3">
                    <p className="font-bold" style={{fontSize:"18px"}}>{foundUser?.metadata?.team_name ? foundUser?.metadata?.team_name : foundUser?.display_name}</p>
                    <p style={{color:"#cbcbcb"}}>@{foundUser?.display_name}</p>         
                    <p className="font-bold pt-1" style={{fontSize:"11.5px",color:"#7d91a6"}}>EXP {findUserEXP(foundUser?.user_id!, legacyLeague)}</p>
                </div>
            </div>
            {foundLeagueBySzn.status === "pre_draft" ? 
            <></>:<DraftWidget name={name}/>}
        </div>
    );
};
