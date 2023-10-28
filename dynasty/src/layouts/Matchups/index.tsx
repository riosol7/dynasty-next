import styles from "./Matchups.module.css";
import { useState } from "react";
import { useLeagueContext, useSeasonContext } from "@/context";
import * as Interfaces from "@/interfaces";
import { findLeagueBySeason, getMatchups } from '@/utils';
import { Icon } from '@iconify-icon/react';

export default function MatchupsLayout({ children, selectWeek, setSelectWeek }: Interfaces.MatchupsLayoutProps) {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason, setSelectSeason } = useSeasonContext();
    
    const [ showModal, setShowModal ] = useState<boolean>(false); 
    const league: Interfaces.League = findLeagueBySeason(selectSeason, legacyLeague);
    const matchups = getMatchups(league.matchups);
    const numWeeks = matchups.length;
    const weeks: string[] = Array.from({ length: numWeeks }, (_, index) => `Week ${index + 1}`);

    return (
        <>
            <div className="flex items-center justify-between">
                <div onClick={() => setShowModal(!showModal)} className={`${styles.hover} flex items-center text-xl p-2`}>
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
                <div className="flex items-center text-xs">
                    <div className={styles.awardCard}>
                        
                        <p>Best Offense</p>
                    </div>
                    <div className={styles.awardCard}>
                        
                        <p>Worst Offense</p>
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
            </div>
            {children}
        </>
    );
};