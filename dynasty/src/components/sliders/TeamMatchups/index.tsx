import styles from "./TeamMatchups.module.css";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useLeagueContext, useSeasonContext } from "@/context";
import { findLeagueBySeason, findRosterByOwnerID, findUserByName, getMatchups } from "@/utils";
import MatchupSlide from "./slides";
import * as Interfaces from "@/interfaces";

export default function TeamMatchupSlider({ name }: Interfaces.TeamParamProps) {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason } = useSeasonContext();

    const foundLeague = findLeagueBySeason(selectSeason, legacyLeague);
    const foundUser = findUserByName(name, foundLeague);
    const foundRoster = findRosterByOwnerID(foundUser.user_id, foundLeague);
    const matchups = getMatchups(foundLeague.matchups, foundRoster.roster_id);

    return (
        <div className="pb-3">
            <p className={`pb-2 ${styles.weeklyBreakdown}`}>{selectSeason} Weekly Breakdown</p>
            <Swiper breakpoints = {{
                1850: {
                    slidesPerView: 8,
                    spaceBetween: 5,
                    loop: true,
                },
                1650:{
                    slidesPerView: 7,
                    spaceBetween: 5,
                    loop: true,
                },
                1440:{
                    slidesPerView: 6,
                    spaceBetween: 5,
                    loop: true,
                },
                1250:{
                    slidesPerView: 5,
                    spaceBetween: 5,
                    loop: true,
                },
                1050:{
                    slidesPerView: 4,
                    spaceBetween: 5,
                    loop: true,
                },
                800:{
                    slidesPerView: 3,
                    spaceBetween: 5,
                    loop: true,
                },
                615:{
                    slidesPerView: 2,
                    spaceBetween: 5,
                    loop: true,
                },
            }}
            direction="horizontal"
            slidesPerGroup={1}
            loop={true}
            modules={[Autoplay]}
            autoplay={{
                delay: 7000,
                disableOnInteraction: false
            }}>
                {matchups?.map((matchup, i) => 
                    <SwiperSlide key={i}>
                        <MatchupSlide
                            idx={i}
                            name={name}
                            matchup={matchup}
                        />
                    </SwiperSlide>
                )}
            </Swiper>
        </div>
    );
};