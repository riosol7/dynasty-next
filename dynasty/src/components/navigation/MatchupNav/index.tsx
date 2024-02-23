"use client";
import styles from "./Matchups.module.css";
import React, { useState } from "react";
import { useLeagueContext } from "@/context";
import * as Interfaces from "@/interfaces";
import { findLeagueBySeason, findMatchupByWeekSeason, findMatchupDateByPoints, findUserByRosterID, getMatchups } from '@/utils';
import { Icon } from '@iconify-icon/react';
import { useRouter, useSearchParams } from "next/navigation";


export default function MatchupNav({ matchup, selectMatchup }: Interfaces.MatchupNavProps) {
    const { legacyLeague } = useLeagueContext();
    const searchParams = useSearchParams();
    const router = useRouter();

    const team1: Interfaces.Match = matchup && matchup[0];
    const team2: Interfaces.Match = matchup && matchup[1];
    const team1Score: number = team1?.points!;
    const team2Score: number = team2?.points!;
    const foundGameWeekByScore = findMatchupDateByPoints(
    legacyLeague, team1Score, team2Score);

    const week: number = foundGameWeekByScore?.week! || 
    Number(searchParams.get("week"));
    const season: string = foundGameWeekByScore?.season! ||
    searchParams.get("season")!;
    
    const [ showModal, setShowModal ] = useState<boolean>(false); 

    const league: Interfaces.League = findLeagueBySeason(season!, legacyLeague);
    const matchups = getMatchups(league.matchups);
    const numWeeks = matchups.length;
    const weeks: string[] = Array.from({ length: numWeeks }, (_, index) => `Week ${index + 1}`);
    const selectedWeekMatchups = matchups && matchups[week - 1];
    const matchupList = selectedWeekMatchups?.flat().sort((a: Interfaces.Match, b: Interfaces.Match) => b.points - a.points);
    const bestOffense = matchupList && matchupList[0];
    const bestOffenseUser = findUserByRosterID(bestOffense?.roster_id, league);
    const worstOffense = matchupList && matchupList[matchupList?.length - 1];
    const worstOffenseUser = findUserByRosterID(worstOffense?.roster_id, league);

    const applySearch = (weekIdx:number, selectedSeason: string, event: React.MouseEvent): void => {
        event.preventDefault();

        const strWeek: string = weekIdx!.toString();
        const newSearchParams = new URLSearchParams(searchParams.toString());
        
        if (strWeek === "17" && Number(selectedSeason) <= 2020) {
            const modifiedStrWeek: string = (Number(strWeek) - 1).toString();
            newSearchParams.set("week", modifiedStrWeek);
        } else {
            newSearchParams.set("week", strWeek);
        };

        newSearchParams.set("season", selectedSeason!);

        selectMatchup(
            findMatchupByWeekSeason(legacyLeague, weekIdx, selectedSeason),
            event
        );
        // const currentUrl = window.location.href;
        // const newUrl = currentUrl.split('?')[0] + '?' + newSearchParams.toString();

        // router.replace(newUrl, undefined);
    };

    return (
        <nav className={styles.matchupNav}>
            <div className="flex items-end">
                <div onMouseEnter={() => setShowModal(true)} onMouseLeave={() => setShowModal(false)} className={`${styles.selectWeek}`}>
                    {`Week ${week}, ${season}`}
                    <Icon icon="eva:arrow-down-fill"/>
                    {showModal ?
                    <div className={styles.modal}>
                        <div className={`w-6/12 text-center ${styles.scroll} ${styles.selectWeekScroll}`}>
                        {weeks.map((weekLabel, i) => 
                            <p key={i} className={`${styles.hover} ${week === i + 1 ? styles.selectedParam : ""}`} 
                            onClick={(e) => applySearch(i + 1, season, e)}>{weekLabel}</p>
                        )}    
                        </div>
                        <div className={`w-6/12 text-center ${styles.scroll} ${styles.selectWeekScroll}`}>
                        {legacyLeague.filter(league => league.status !== "pre_draft").map((league, idx) =>
                            <p key={idx} className={`${styles.hover} ${season === league.season? styles.selectedParam : ""}`} 
                            onClick={(e) => applySearch(week, league.season, e)}>{league.season}</p>
                        )}
                        </div>
                    </div>:<></>}
                </div>
            </div>
            <div className="flex items-center text-xs">
                <div className={styles.awardCard}>
                    <Icon icon="game-icons:punch-blast" className={styles.icon}/>
                    <p>Best Offense</p>
                    <p>{bestOffenseUser.display_name}</p>
                </div>
                <div className={styles.awardCard}>
                    <Icon icon="fa-solid:car-crash" className={styles.icon}/>
                    <p>Worst Offense</p>
                    <p>{worstOffenseUser.display_name}</p>
                </div>
                <div className={styles.awardCard}>
                    <Icon icon="material-symbols:energy-program-saving" className={styles.icon}/>
                    <p>Most Efficient</p>
                </div>
                <div className={styles.awardCard}>
                    <Icon icon="game-icons:thunder-struck" className={styles.icon}/>
                    <p>Least Efficient</p>
                </div>
                <div className={styles.awardCard}>
                    <Icon icon="fa6-solid:explosion" className={styles.icon}/>
                    <p>Biggest Blowout</p>
                </div>
                <div className={styles.awardCard}>
                    <p>Close Call</p>

                </div>
            </div>
        </nav>
    );
};