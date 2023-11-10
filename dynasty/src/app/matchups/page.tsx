"use client";
import LeagueMatchupSlider from "@/components/sliders/LeagueMatchups"
import MatchupWidget from "@/components/widgets/Matchup";
import { SeasonProvider, useLeagueContext } from "@/context";
import MatchupsLayout from "@/layouts/Matchups";
import { useState, useEffect } from "react";
import * as Interfaces from "@/interfaces";
import { getMatchups, sortMatchupsByHighestScore } from "@/utils";
import AllTimeScoreWidget from "@/components/widgets/Matchup/AllTimeScores";

export default function Matchups() {
    const { legacyLeague } = useLeagueContext();
    const matchups = getMatchups(legacyLeague[0].matchups);
    const currentWeek: number = matchups.map(weeks => weeks.filter((week: Interfaces.Match[]) => week[0].points !== 0)).filter(week => week.length > 0).length || 0;
    const sortedMatchups: Interfaces.Match[][] = sortMatchupsByHighestScore(matchups);
    const initialMatchup: Interfaces.Match[] = sortedMatchups[currentWeek - 1] ? sortedMatchups[currentWeek - 1][0] : [];

    const [ selectWeek, setSelectWeek ] = useState<number>(currentWeek);
    const [matchup, setMatchup] = useState<Interfaces.Match[]>(initialMatchup || []);

    useEffect(() => {
        if (selectWeek === 0) {
            setSelectWeek(currentWeek);
        };
    }, [currentWeek]);

    useEffect(() => {
        if (matchup.length === 0) {
            setMatchup(sortedMatchups[currentWeek - 1] ? sortedMatchups[currentWeek - 1][0] : [])
        }
    }, [matchup]);

    return (
        <SeasonProvider season={legacyLeague[0].season || ""}>
            <MatchupsLayout selectWeek={selectWeek} setSelectWeek={setSelectWeek}>
                <div className="flex py-5">
                    <div style={{borderRight:"3px solid #0f0f0f", paddingRight:"24px", marginRight:"24px"}}>
                        <LeagueMatchupSlider selectWeek={selectWeek} setMatchup={setMatchup}/>
                    </div>
                    <MatchupWidget matchup={matchup}/>
                </div>
            </MatchupsLayout>
            <div className="flex justify-center py-5 mt-5">
                <AllTimeScoreWidget/>
            </div>
        </SeasonProvider>
    );
};