"use client";
import "swiper/swiper-bundle.css";
import styles from "./MVP.module.css";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Icon } from "@iconify-icon/react";
import MVPSlide from "./slides";
import { processPlayers, processRosters } from "@/utils";
import { 
    useDynastyProcessContext,
    useFantasyCalcContext,
    useFantasyProContext,
    useKTCContext,
    useLeagueContext,
    usePlayerContext,
    useSuperFlexContext,
} from "@/context";
import * as Interfaces from "@/interfaces";
import LoadMVP from "./slides/loadMVP";

export default function MVPSlider() {
    const { legacyLeague, loadLegacyLeague } = useLeagueContext(); 
    const { players, loadPlayers } = usePlayerContext();
    const { ktc, loadKTC } = useKTCContext();
    const { superFlex, loadSuperFlex } = useSuperFlexContext();
    const { fc, loadFC } = useFantasyCalcContext();
    const { dp, loadDP } = useDynastyProcessContext();
    const { fantasyPro, loadFantasyPro } = useFantasyProContext();
    const [ mvpType, setMVPType ] = useState<string>("Dynasty");
    const processedPlayers = processPlayers(players, ktc, superFlex, fc, dp, fantasyPro);
    const processedRosters = processRosters(legacyLeague[0], processedPlayers);
    const loading: boolean = loadLegacyLeague && loadPlayers && loadKTC && loadSuperFlex && loadFC && loadDP && loadFantasyPro;

    const handleMVPType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMVPType(e.target.value);
    };

    return (
        <div className="py-5">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <Icon icon="fluent:star-line-horizontal-3-24-regular" style={{ color: "#a9dfd8", fontSize: "1.1rem" }} />
                    <select className={`"mx-1 font-bold flex items-center ${styles.selectTag}`} onChange={handleMVPType} value={mvpType}>
                        <option value={"Dynasty"}>Dynasty MVP</option>
                        <option value={"Fantasy"}>Fantasy MVP</option>
                    </select>
                </div>
                <a className={styles.anchorCell} href={`/players`}>
                    <Icon className={styles.arrow} icon="material-symbols:arrow-right-alt-rounded" style={{ fontSize: "1.5rem", color: "#cbcbcb" }}/>
                </a>
            </div>
            {loading ? <LoadMVP/> : 
            <Swiper breakpoints = {{
                1850: {
                    slidesPerView: 5,
                    spaceBetween: 25,
                    loop: true,
                },
                1520:{
                    slidesPerView: 4,
                    spaceBetween: 25,
                    loop: true,
                },
                1200:{
                    slidesPerView: 3,
                    spaceBetween: 45,
                    loop: true,
                },
                855:{
                    slidesPerView: 2,
                    spaceBetween: 25,
                    loop: true,
                },
            }}
            style={{ cursor: "grab" }}
            slidesPerGroup={1} 
            loop={true} 
            modules={[Autoplay]}
            autoplay={{
                delay: 5500,
                disableOnInteraction: false,
            }}>
                {processedRosters?.map((roster: Interfaces.Roster, i: React.Key) => (
                <SwiperSlide key={i}>
                    <MVPSlide legacyLeague={legacyLeague} mvpType={mvpType} roster={roster}/>
                </SwiperSlide>
                ))}
            </Swiper>}
        </div>
    );
};
