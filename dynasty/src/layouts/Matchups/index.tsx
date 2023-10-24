import styles from "./Matchups.module.css";
import { useState } from "react";
import { useLeagueContext, useSeasonContext } from '@/context';
import * as Interfaces from "@/interfaces";
import { findLeagueBySeason } from '@/utils';
import { Icon } from '@iconify-icon/react';

export default function MatchupsLayout({ children }: Interfaces.ChildrenProps) {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason, setSelectSeason } = useSeasonContext();
    const [ selectWeek, setSelectWeek ] = useState<number>(1); 
    const [ showModal, setShowModal ] = useState<boolean>(false); 
    const league: Interfaces.League = findLeagueBySeason(selectSeason, legacyLeague);
    const numWeeks = league.matchups.length;
    const weeks: string[] = Array.from({ length: numWeeks }, (_, index) => `Week ${index + 1}`);
    const handleChange = (value: number) => {
        setSelectWeek(value);
    };
    
    return (
        <div>
            <div className="flex items-center">
                <p onClick={() => setShowModal(!showModal)} className={`${styles.hover} text-2xl flex items-center p-2`}>
                    {`Week ${selectWeek}, ${selectSeason}`}
                    <Icon icon="eva:arrow-down-fill"/>
                </p>
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
            {children}
        </div>
    );
};