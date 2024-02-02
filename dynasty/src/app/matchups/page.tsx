"use client";
import styles from "./Matchups.module.css";
import LeagueMatchupSlider from "@/components/sliders/LeagueMatchups"
import MatchupWidget from "@/components/widgets/Matchup";
import { SeasonProvider, useLeagueContext } from "@/context";
import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import * as Interfaces from "@/interfaces";
import { getMatchups, sortMatchupsByHighestScore } from "@/utils";
import AllTimeScoreWidget from "@/components/widgets/Matchup/AllTimeScores";
import Performer from "@/components/sliders/Performer";

export default function Matchups({ params: {week, season} }: Interfaces.MatchupsParams ) {
    console.log("week: ", week);

    const { legacyLeague } = useLeagueContext();
    const matchups = getMatchups(legacyLeague[0].matchups);
    const currentWeek: number = matchups.map(weeks => weeks.filter((week: Interfaces.Match[]) => week[0].points !== 0)).filter(week => week.length > 0).length || 0;
    const sortedMatchups: Interfaces.Match[][] = sortMatchupsByHighestScore(matchups[currentWeek - 1]);
    const initialMatchup: Interfaces.Match[] = sortedMatchups && sortedMatchups[0];
    const [ matchup, setMatchup ] = useState<Interfaces.Match[]>(initialMatchup);
    
    useEffect(() => {
        if (matchup === undefined) {
            setMatchup(initialMatchup)
        }
    }, [initialMatchup]);
    
    return (
        <SeasonProvider season={legacyLeague[0].season || ""}>
            <div className="">
                <h3 className={`${styles.sectionTitle}`}>
                    <Icon icon="game-icons:american-football-helmet" className={`pr-1 ${styles.icon}`}/>
                    Top Performers
                </h3>
                <Performer selectWeek={week}/>
            </div>
            <div className="pb-5">
                <h3 className={styles.sectionTitle}>
                    <Icon icon="tabler:vs" className={`pr-1 ${styles.icon}`}/>
                    League Matchups
                </h3>
                <LeagueMatchupSlider selectWeek={week} matchup={matchup} setMatchup={setMatchup}/>
            </div>
            <div className="py-5 flex">
                <div className="pr-5 mr-5">
                    <MatchupWidget matchup={matchup}/>
                </div>
                <AllTimeScoreWidget/>
            </div>
        </SeasonProvider>
    );
};