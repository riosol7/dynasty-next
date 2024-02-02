"use client";
import styles from "./Matchups.module.css";
import { useState } from "react";
import { useLeagueContext, useSeasonContext } from "@/context";
import * as Interfaces from "@/interfaces";
import { findLeagueBySeason, findUserByRosterID, getMatchups } from '@/utils';
import { Icon } from '@iconify-icon/react';

export default function MatchupNav({ selectWeek, setSelectWeek }: Interfaces.MatchupNavProps) {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason, setSelectSeason } = useSeasonContext();
    
    const [ showModal, setShowModal ] = useState<boolean>(false); 
    const league: Interfaces.League = findLeagueBySeason(selectSeason, legacyLeague);
    const matchups = getMatchups(league.matchups);
    const numWeeks = matchups.length;
    const weeks: string[] = Array.from({ length: numWeeks }, (_, index) => `Week ${index + 1}`);
    const selectedWeekMatchups = matchups && matchups[selectWeek - 1];
    const matchupList = selectedWeekMatchups?.flat().sort((a: Interfaces.Match, b: Interfaces.Match) => b.points - a.points);
    const bestOffense = matchupList && matchupList[0];
    const bestOffenseUser = findUserByRosterID(bestOffense?.roster_id, league);
    const worstOffense = matchupList && matchupList[matchupList?.length - 1];
    const worstOffenseUser = findUserByRosterID(worstOffense?.roster_id, league);

    return (
        <nav className={styles.matchupNav}>
            <div className="flex items-end">
                <div onClick={() => setShowModal(!showModal)} className={`${styles.selectWeek}`}>
                    {`Week ${selectWeek}, ${selectSeason}`}
                    <Icon icon="eva:arrow-down-fill"/>
                    {showModal ?
                    <div className={styles.modal}> 
                        <div className={`w-6/12 text-center ${styles.scroll}`}>
                        {weeks.map((week, i) => 
                            <p key={i} className={styles.hover} onClick={() => setSelectWeek(i + 1)}>{week}</p>
                        )}    
                        </div>
                        <div className={`w-6/12 text-center ${styles.scroll}`}>
                        {legacyLeague.map((league, idx) =>
                            <p key={idx} className={styles.hover} onClick={() => setSelectSeason(league.season)}>{league.season}</p>
                        )}
                        </div>
                    </div>
                    :<></>}
                </div>
                {/* <div className="pl-3 flex items-center">
                    <Icon icon="ep:arrow-left-bold" className={styles.arrow}/>
                    <Icon icon="ep:arrow-right-bold" className={styles.arrow}/>
                </div> */}
            </div>
            <div className="flex items-center text-xs">
                <div className={styles.awardCard}>
                    
                    <p>Best Offense</p>
                    <p>{bestOffenseUser.display_name}</p>
                </div>
                <div className={styles.awardCard}>
                    
                    <p>Worst Offense</p>
                    <p>{worstOffenseUser.display_name}</p>
                </div>
                <div className={styles.awardCard}>
                    
                    <p>Most Efficient</p>
                </div>
                <div className={styles.awardCard}>
                    
                    <p>Least Efficient</p>
                </div>
                <div className={styles.awardCard}>
                    
                    <p>Biggest Blowout</p>
                </div>
                <div className={styles.awardCard}>
                    <p>Close Call</p>

                </div>
            </div>
        </nav>
    );
};