"use client";
import styles from "./Matchups.module.css";
import LeagueMatchupSlider from "@/components/sliders/LeagueMatchups"
import MatchupWidget from "@/components/widgets/Matchup";
import { SeasonProvider, useLeagueContext } from "@/context";
import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import * as Interfaces from "@/interfaces";
import { findLeagueBySeason, getMatchups, sortMatchupsByHighestScore } from "@/utils";
import AllTimeScoreWidget from "@/components/widgets/Matchup/AllTimeScores";
import PerformerSlider from "@/components/sliders/Performer";
import { useSearchParams } from "next/navigation";

export default function Matchups() {
    const { legacyLeague } = useLeagueContext();
    const searchParams = useSearchParams();
    const week: number = Number(searchParams.get("week"));
    const season: string = searchParams.get("season")!;
    const foundLeague: Interfaces.League = findLeagueBySeason(season, legacyLeague);
    const matchups = getMatchups(foundLeague.matchups);

    const sortedMatchups: Interfaces.Match[][] = sortMatchupsByHighestScore(matchups[week - 1]);
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
                <PerformerSlider/>
            </div>
            <div className="pb-5">
                <h3 className={styles.sectionTitle}>
                    <Icon icon="tabler:vs" className={`pr-1 ${styles.icon}`}/>
                    League Matchups
                </h3>
                <LeagueMatchupSlider matchup={matchup} setMatchup={setMatchup}/>
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