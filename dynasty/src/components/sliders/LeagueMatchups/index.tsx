import styles from "./LeagueMatchups.module.css";
import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { useLeagueContext, usePlayerContext, useSeasonContext } from "@/context";
import { calculatePercentage, findLeagueBySeason, findLogo, findPlayerByPts, findRecord, findRosterByRosterID, getMatchups, placementRankings, roundToHundredth, sortMatchupsByHighestScore } from "@/utils";
import * as Interfaces from "@/interfaces";
import { PLAYER_BASE_URL, POSITION_COLORS, SLEEPER_AVATAR_BASE_URL } from "@/constants";

export default function LeagueMatchupSlider({ selectWeek, setMatchup }: Interfaces.LeagueMatchupSliderProps) {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason } = useSeasonContext();
    const { players } = usePlayerContext();
    const league: Interfaces.League = findLeagueBySeason(selectSeason, legacyLeague);
    const matchups = getMatchups(league.matchups);
    const [ currentPage, setCurrentPage ] = useState<number>(0);
    const numWeeks = matchups.length;
    const weeks: string[] = Array.from({ length: numWeeks }, (_, index) => `Week ${index + 1}`);
    const selectedMatchups = sortMatchupsByHighestScore(matchups[selectWeek - 1]);
    
    const handleNext = () => {
        setCurrentPage((prev) => (prev + 1) % Math.ceil(selectedMatchups.length / 4));
    };
    
    const handlePrev = () => {
        setCurrentPage((prev) => (prev - 1 + Math.ceil(selectedMatchups.length / 4)) % Math.ceil(selectedMatchups.length / 4));
    };
    

    return (
        <div className="">
            {/* <div className="flex items-center">
                <Icon icon="ep:arrow-up-bold" className={styles.arrow} onClick={handlePrev} disabled={currentPage === 0}/>
                <Icon icon="ep:arrow-down-bold" className={styles.arrow} onClick={handleNext} disabled={currentPage >= selectedMatchups?.length / 4 - 1}/>
            </div> */}
            <div className={`flex items-center`}>
                {/* {Array.isArray(selectedMatchups) && selectedMatchups.slice(currentPage * 2, currentPage * 2 + 4).map((matchup: Interfaces.Match[], i: number) => { */}
                {Array.isArray(selectedMatchups) && selectedMatchups.slice().map((matchup: Interfaces.Match[], i: number) => {
                const team1 = matchup && matchup[0];
                const team2 = matchup && matchup[1];
                const team1Score = team1?.points;
                const team2Score = team2?.points;
                const totalPtsScored = roundToHundredth(team1Score + team2Score);

                const totalQBPtsScored = 0;
                const totalRBPtsScored = 0;
                const totalWRPtsScored = 0;
                const totalTEPtsScored = 0;
                const totalKPtsScored = 0;
                const totalDEFPtsScored = 0;

                const roster1 = findRosterByRosterID(team1.roster_id, league.rosters);
                const roster2 = findRosterByRosterID(team2.roster_id, league.rosters);

                const roster1Matchups = getMatchups(league.matchups, roster1.roster_id);
                const roster2Matchups = getMatchups(league.matchups, roster2.roster_id);

                const sorted1StarterPts = team1?.starters_points?.slice().sort((a, b) => b - a);
                const sorted2StarterPts = team2?.starters_points?.slice().sort((a, b) => b - a);

                const team1TopStarterPts = sorted1StarterPts && sorted1StarterPts[0];
                const team2TopStarterPts = sorted2StarterPts && sorted2StarterPts[1];
                const topPlayer1Percentage = calculatePercentage(team1TopStarterPts, totalPtsScored);
                const topPlayer2Percentage = calculatePercentage(team2TopStarterPts, totalPtsScored);
                const team1Percentage = calculatePercentage(team1Score, totalPtsScored);
                const team2Percentage = calculatePercentage(team2Score, totalPtsScored);

                const topStarter1Details = findPlayerByPts(team1, team1TopStarterPts, players);
                const topStarter2Details = findPlayerByPts(team2, team2TopStarterPts, players);

                return (
                    <div key={i} className={`pb-5 pr-5`} onClick={() => setMatchup(matchup)}>
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
                                                <p className="text-xs">
                                                    <span className="text-[#34d367] mr-1">W</span>
                                                    {findRecord(team1.roster_id, roster1Matchups, selectWeek - 1).record}
                                                </p> 
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`ml-1`}>
                                        <div className="flex items-center pt-1 pb-1" style={{flexDirection: "row", textAlign: "start" }}>
                                            <Icon icon="octicon:dot-fill-16" style={{ color: "#818CF8", fontSize: "12px" }}/>
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
                            <div className="">
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
                                                <p className="text-xs">
                                                    {findRecord(team2.roster_id, roster2Matchups, selectWeek - 1).record}
                                                    <span className="ml-1 text-[#cc1d00]">L</span>
                                                </p>
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
                        <div className="text-xs">
                            <div className="flex justify-between bg-gray-700 rounded-full h-1.5 my-1">
                                <div className={`h-1.5 rounded-full`} style={{ width: `${topPlayer1Percentage}%`, backgroundColor: topStarter1Details?.team ? `${findLogo(topStarter1Details?.team).bgColor2}` : `rgba(165,172,175,1)` }}></div>
                                <div className={`h-1.5 rounded-full`} style={{ width: `${topPlayer2Percentage}%`, backgroundColor: topStarter2Details?.team ? `${findLogo(topStarter2Details?.team).bgColor2}` : `rgba(165,172,175,1)` }}></div>
                            </div>
                            <div className="py-2 border-b border-[#0f0f0f] flex items-center justify-between">
                                <p>- W</p>
                                <p>Match History: - Games Played <Icon icon="ep:arrow-up-bold" style={{ color: "#a9dfd8"}}/></p>
                                <p>- W</p>
                            </div>
                            <div className="flex justify-between border-b border-[#0f0f0f] py-2">
                                <p className="">{totalPtsScored} / 0 pts</p>
                                <p className="">Total Points Scored ({placementRankings(i + 1)})</p>
                                <p className="">{totalPtsScored} / 0 pts</p>
                            </div>
                            <div className="flex justify-between border-b border-[#0f0f0f] py-2">
                                <p className="">- pts (-%)</p>
                                <p style={{ color: POSITION_COLORS["QB"]}}>QB</p>
                                <p className="">- pts (-%)</p>
                            </div>
                            <div className="flex justify-between border-b border-[#0f0f0f] py-2">
                                <p className="">- pts (-%)</p>
                                <p style={{ color: POSITION_COLORS["RB"]}} className="">RB</p>
                                <p className="">- pts (-%)</p>
                            </div>
                            <div className="flex justify-between border-b border-[#0f0f0f] py-2">
                                <p className="">- pts (-%)</p>
                                <p style={{ color: POSITION_COLORS["WR"]}} className="">WR</p>
                                <p className="">- pts (-%)</p>
                            </div>
                            <div className="flex justify-between border-b border-[#0f0f0f] py-2">
                                <p className="">- pts (-%)</p>
                                <p style={{ color: POSITION_COLORS["TE"]}} className="">TE</p>
                                <p className="">- pts (-%)</p>
                            </div>
                            <div className="flex justify-between border-b border-[#0f0f0f] py-2">
                                <p className="">- pts (-%)</p>
                                <p style={{ color: POSITION_COLORS["K"]}} className="">K</p>
                                <p className="">- pts (-%)</p>
                            </div>
                            <div className="flex justify-between border-b border-[#0f0f0f] py-2">
                                <p className="">- pts (-%)</p>
                                <p style={{ color: POSITION_COLORS["DEF"]}} className="">DEF</p>
                                <p className="">- pts (-%)</p>
                            </div>
                        </div>
                    </div>);
                })}
            </div>
        </div>
    );
};
