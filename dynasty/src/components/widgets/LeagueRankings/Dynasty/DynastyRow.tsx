import Image from "next/image";
import * as Interfaces from "../../../../interfaces";
import styles from "../LeagueRankings.module.css";
import { SLEEPER_AVATAR_BASE_URL } from "@/constants";
import { useLeagueContext } from "@/context";
import { findUserEXP } from "@/utils";

interface DynastyRow {
    roster: Interfaces.Roster;
    sort: string;
    fantasyMarket: string;
};

export default function DynastyRow({roster, sort, fantasyMarket}: DynastyRow) {
    const { legacyLeague } = useLeagueContext();
    const getStyle = (field: string) => {
        return {
            fontSize: "12px",
            color: sort === field ? "#a9dfd8" : "white",
        };
    };

    return (
        <a href={`/Owner/${roster.roster_id}`} className={`flex items-center py-3 ${styles.anchorCell}`}>
            <div className="w-7/12 flex items-center">
                <p className="w-1/12 mx-2 font-bold" style={{color:"#acb6c3", fontSize:".9rem"}}>{(roster[fantasyMarket as keyof typeof roster] as Interfaces.DynastyValue).rank}</p>
                <Image width={29} height={29} alt="avatar" src={`${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar}`} className={styles.userAvatar}/>
                <div className="text-truncate mx-1" style={{width:"100%"}}>
                    {roster?.owner?.metadata?.team_name ?
                        <p className="mx-1" style={{fontSize:"14px"}}>{roster?.owner?.metadata?.team_name}
                            <span className="mx-1 truncate" style={{fontSize:"10px", color:"#cbcbcb"}}>{roster.owner.display_name}</span>
                        </p>
                    :        
                        <p className="text-truncate mx-1" style={{fontSize:"14px"}}>{roster?.owner?.display_name}</p>
                    } 
                    <p className="pb-2 mx-1" style={{fontSize:".6rem", color:"#7d91a6"}}>EXP {findUserEXP(roster.owner?.user_id, legacyLeague)}</p>
                </div> 
            </div>
            {["TEAM", "QB", "RB", "WR", "TE"].map((field, index) => (
                <p key={index} className="w-1/12" style={getStyle(field)}>{(roster[fantasyMarket as keyof typeof roster] as any)[field.toLowerCase()]}</p>
            ))}
        </a>
    );
};