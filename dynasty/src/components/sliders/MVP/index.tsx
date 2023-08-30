"use client";
import "swiper/swiper-bundle.min.css";
import styles from "./MVP.module.css";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from 'swiper/modules';
import { Icon } from "@iconify-icon/react";
import MVPSlide from "./slides";
import { processPlayers, processRosters } from "@/utils";
import { 
    useFantasyCalcContext,
    useKTCContext,
    useOwnerContext,
    usePlayerContext,
    useRosterContext,
    useSuperFlexContext,
 } from "@/context";
import { Roster } from "@/interfaces";

export default function MVPSlider() {
    const { owners, loadOwners } = useOwnerContext();
    const { rosters, loadRosters } = useRosterContext();
    const { players, loadPlayers } = usePlayerContext();
    const { ktc, loadKTC } = useKTCContext();
    const { superFlex, loadSuperFlex } = useSuperFlexContext();
    const { fc, loadFC } = useFantasyCalcContext();
    // const processedPlayers = processPlayers(players, ktc, superFlex, fc);
    const processedRosters = processRosters(rosters, players, owners);

    // console.log("processedPlayers",processedPlayers);
    // console.log("processedRosters",processedRosters);

    return (
        <div className="my-5">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <Icon icon="fluent:star-line-horizontal-3-24-regular" style={{ color: "#a9dfd8", fontSize: "1.1rem" }} />
                    <p className="m-0 mx-1 font-semibold">MVPs</p>
                </div>
                <Icon className={styles.arrow} icon="material-symbols:arrow-right-alt-rounded" style={{ fontSize: "1.5rem", color: "#cbcbcb" }} />
            </div>
            <div className="flex" style={{ maxWidth: "1717.44px", cursor: "grab" }}>
                <Swiper
                    breakpoints={{
                    1850: {
                        slidesPerView: 5,
                        spaceBetween: 55,
                        loop: true,
                    },
                    1520: {
                        slidesPerView: 4,
                        spaceBetween: 55,
                        loop: true,
                    },
                    1200: {
                        slidesPerView: 3,
                        spaceBetween: 55,
                        loop: true,
                    },
                    855: {
                        slidesPerView: 2,
                        spaceBetween: 25,
                        loop: true,
                    }
                    }}
                    spaceBetween={30}
                    slidesPerGroup={1}
                    loop={true}
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 5500,
                        disableOnInteraction: false
                    }}
                >
                    {processedRosters?.map((roster: Roster, i: React.Key) => (
                    <SwiperSlide key={i}>
                        <MVPSlide roster={roster} rosters={processedRosters}/>
                    </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}
