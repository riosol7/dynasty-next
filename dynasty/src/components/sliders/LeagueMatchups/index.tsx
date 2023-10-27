import styles from "./LeagueMatchups.module.css";
import { Icon } from "@iconify-icon/react";
import { useLeagueContext, usePlayerContext, useSeasonContext } from "@/context";
import { calculatePercentage, findLeagueBySeason, findLogo, findPlayerByPts, findRecord, findRosterByRosterID, getMatchups, roundToHundredth } from "@/utils";
import * as Interfaces from "@/interfaces";
import { PLAYER_BASE_URL, POSITION_COLORS, SLEEPER_AVATAR_BASE_URL } from "@/constants";

export default function LeagueMatchupSlider({ selectWeek }: {selectWeek: number}) {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason } = useSeasonContext();
    const { players } = usePlayerContext();
    const league: Interfaces.League = findLeagueBySeason(selectSeason, legacyLeague);
    const matchups = getMatchups(league.matchups);
    // Sort the selectedMatchups by the highest scoring games.
    const numWeeks = matchups.length;
    const weeks: string[] = Array.from({ length: numWeeks }, (_, index) => `Week ${index + 1}`);
    const selectedMatchups = matchups[selectWeek - 1]?.sort((a: any, b: any) => {
        const aTeam1 = a && a[0];
        const aTeam2 = a && a[1];

        const aTeam1Score = aTeam1?.points;
        const aTeam2Score = aTeam2?.points;
        const aTotalPtsScored = roundToHundredth(aTeam1Score + aTeam2Score);

        const bTeam1 = b && b[0];
        const bTeam2 = b && b[1];

        const bTeam1Score = bTeam1?.points;
        const bTeam2Score = bTeam2?.points;
        const bTotalPtsScored = roundToHundredth(bTeam1Score + bTeam2Score);
        return bTotalPtsScored - aTotalPtsScored;
    });

    return (
        <div className={`${styles.matchupSlide}`}>
            {selectedMatchups?.map((matchup: Interfaces.Match[], i: number) => {
                const team1 = matchup && matchup[0];
                const team2 = matchup && matchup[1];

                const team1Score = team1?.points;
                const team2Score = team2?.points;
                const totalPtsScored = roundToHundredth(team1Score + team2Score);
                
                const roster1 = findRosterByRosterID(team1.roster_id, league.rosters);
                const roster2 = findRosterByRosterID(team2.roster_id, league.rosters);

                const roster1Matchups = getMatchups(league.matchups, roster1.roster_id);
                const roster2Matchups = getMatchups(league.matchups, roster2.roster_id);

                const sorted1StarterPts = team1?.starters_points?.sort((a,b) => b - a);
                const sorted2StarterPts = team2?.starters_points?.sort((a,b) => b - a);

                const team1TopStarterPts = sorted1StarterPts && sorted1StarterPts[0];
                const team2TopStarterPts = sorted2StarterPts && sorted2StarterPts[1];
                const topPlayer1Percentage = calculatePercentage(team1TopStarterPts, totalPtsScored);
                const topPlayer2Percentage = calculatePercentage(team2TopStarterPts, totalPtsScored);
                const team1Percentage = calculatePercentage(team1Score, totalPtsScored);
                const team2Percentage = calculatePercentage(team2Score, totalPtsScored);

                const topStarter1Details = findPlayerByPts(team1, team1TopStarterPts, players);
                const topStarter2Details = findPlayerByPts(team2, team2TopStarterPts, players);

                return (
                <div key={i} className={`my-4`}>
                    <div className="pb-1">
                        <p className="text-xs flex items-center justify-center">
                            <Icon icon="ep:arrow-up-bold" className="pr-1"/>
                            Match History (4 Games Played)
                        </p>
                    </div>
                    <div className={`${styles.matchupCard}`}>
                        <div className={`${styles.teamCard} w-full`} style={{flexDirection: "row", textAlign: "start" }}>
                            <div className={styles.playerBackground} style={(players.length > 0) ? {background:findLogo(topStarter1Details.team || "FA").bgColor}:{}}>
                                <div className={styles.teamLogo} style={{ backgroundImage:`url(${findLogo(topStarter1Details.team).l})`, backgroundPosition: topStarter1Details.position === "DEF" ? "center" : "top"}}>
                                    <div className={styles.player} style={{ backgroundImage: `url(${PLAYER_BASE_URL}${topStarter1Details.player_id}.jpg)` }}></div>
                                </div>
                            </div>
                            <div className={`${styles.teamInfo} w-full`}>
                                <div className={`flex items-center justify-start`}>
                                    <div className={"ml-1 w-full flex items-center"}>
                                        <div className={styles.teamAvatar} style={{ backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${roster1?.owner?.avatar})`}}></div>
                                        <div className="ml-1">
                                            <p className="font-bold">{roster1.owner.display_name}</p>
                                            <p className="text-xs">{findRecord(team1.roster_id, roster1Matchups, selectWeek - 1).record}</p> 
                                        </div>
                                    </div>
                                </div>
                                <div className={`ml-1`}>
                                    <div className="flex items-center pt-1 pb-1" style={{flexDirection: "row", textAlign: "start" }}>
                                        <Icon icon="octicon:dot-fill-16" style={{ color: "#7B68EE", fontSize: "12px" }}/>
                                        <p>{team1.points} pts</p>
                                    </div>
                                    <div className="font-bold">
                                        <div className="pt-1 flex items-center font-bold" style={{ flexDirection: "row", textAlign: "start" }}>
                                            <p>{topStarter1Details.first_name}</p> 
                                            <Icon icon="fluent:star-line-horizontal-3-24-regular" style={{ color: "#a9dfd8", fontSize: "1.1rem", transform: "scaleX(-1)" }}/>
                                        </div> 
                                        <p>{topStarter1Details.last_name}</p>
                                    </div>
                                    <div className="flex items-center text-xs" style={{flexDirection: "row", textAlign: "start" }}>
                                        <p style={{color: POSITION_COLORS[topStarter1Details.position as keyof typeof POSITION_COLORS]}}>{topStarter1Details.position}</p>
                                        <p className={`ml-1`}>{team1TopStarterPts} pts</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className={styles.vs}>VS</p>
                        </div>
                        <div className={`${styles.teamCard} w-full`} style={{flexDirection: "row-reverse", textAlign: "end" }}>
                            <div className={styles.playerBackground} style={(players.length > 0) ? {background:findLogo(topStarter2Details.team || "FA").bgColor}:{}}>
                                <div className={styles.teamLogo} style={{ backgroundImage:`url(${findLogo(topStarter2Details.team).l})`, backgroundPosition: topStarter2Details.position === "DEF" ? "center" : "top"}}>
                                    <div className={styles.player} style={{ backgroundImage: `url(${PLAYER_BASE_URL}${topStarter2Details.player_id}.jpg)` }}></div>
                                </div>
                            </div>
                            <div className={`${styles.teamInfo} w-full`}>
                                <div className={`flex items-center justify-end`}>
                                    <div className={"mr-1 w-full flex items-center"} style={{flexDirection: "row-reverse", textAlign: "end" }}>
                                        <div className={styles.teamAvatar} style={{ backgroundImage: `url(${SLEEPER_AVATAR_BASE_URL}${roster2?.owner?.avatar})`}}></div>
                                        <div className="mr-1">
                                            <p className="font-bold">{roster2.owner.display_name}</p>
                                            <p className="text-xs">{findRecord(team2.roster_id, roster2Matchups, selectWeek - 1).record}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`mr-1`}>
                                    <div className="flex items-center pt-1 pb-1" style={{flexDirection: "row-reverse", textAlign: "end" }}>
                                        <Icon icon="octicon:dot-fill-16" style={{ color: "#CD5C5C", fontSize: "12px" }}/>
                                        <p>{team2.points} pts</p>
                                    </div>
                                    <div className="font-bold">
                                        <div className="pt-1 flex items-center font-bold" style={{flexDirection: "row-reverse", textAlign: "end" }}>
                                            <p>{topStarter2Details.first_name}</p> 
                                            <Icon icon="fluent:star-line-horizontal-3-24-regular" style={{ color: "#a9dfd8", fontSize: "1.1rem" }} />
                                        </div> 
                                        <p>{topStarter2Details.last_name}</p>
                                    </div>
                                    <div className="flex items-center text-xs" style={{flexDirection: "row-reverse", textAlign: "end" }}>
                                        <p style={{color: POSITION_COLORS[topStarter2Details.position as keyof typeof POSITION_COLORS]}}>{topStarter2Details.position}</p>
                                        <p className={`mr-1`}>{team2TopStarterPts} pts</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between bg-gray-700 rounded-full h-1.5 my-1">
                            <div className={`h-1.5 rounded-full`} style={{ width: `${topPlayer1Percentage}%`, backgroundColor: topStarter1Details?.team ? `${findLogo(topStarter1Details?.team).bgColor2}` : `rgba(165,172,175,1)` }}></div>
                            <div className={`h-1.5 rounded-full`} style={{ width: `${topPlayer2Percentage}%`, backgroundColor: topStarter2Details?.team ? `${findLogo(topStarter2Details?.team).bgColor2}` : `rgba(165,172,175,1)` }}></div>
                        </div>
                        <div className="flex justify-between text-xs">
                            {/* <p className="">Total Points Scored</p> */}
                            <p className="">Total Points Scored</p>
                            <p className="">{totalPtsScored} / 0 pts</p>
                        </div>
                    </div>
                </div>);
           } )}
        </div>
    );
};
