import styles from "../Matchup.module.css";
import React from "react";
import * as Interfaces from "@/interfaces";
import { Icon } from "@iconify-icon/react";
import { findLeagueBySeason, findMatchupDateByPoints, findRosterByRosterID, getLegacyMatchup, roundToHundredth } from "@/utils";
import { useLeagueContext } from "@/context";
import { useSearchParams } from "next/navigation";

export default function LegacyMatchup({ matchup }: Interfaces.MatchupWidgetProps) {
    const { legacyLeague } = useLeagueContext();
    const searchParams = useSearchParams();
    const season: string = searchParams.get("season")!;
    const league: Interfaces.League = findLeagueBySeason(season, legacyLeague);
    const rosters = league?.rosters;
    const team1 = matchup && matchup[0];
    const team2 = matchup && matchup[1];
    const roster1 = findRosterByRosterID(team1?.roster_id, rosters!);
    const roster2 = findRosterByRosterID(team2?.roster_id, rosters!);
    const legacyMatchup = getLegacyMatchup(legacyLeague);
    const filteredLegacyMatchup = legacyMatchup.filter((matchup: Interfaces.Match[]) => 
    (matchup[0].roster_id === team1.roster_id && matchup[1].roster_id === team2.roster_id) ||
    (matchup[0].roster_id === team2.roster_id && matchup[1].roster_id === team1.roster_id)
    ).map(a => 
        a.sort((a: any, b: any) => a.points - b.points)
    );
    return (
        <div className={styles.legacyContainer}>
            <div className="flex items-center justify-between border-b-2 border-[#0f0f0f] pb-3">
                <p className="font-bold">Legacy Matchup</p>
                <Icon icon="uiw:more" className={styles.transactionModalBtn}/>
            </div>
            <div className="text-xs text-gray-400 flex items-center pt-4">
                <p className="w-1/12">RANK</p>
                <p className="w-2/12">DATE</p>
                <p className="w-2/12">TOTAL POINTS</p>
                <p className="w-3/12">LOSING TEAM</p>
                <p className="w-3/12">WINNING TEAM</p>
            </div>
            <div>
                {filteredLegacyMatchup.map((matchup, i) => {
                    const score1:number = matchup[0].points;
                    const score2:number = matchup[1].points;
                    const totalScore: number = roundToHundredth(score1 + score2);
                    const foundMatchupDate = findMatchupDateByPoints(legacyLeague, score1, score2);
                    const weekNum: number = foundMatchupDate.week;
                    const seasonLabel: string = foundMatchupDate.season;
                    return(
                    <div key={i} className="flex items-center py-4 text-sm">
                        <p className="w-1/12 text-gray-200 font-bold">{i+1}</p>
                        <p className="w-2/12">Week {weekNum}, {seasonLabel}</p>
                        <p className="w-2/12">{totalScore}</p>
                        <p className="w-3/12">{score1}</p>    
                        <p className="w-3/12">{score2}</p>
                    </div>)
                })}
                <div className="">
                    
                </div>
            </div>
        </div>
    );
};
