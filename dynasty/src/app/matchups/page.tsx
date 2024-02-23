"use client";
import styles from "./Matchups.module.css";
import LeagueMatchupSlider from "@/components/sliders/LeagueMatchups"
import MatchupWidget from "@/components/widgets/Matchup";
import { SeasonProvider, useLeagueContext } from "@/context";
import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import * as Interfaces from "@/interfaces";
import { findLeagueBySeason, findMatchupDateByPoints, getMatchups, sortMatchupsByHighestScore } from "@/utils";
import PerformerSlider from "@/components/sliders/Performer";
import { useRouter, useSearchParams } from "next/navigation";
import LegacyMatchup from "@/components/widgets/Matchup/LegacyMatchup";
import MatchupNav from "@/components/navigation/MatchupNav";

export default function Matchups() {
    const router = useRouter();
    const { legacyLeague } = useLeagueContext();
    const searchParams = useSearchParams();
    const week: number = Number(searchParams.get("week"));
    const season: string = searchParams.get("season")!;
    const foundLeague: Interfaces.League = findLeagueBySeason(season, legacyLeague);
    const matchups = getMatchups(foundLeague.matchups);

    const sortedMatchups: Interfaces.Match[][] = sortMatchupsByHighestScore(matchups[week - 1]);
    const initialMatchup: Interfaces.Match[] = sortedMatchups && sortedMatchups[0];
    const [ matchup, setMatchup ] = useState<Interfaces.Match[]>(initialMatchup);
    
    const selectMatchup = (
        game: Interfaces.Match[], 
        event: React.MouseEvent, 
        selectWeek: string,
        selectSeason: string): void => {
        event.preventDefault();

        const sortedScores: Interfaces.Match[] = game.sort((a, b) => b.points - a.points); 
        const team1pts: number = sortedScores! && sortedScores[0]?.points!;
        const team2pts: number = sortedScores! && sortedScores[0]?.points!;

        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("week", selectWeek);
        newSearchParams.set("season", selectSeason);

        const currentUrl = window.location.href;
        const newUrl = currentUrl.split('?')[0] + '?' + newSearchParams.toString();
        setMatchup(sortedScores);

        window.history.pushState({}, '', newUrl);
    };
    
    useEffect(() => {
        if (matchup === undefined) {
            setMatchup(initialMatchup)
        }
    }, [initialMatchup]);
    
    return (
        <SeasonProvider season={legacyLeague[0].season || ""}>
            <MatchupNav matchup={matchup} selectMatchup={selectMatchup}/>
            <div className={styles.body}>
                <div className="">
                    <h3 className={`${styles.sectionTitle}`}>
                        <Icon icon="game-icons:american-football-helmet" className={`pr-1 ${styles.icon}`}/>
                        Top Performers
                    </h3>
                    <PerformerSlider matchup={matchup}/>
                </div>
                <div className="pb-5">
                    <h3 className={styles.sectionTitle}>
                        <Icon icon="tabler:vs" className={`pr-1 ${styles.icon}`}/>
                        League Matchups
                    </h3>
                    <LeagueMatchupSlider matchup={matchup} selectMatchup={selectMatchup}/>
                </div>
                <div className="py-5 mt-5 flex items-start">
                    <div className="mr-5 pr-3">
                        <MatchupWidget matchup={matchup}/>
                    </div>
                    <div className="w-7/12 w-full">
                        <LegacyMatchup matchup={matchup} legacy={true} selectMatchup={selectMatchup}/>
                        <LegacyMatchup legacy={false} selectMatchup={selectMatchup}/>
                    </div>
                </div>
            </div>
        </SeasonProvider>
    );
};