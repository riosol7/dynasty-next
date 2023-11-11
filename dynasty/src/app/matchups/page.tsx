"use client";
import LeagueMatchupSlider from "@/components/sliders/LeagueMatchups"
import MatchupWidget from "@/components/widgets/Matchup";
import { SeasonProvider, useLeagueContext } from "@/context";
import MatchupsLayout from "@/layouts/Matchups";
import { useState, useEffect } from "react";
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
                <PerformerList/>
                <div className="flex flex-wrap justify-center  py-5">
                    <LeagueMatchupSlider selectWeek={selectWeek} setMatchup={setMatchup}/>
                    <div className="pl-5">
                        <MatchupWidget matchup={matchup}/>
                    </div>
                    <div className="p-5">
                        <AllTimeScoreWidget/>
                    </div>

                </div>
            </MatchupsLayout>
            {/* <div className="flex justify-center py-5 mt-5">
                <AllTimeScoreWidget/>
            </div> */}
        </SeasonProvider>
    );
};