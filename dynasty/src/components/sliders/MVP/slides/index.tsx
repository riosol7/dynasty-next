import styles from "../MVP.module.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import value from "@/assets/images/value.png";
import { Icon } from "@iconify-icon/react";
import { findLogo, getMVP, totalFantasyPointsByRoster } from "@/utils";
import { useFantasyMarket } from "@/context";
import { PLAYER_BASE_URL, SLEEPER_AVATAR_BASE_URL } from "@/constants";
import * as Interfaces from "@/interfaces";
import * as Constants from "@/constants";

const positionStyles = {
    QB: styles.qbHUD,
    RB: styles.rbHUD,
    WR: styles.wrHUD,
    TE: styles.teHUD,
    K: styles.kHUD,
};

export default function MVPSlide({legacyLeague, mvpType, roster}: Interfaces.MVPSlideProps) {
    const { fantasyMarket } = useFantasyMarket()!;

    const [mvp, setMVP] = useState<Interfaces.Player>(Constants.initPlayer)!;
    const [loadMVP, setLoadMVP] = useState<boolean>(true)

    useEffect(() => {
        async function fetchMVP() {
            try {
                const player = getMVP(legacyLeague, roster, fantasyMarket, mvpType);
                setMVP(player);
                setLoadMVP(false);
            } catch (error) {
                console.error("Error fetching MVP:", error);
            }
        }
        fetchMVP();
    }, [fantasyMarket, mvpType, roster, legacyLeague]);

    const logo = findLogo(mvp?.team);

    return ( 
        <div className={styles.mvpLayout} style={{background: logo.bgColor}}>
            <div className={styles.mvpBackground} style={{backgroundImage: `linear-gradient(rgba(0, 0, 100, .1), rgba(0, 0, 0, .9)), url(${logo.l})`}}>
                <div className="px-1">
                    <div className={styles.headshot} style={{backgroundImage: `url(${PLAYER_BASE_URL}${mvp?.player_id}.jpg)`}}></div>
                </div>
                <div>
                    <div className="flex justify-between">
                        <div className="mt-2">
                            <p className="text-truncate">{mvp?.first_name}</p>
                            <p className="font-bold text-truncate text-3xl" style={{fontSize: "1.3em"}}>{mvp?.last_name}</p>
                        </div>
                        <Image className={styles.ownerLogo} alt="avatar" width={25} height={25} src={`${SLEEPER_AVATAR_BASE_URL}${roster?.owner?.avatar}`}/>
                    </div>
                    <div className={`my-1 flex items-center ${styles.playerHUD} ${positionStyles[mvp?.position as keyof typeof positionStyles] || ""}`}>
                        <p className="flex items-center text-sm" style={{fontSize: "12px", paddingInline: "6px"}}>{mvp?.position}
                            <span style={{color: "whitesmoke", fontWeight: "normal", paddingLeft: "12px"}}>
                                {totalFantasyPointsByRoster(legacyLeague, roster.roster_id, mvp?.player_id).ppts}
                                <span style={{color: "lightgray"}}> pts</span>
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center mx-2" style={{marginTop: ".8em"}}>
                        <div className="flex items-center" style={{width: "60px"}}>
                            <Icon icon="fa6-solid:ranking-star" style={{fontSize: "22px", color: "#a9dfd8"}}/>
                            <p className="text-sm" style={{fontSize: "12px", paddingLeft: "4px"}}>
                                {(mvp[fantasyMarket as keyof Interfaces.Player] as Interfaces.MarketContent)?.rank}
                            </p>
                        </div>
                        <div className="flex items-center">
                            <Image src={value} alt="value" width={25} height={25}/>
                            <p className="text-sm" style={{fontSize: "12px", paddingLeft: "6px"}}>{(mvp[fantasyMarket as keyof Interfaces.Player] as Interfaces.MarketContent)?.value}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
