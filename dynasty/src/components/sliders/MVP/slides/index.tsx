"use client";
import styles from "../MVP.module.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import value from "../../../../assets/images/value.png";
import { Icon } from "@iconify-icon/react";
import { findLogo, getMVP, getTotalPts } from "@/utils";
import { useLeagueContext, useMatchContext } from "@/context";
import * as Interfaces from "../../../../interfaces";

const initialMVP: Interfaces.Player = {
    first_name: '',
    team: '',
    position: '',
    rank: '',
    age: 0,
    birth_date: "",
    cbs_id: null,
    college: "",
    depth_chart_order: 0,
    espn_id: 0,
    fantasy_data_id: 0,
    full_name: "",
    height: "",
    high_school: "",
    last_name: "",
    number: 0,
    player_id: "",
    rotowire_id: 0,
    sportradar_id: "",
    weight: "",
    yahoo_id: 0,
    years_exp: 0,
    value: 0,
    fantasy_calc_id: null,
    mfl_id: null,
    ktc: {
        value: 0,
        rank: "",
        tier: "",
        trend: "",
        path: "",
        positionRank: "",
    },
    superFlex: {
        value: 0,
        rank: "",
        tier: "",
        trend: "",
        path: "",
        positionRank: "",
    },
    fantasy_calc: {
        value: 0,
        rank: "",
        tier: "",
        trend: "",
        path: "",
        positionRank: "",
    },
    dynasty_process: {
        ecr_1qb: "",
        ecr_2qb: "",
        ecr_pos: "",
        value_1qb: "",
        value_2qb: "",
        fp_id: "",
    },
    fantasy_pro: {
        fantasypros_id: "",
        rank: "",
        ecr: "",
        sd: "",
        best: "",
        worst: "",   
        player_page_url: "",
        player_image_url: "",
        player_bye_week: "",
        player_owned_avg: "",
        player_owned_espn: "",
        player_owned_yahoo: "",
        player_opponent: "",
        player_opponent_id: "",
        player_ecr_delta: "",
        pos_rank: "",
        start_sit_grade: "",
        r2p_pts: "",
    },
};

const positionStyles = {
    QB: styles.qbHUD,
    RB: styles.rbHUD,
    WR: styles.wrHUD,
    TE: styles.teHUD,
};

export default function MVPSlide({roster, rosters}: Interfaces.MVPSlideProps) {
    const { league, loadLeague } = useLeagueContext();
    const { matches, loadMatches } = useMatchContext();

    const [mvp, setMVP] = useState<Interfaces.Player>(initialMVP);
    const [loadMVP, setLoadMVP] = useState<boolean>(true)

    const avatarBaseURL = process.env.NEXT_PUBLIC_SLEEPER_AVATAR_THUMBS_BASE_URL;
    const playerBaseURL = process.env.NEXT_PUBLIC_SLEEPER_PLAYER_THUMBS_BASE_URL;

    useEffect(() => {
        async function fetchMVP() {
            try {
                const player = await getMVP(roster.roster_id, rosters);
                setMVP(player);
                setLoadMVP(false);
            } catch (error) {
                console.error("Error fetching MVP:", error);
            }
        }
        fetchMVP();
    }, [mvp, roster.roster_id, rosters]);

    const logo = findLogo(mvp?.team);
    // const position = mvp?.position ? mvp.position.match(/^[A-Z]+/)?.[0] : undefined;

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
                        backgroundImage: `url(${playerBaseURL}${mvp?.player_id}.jpg)`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom",
                        backgroundSize: "cover",
                        minHeight: "145px",
                        minWidth: "175px"
                    }}>
                    </div>
                </div>
                <div className="col">
                    <div className="flex justify-between">
                        <div className="mt-2">
                            <p className="m-0">{mvp?.first_name}</p>
                            <p className="m-0 font-bold truncate text-3xl" style={{fontSize: "1.3em"}}>{mvp?.last_name}</p>
                        </div>
                        <div className="p-2">
                            <Image className={styles.ownerLogo} alt="avatar" width={24} height={24} src={`${avatarBaseURL}${roster?.owner?.avatar}`}/>
                        </div>
                    </div>
                    <div className="my-1 flex items-center">
                        <div className={`${styles.playerHUD} ${positionStyles[mvp?.position as keyof typeof positionStyles] || ""}`}>
                            <p className="m-0 flex items-center text-sm" style={{fontSize: "12px", paddingLeft: "6px"}}>
                                {mvp?.position}
                                <span style={{color: "whitesmoke", fontWeight: "normal", paddingLeft: "12px"}}>
                                    {getTotalPts(league, matches, roster.roster_id, mvp.player_id).pts}
                                    <span style={{color: "lightgray"}}> pts</span>
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center mx-2" style={{marginTop: ".8em"}}>
                        <div className="flex items-center" style={{width: "60px"}}>
                            <Icon icon="fa6-solid:ranking-star" style={{fontSize: "22px", color: "#a9dfd8"}}/>
                            <p className="m-0 text-sm" style={{fontSize: "12px", paddingLeft: "4px"}}>{mvp.rank}</p>
                        </div>
                        <div className="flex items-center">
                            <Image src={value} alt="value" width={25} height={25}/>
                            <p className="m-0 text-sm" style={{fontSize: "12px", paddingLeft: "6px"}}>{mvp.value}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
