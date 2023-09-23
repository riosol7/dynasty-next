import styles from "../MVP.module.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import value from "../../../../assets/images/value.png";
import { Icon } from "@iconify-icon/react";
import { findLogo, getMVP, getTotalPts } from "@/utils";
import { useFantasyMarket } from "@/context";
import { PLAYER_BASE_URL, SLEEPER_AVATAR_BASE_URL } from "@/constants";
import * as Interfaces from "../../../../interfaces";

const positionStyles = {
    QB: styles.qbHUD,
    RB: styles.rbHUD,
    WR: styles.wrHUD,
    TE: styles.teHUD,
};

export default function MVPSlide({legacyLeague, roster}: Interfaces.MVPSlideProps) {
    const { fantasyMarket } = useFantasyMarket()!;

    const [mvp, setMVP] = useState<Interfaces.Player>(Interfaces.initialPlayer);
    const [loadMVP, setLoadMVP] = useState<boolean>(true)

    useEffect(() => {
        async function fetchMVP() {
            try {
                const player = getMVP(roster, fantasyMarket);
                setMVP(player);
                setLoadMVP(false);
            } catch (error) {
                console.error("Error fetching MVP:", error);
            }
        }
        fetchMVP();
    }, [fantasyMarket, mvp, roster.roster_id]);

    const logo = findLogo(mvp?.team);

    return (
        <div className={styles.mvpLayout} style={{background: logo.bgColor}}>
            <div className="flex" style={{
                backgroundImage: `url(${logo.l})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "bottom left",
                backgroundSize: "150px",
            }}>
                <div className="px-1">
                    <div style={{
                        backgroundImage: `url(${PLAYER_BASE_URL}${mvp?.player_id}.jpg)`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom",
                        backgroundSize: "cover",
                        minHeight: "145px",
                        minWidth: "175px"
                    }}>
                    </div>
                </div>
                <div className="">
                    <div className="flex justify-between">
                        <div className="mt-2">
                            <p className="text-truncate">{mvp?.first_name}</p>
                            <p className="font-bold text-truncate text-3xl" style={{fontSize: "1.3em"}}>{mvp?.last_name}</p>
                        </div>
                        <Image className={styles.ownerLogo} alt="avatar" width={25} height={25} src={`${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar}`}/>
                    </div>
                    <div className={`my-1 flex items-center ${styles.playerHUD} ${positionStyles[mvp?.position as keyof typeof positionStyles] || ""}`}>
                        <p className="flex items-center text-sm" style={{fontSize: "12px", paddingLeft: "6px"}}>{mvp?.position}
                            <span style={{color: "whitesmoke", fontWeight: "normal", paddingLeft: "12px"}}>
                                {getTotalPts(legacyLeague, roster.roster_id, mvp?.player_id).maxPts}
                                <span style={{color: "lightgray"}}> pts</span>
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center mx-2" style={{marginTop: ".8em"}}>
                        <div className="flex items-center" style={{width: "60px"}}>
                            <Icon icon="fa6-solid:ranking-star" style={{fontSize: "22px", color: "#a9dfd8"}}/>
                            <p className="text-sm" style={{fontSize: "12px", paddingLeft: "4px"}}>{(mvp[fantasyMarket as keyof Interfaces.Player] as Interfaces.MarketContent).rank}</p>
                        </div>
                        <div className="flex items-center">
                            <Image src={value} alt="value" width={25} height={25}/>
                            <p className="text-sm" style={{fontSize: "12px", paddingLeft: "6px"}}>{(mvp[fantasyMarket as keyof Interfaces.Player] as Interfaces.MarketContent).value}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
