"use client";
import styles from "./Matchups.module.css";
import LeagueMatchupSlider from "@/components/sliders/LeagueMatchups"
import MatchupWidget from "@/components/widgets/Matchup";
import { SeasonProvider, useLeagueContext } from "@/context";
import MatchupsLayout from "@/layouts/Matchups";
import { useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import * as Interfaces from "@/interfaces";
import { getMatchups, sortMatchupsByHighestScore } from "@/utils";
import AllTimeScoreWidget from "@/components/widgets/Matchup/AllTimeScores";
import PerformerList from "@/components/widgets/PerformerList";

export default function Matchups() {
    const { legacyLeague } = useLeagueContext();
    const matchups = getMatchups(legacyLeague[0].matchups);
    const currentWeek: number = matchups.map(weeks => weeks.filter((week: Interfaces.Match[]) => week[0].points !== 0)).filter(week => week.length > 0).length || 0;
    const sortedMatchups: Interfaces.Match[][] = sortMatchupsByHighestScore(matchups[currentWeek - 1]);
    const initialMatchup: Interfaces.Match[] = sortedMatchups && sortedMatchups[0];
    const [ selectWeek, setSelectWeek ] = useState<number>(currentWeek);
    const [ matchup, setMatchup ] = useState<Interfaces.Match[]>(initialMatchup);

    useEffect(() => {
        if (selectWeek === 0) {
            setSelectWeek(currentWeek);
        };
    }, [currentWeek]);

    useEffect(() => {
        if (matchup === undefined) {
            setMatchup(initialMatchup)
        }
    }, [initialMatchup]);

    return (
        <SeasonProvider season={legacyLeague[0].season || ""}>
            <MatchupsLayout selectWeek={selectWeek} setSelectWeek={setSelectWeek}>
                <div className="py-5">
                    <h3 className={styles.header}><Icon icon="game-icons:american-football-helmet" className={`pr-1 ${styles.icon}`}/>Top Performers</h3>
                    <PerformerList selectWeek={selectWeek}/>
                </div>
                <div className="py-5">
                    <h3 className={styles.header}><Icon icon="tabler:vs" className={`pr-1 ${styles.icon}`}/>League Matchups</h3>
                    <LeagueMatchupSlider selectWeek={selectWeek} setMatchup={setMatchup}/>
                </div>
                <div className="py-5 flex">
                    <div className="pr-5">
                        <MatchupWidget matchup={matchup}/>
                    </div>
                    <AllTimeScoreWidget/>
                </div>
            </MatchupsLayout>
        </SeasonProvider>
    );
};