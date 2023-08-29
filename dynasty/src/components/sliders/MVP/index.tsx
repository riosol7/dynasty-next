import 'swiper/swiper-bundle.min.css';
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Autoplay from "swiper";
import { Icon } from "@iconify-icon/react";
import MVPSlide from './slides';

export default function MVPSlider({rosters, league, matches}) {
    return (
        <div className="my-5">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                <Icon icon="fluent:star-line-horizontal-3-24-regular" style={{ color: "#a9dfd8", fontSize: "1.1rem" }} />
                <p className="m-0 mx-1 font-semibold">MVPs</p>
                </div>
                <div id="LA" className="p-2">
                <Icon icon="material-symbols:arrow-right-alt-rounded" style={{ fontSize: "1.5rem", color: "#cbcbcb" }} />
                </div>
            </div>
            <div>
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
                    {rosters?.teamRank?.map((roster, i) => (
                    <SwiperSlide key={i}>
                        <MVPSlide league={league} matches={matches} roster={roster} />
                    </SwiperSlide>
                    ))}
                </Swiper>
                </div>
            </div>
            </div>
    )
}
