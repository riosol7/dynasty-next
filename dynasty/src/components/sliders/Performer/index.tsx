import styles from "./Performer.module.css";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import React, { useState } from "react";
import { useLeagueContext, usePlayerContext } from "@/context";
import * as Interfaces from "@/interfaces";
import { calculatePercentage, findLeagueBySeason, findLogo, findPlayerByID, findUserByRosterID, getMatchups } from "@/utils";
import { PLAYER_BASE_URL, POSITION_COLORS } from "@/constants";
import { useSearchParams } from "next/navigation";

interface TopPerformingPlayer {
    roster_id: number;
    player_id: string;
    points: number;
    team_points: number;
};

export default function PerformerSlider() {
    const { legacyLeague } = useLeagueContext();
    const { players } = usePlayerContext();
    const searchParams = useSearchParams();

    const [listCount, setListCount] = useState<number>(25);

    const week: number = Number(searchParams.get("week"))
    const season: string | null = searchParams.get("season");    
    const league: Interfaces.League = findLeagueBySeason(season!, legacyLeague);
    const rosters = league.rosters;
    const matchups = getMatchups(league.matchups);
    const selectedMatchups =  matchups && matchups[week - 1];
    const topPerformingPlayers = selectedMatchups?.slice().flat().map(
        (team: Interfaces.Match) => {
            const starters = team.starters.map((starter, j) => {
                return {
                    roster_id: team.roster_id,
                    player_id: starter,
                    points: team.starters_points[j],
                    team_points: team.points,
                }
            })
            return starters;     
        }
    ).flat().sort((a: TopPerformingPlayer, b: TopPerformingPlayer) => b.points - a.points);
    
    const topStarters = () => {
        return topPerformingPlayers?.slice(0, 25).map((player: TopPerformingPlayer, k: number) => {
            const user = findUserByRosterID(player.roster_id, league);
            const playerInfo = findPlayerByID(player.player_id, players);
            const checkPodium = (idx: number) => {
                switch(idx) {
                    case 0:
                        return styles.topPerformerCardBgGold
                    case 1:
                        return styles.topPerformerCardBgSilver
                    case 2:
                        return styles.topPerformerCardBgBronze
                    default: 
                        return styles.topPerformerCardBg
                }
            };
            return (
                <SwiperSlide key={k} className={`${checkPodium(k)}`}>
                    <div className={`${styles.topPerformerCard}`}>
                        <div className={`${styles.playerImage}`} style={
                            {backgroundImage: playerInfo.position === "DEF" ?
                            `url(${findLogo(playerInfo?.team).l}` : `url(${PLAYER_BASE_URL}${player.player_id}.jpg)`}
                        }>
                            <p className={styles.rank}>{k + 1}</p>
                            <div className="flex justify-center">
                                <p className={styles.position} style={{ color: POSITION_COLORS[playerInfo.position as keyof typeof POSITION_COLORS]}}>{playerInfo.position}</p>
                            </div>
                        </div>
                        <div className="text-center text-xs pt-4">
                            <p className="font-bold">{playerInfo.first_name[0]}. {playerInfo.last_name}</p>
                            <p className="pt-1">{player.points} 
                            <span className="pl-1 font-light">({calculatePercentage(player.points, player.team_points)}%)</span>
                            </p>
                            <p className={styles.username}>{user.display_name}</p>
                        </div>
                    </div>
                </SwiperSlide>
            );
        });
    };

    return (
        <Swiper breakpoints = {{
            1850: {
                slidesPerView: 14,
            },
            1650:{
                slidesPerView: 12,
            },
            1440:{
                slidesPerView: 6,
            },
            1250:{
                slidesPerView: 5,
            },
            1050:{
                slidesPerView: 4,
            },
            800:{
                slidesPerView: 3,
            },
            615:{
                slidesPerView: 2,
            },
        }}
        spaceBetween={10}
        direction="horizontal"
        slidesPerGroup={1}
        loop={false}>
        <div className="flex items-center">
            {topStarters()}
        </div>
        </Swiper>
    );
};
