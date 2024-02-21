"use client";
import styles from "./Matchups.module.css";
import { useState } from "react";
import { useLeagueContext } from "@/context";
import * as Interfaces from "@/interfaces";
import { findLeagueBySeason, findUserByRosterID, getMatchups } from '@/utils';
import { Icon } from '@iconify-icon/react';
import { useRouter, useSearchParams } from "next/navigation";


export default function MatchupNav() {
    const { legacyLeague } = useLeagueContext();
    const searchParams = useSearchParams();
    const router = useRouter();

    const week: number = Number(searchParams.get("week"));
    const season: string = searchParams.get("season")!; 
    const [ selectWeek, setSelectWeek ] = useState<number>(Number(week));
    const [ selectSeason, setSelectSeason ] = useState<string>(season)
    const [ showModal, setShowModal ] = useState<boolean>(false); 
    const [forceRerender, setForceRerender] = useState(false);

    const league: Interfaces.League = findLeagueBySeason(selectSeason!, legacyLeague);
    const matchups = getMatchups(league.matchups);
    const numWeeks = matchups.length;
    const weeks: string[] = Array.from({ length: numWeeks }, (_, index) => `Week ${index + 1}`);
    const selectedWeekMatchups = matchups && matchups[week - 1];
    const matchupList = selectedWeekMatchups?.flat().sort((a: Interfaces.Match, b: Interfaces.Match) => b.points - a.points);
    const bestOffense = matchupList && matchupList[0];
    const bestOffenseUser = findUserByRosterID(bestOffense?.roster_id, league);
    const worstOffense = matchupList && matchupList[matchupList?.length - 1];
    const worstOffenseUser = findUserByRosterID(worstOffense?.roster_id, league);

    const applySearch = (): void => {
        const strWeek: string = selectWeek.toString();
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("week", strWeek);
        newSearchParams.set("season", selectSeason);

        const currentUrl = window.location.href;
        const newUrl = currentUrl.split('?')[0] + '?' + newSearchParams.toString();

        router.replace(newUrl, undefined);
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
                        {weeks.map((week, i) => 
                            <p key={i} className={styles.hover} onClick={() => setSelectWeek(i + 1)}
                            style={{
                                fontWeight: selectWeek === i + 1? "bolder" : ""
                            }}
                            >{week}</p>
                        )}    
                        </div>
                        <div className={`w-6/12 text-center ${styles.scroll}`}>
                        {legacyLeague.filter(league => league.status !== "pre_draft").map((league, idx) =>
                            <p key={idx} className={styles.hover} onClick={() => setSelectSeason(league.season)}
                            style={{
                                fontWeight: selectSeason === league.season? "bolder" : ""
                            }}>{league.season}</p>
                        )}
                        </div>
                        <div>
                            <button onClick={() => applySearch()} className={styles.applySearch}>
                                Apply
                            </button>                        
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
                    <Icon icon="fa6-solid:explosion" className={styles.icon}/>
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