import * as Interfaces from "@/interfaces";
import * as Constants from "@/constants";
import { findLeagueByID, findSeasonStats, getAllPlayStats, getAllTimeRosterStats, getRosterPostSeasonStats, lineupEfficiency, roundToHundredth, totalPointsPerGame, winPCT } from ".";

export const handleSort = (
    sort: string, 
    sortKey: string, 
    asc: boolean, 
    setAsc: React.Dispatch<React.SetStateAction<boolean>>,
    setSort: React.Dispatch<React.SetStateAction<string>>, 
    ) => {
    if (sort === sortKey) {
      setAsc(!asc);
    } else {
      setSort(sortKey);
      setAsc(true);
    };
};

export const getSortedRecords = (
    records: Interfaces.Transaction[], 
    sort: string, asc: boolean, 
    currentPage: number, 
    recordsPerPage: number
) => {
    const lastIdx = currentPage * recordsPerPage;
    const firstIdx = lastIdx - recordsPerPage;

    return records?.slice().sort((a, b) => {
        switch (sort) {
            case "DATE":
                return (asc ? a.created - b.created : b.created - a.created);
            case "BID":
                return (asc ? a.settings.waiver_bid - b.settings.waiver_bid : b.settings.waiver_bid - a.settings.waiver_bid);
            case "AGE":
                const ageA = a.waiver_player.age;
                const ageB = b.waiver_player.age;
                return asc ? ageA - ageB : ageB - ageA;
            case "PLAYER":
                const nameA = a.waiver_player.full_name;
                const nameB = b.waiver_player.full_name;
                return asc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            default:
                return 0;
        }
    }).slice(firstIdx, lastIdx);
};

export const sortDynastyRosters = (rosters: Interfaces.Roster[], asc: boolean, sort: string, fantasyMarket: string): Interfaces.Roster[] => {
    if (rosters) {
        const sortedRosters = rosters.slice().sort((a, b) => {
            const aValue = a[fantasyMarket as keyof typeof a];
            const bValue = b[fantasyMarket as keyof typeof b];

            if (typeof aValue === 'object' && typeof bValue === 'object' && aValue !== null && bValue !== null) {
                const aSortValue = aValue[sort.toLowerCase() as keyof typeof aValue];
                const bSortValue = bValue[sort.toLowerCase() as keyof typeof bValue];
        
                if (typeof aSortValue === 'number' && typeof bSortValue === 'number') {
                    return asc ? aSortValue - bSortValue : bSortValue - aSortValue;
                };
            };
            
            return 0; 
        });

        return sortedRosters;
    };
    return [Constants.initRoster]
};

export const sortDynastyRostersByPosition = (rosters: Interfaces.Roster[], fantasyMarket: string, position: string) => {
    const sortedRosters = sortDynastyRosters(rosters, false, position, fantasyMarket).map((roster, idx) => {
        return {
            ...roster,
            settings: {
                ...roster.settings,
                rank: idx + 1
            }
        };
    });

    return sortedRosters;
};

export const sortAllTimeRostersByType = (legacyLeague: Interfaces.League[], type: string): Interfaces.Roster[] => {
    const currentLeague = legacyLeague[0];
    const updatedRosters: Interfaces.Roster[] = currentLeague.rosters.map((roster) => {
        const rID = roster.roster_id;
        const allPlayAllTimeStats = getAllPlayStats(rID, "All Time", legacyLeague);

        const foundOwner = currentLeague.users.find((user) => user.user_id === roster.owner_id);
        const allTimeStats = getAllTimeRosterStats(rID, legacyLeague);
        return {
            ...roster,
            owner: foundOwner as Interfaces.Owner,
            settings: {
                ...roster.settings,
                all_time: {
                    season: {
                        fpts: allTimeStats.fpts,
                        fpts_against: allTimeStats.pa,
                        ppts: allTimeStats.ppts,
                        wins: allTimeStats.wins,
                        losses: allTimeStats.losses,
                        win_rate: allTimeStats.winRate,
                        ties: allTimeStats.ties,
                    },
                    total: {
                        fpts: allTimeStats.fpts + allTimeStats.playoffs.fpts,
                        fpts_against: allTimeStats.pa + allTimeStats.playoffs.pa,
                        ppts: allTimeStats.ppts + allTimeStats.playoffs.ppts,
                        wins: allTimeStats.wins + allTimeStats.playoffs.wins,
                        losses: allTimeStats.losses + allTimeStats.playoffs.losses,
                        win_rate: winPCT(allTimeStats.wins + allTimeStats.playoffs.wins, allTimeStats.losses + allTimeStats.playoffs.losses),
                        ties: allTimeStats.ties,
                    },
                    playoffs: {
                        fpts: allTimeStats.playoffs.fpts,
                        fpts_against: allTimeStats.playoffs.pa,
                        ppts: allTimeStats.playoffs.ppts,
                        wins: allTimeStats.playoffs.wins,
                        losses: allTimeStats.playoffs.losses,
                        win_rate: winPCT(allTimeStats.playoffs.wins, allTimeStats.playoffs.losses),
                        score: allTimeStats.playoffs.highestScore,
                    },
                },
                all_play_win_rate: winPCT(allPlayAllTimeStats.wins, allPlayAllTimeStats.losses),
                best: {
                    wins: {
                        score: allTimeStats.best.wins?.score ?? 0,
                        season: allTimeStats.best.wins.season,
                    },
                    losses: {
                        score: allTimeStats.best.losses ?? 0,
                        season: allTimeStats.best.wins.season, 
                    },
                    score: allTimeStats.best.score ?? 0,
                    fpts: {
                        score: allTimeStats.best.fpts?.score ?? 0,
                        season: allTimeStats.best.fpts.season,
                    },
                    ppts: {
                        score: allTimeStats.best.ppts?.score ?? 0,
                        season: allTimeStats.best.ppts.season,
                    },
                    pa: {
                        score: allTimeStats.best.pa?.score ?? 0,
                        season: allTimeStats.best.pa.season
                    },
                },
            },
        };
    });
      

    switch (type) {
        case "All Time Lineup Efficiency":
            const sortedRosters: Interfaces.Roster[] = (updatedRosters ?? [])
                .slice()
                .sort((a, b) => {
                
                    const fptsA = a.settings.all_time?.season?.fpts ?? 0;
                    const fptsB = b.settings.all_time?.season?.fpts ?? 0;
                    const pptsA = a.settings.all_time?.season?.ppts ?? 0;
                    const pptsB = b.settings.all_time?.season?.ppts ?? 0;
                    return lineupEfficiency(fptsB, pptsB) - lineupEfficiency(fptsA, pptsA);
               
                }).map((roster, idx): Interfaces.Roster => ({
                ...roster,
                settings: {
                    ...roster.settings,
                    rank: idx + 1,
                },
                }));
            return sortedRosters;

        case "All Time":
            const allTimeRosters: Interfaces.Roster[] = (updatedRosters ?? [])
                .slice()
                .sort((a, b) => {
                const winsA = a.settings.all_time?.season?.wins ?? 0;
                const winsB = b.settings.all_time?.season?.wins ?? 0;
                const fptsA = a.settings.all_time?.season?.fpts ?? 0;
                const fptsB = b.settings.all_time?.season?.fpts ?? 0;

                if (winsA === winsB) {
                    return fptsB - fptsA;
                } else {
                    return winsB - winsA;
                }}).map((roster, idx): Interfaces.Roster => ({
                ...roster,
                settings: {
                    ...roster.settings,
                    rank: idx + 1,
                },
                }));
            return allTimeRosters;

            
        case "All Time w/ Playoffs":
            return (updatedRosters ?? []).slice().sort((a, b) => {
                const winsA = ((a.settings.all_time?.season?.wins ?? 0) +
                    (a.settings.all_time?.playoffs?.wins ?? 0)) as number;
                const winsB = ((b.settings.all_time?.season?.wins ?? 0) +
                    (b.settings.all_time?.playoffs?.wins ?? 0)) as number;
                const fptsA = ((a.settings.all_time?.season?.fpts ?? 0) +
                    (a.settings.all_time?.playoffs?.fpts ?? 0)) as number;
                const fptsB = ((b.settings.all_time?.season?.fpts ?? 0) +
                    (b.settings.all_time?.playoffs?.fpts ?? 0)) as number;
            
                if (winsA === winsB) {
                    return fptsB - fptsA;
                } else {
                    return winsB - winsA;
                }
            }).map((roster, idx) => ({
                ...roster,
                settings: {
                    ...roster.settings,
                    rank: idx + 1,
                },
            }));  
      
        case "Best":
            return (updatedRosters ?? []).slice().sort((a, b) => {
                const winsA = (a.settings?.best?.wins?.score ?? 0) as number;
                const winsB = (b.settings.best?.wins?.score ?? 0) as number;
                const fptsA = (a.settings.best?.fpts?.score ?? 0) as number;
                const fptsB = (b.settings.best?.fpts?.score ?? 0) as number;
            
                if (winsA === winsB) {
                    return fptsB - fptsA;
                } else {
                    return winsB - winsA;
                };
                }).map((roster, idx) => ({
                    ...roster,
                    settings: {
                        ...roster.settings,
                        rank: idx + 1,
                    },
                }));

        case "Best Total Pts Per Game":
            return  (updatedRosters ?? []).slice().sort((a, b) => 
            totalPointsPerGame(b.roster_id, b.settings?.best?.fpts?.score!, legacyLeague, undefined, true)! - totalPointsPerGame(a.roster_id, a?.settings.best?.fpts?.score!, legacyLeague, undefined, true)!
            ).map((roster, idx) => ({
                ...roster,
                settings: {
                    ...roster.settings,
                    rank: idx + 1,
                },
            }));

        case "All Time Total Pts Per Game":
            return (updatedRosters ?? []).slice().sort((a, b) => 
            totalPointsPerGame(b.roster_id, b.settings.all_time.season.fpts, legacyLeague, undefined, true)! - totalPointsPerGame(a.roster_id, a.settings.all_time.season.fpts, legacyLeague, undefined, true)!
            ).map((roster, idx) => ({
                ...roster,
                settings: {
                    ...roster.settings,
                    rank: idx + 1,
                },
            }));

        case "Luck Rate":
            return (updatedRosters ?? []).slice().sort((a ,b) => 
                (b.settings.all_time.season.win_rate - b.settings.all_play_win_rate) - (a.settings.all_time.season.win_rate - a.settings.all_play_win_rate))
                .map((roster, idx) => ({
                    ...roster,
                    settings: {
                        ...roster.settings,
                        rank: idx + 1,
                    },
                }));

        case "All Time Total Playoff Pts Per Game":
            return (updatedRosters ?? []).slice().sort((a ,b) => 
            roundToHundredth(b.settings.all_time.playoffs.fpts / (b.settings.all_time.playoffs.wins + b.settings.all_time.playoffs.losses)) - roundToHundredth(a.settings.all_time.playoffs.fpts / (a.settings.all_time.playoffs.wins + a.settings.all_time.playoffs.losses))
            ).map((roster, idx) => ({
                ...roster,
                settings: {
                    ...roster.settings,
                    rank: idx + 1,
                },
            }));

        case "All Time Highest Score": 
            return (updatedRosters ?? []).slice().sort((a, b) => 
                b.settings.best?.score! - a.settings.best?.score!
            ).map((roster, idx) => ({
                ...roster,
                settings: {
                    ...roster.settings,
                    rank: idx + 1,
                },
            }));

        case "All Time Highest Playoff Score": 
            return (updatedRosters ?? []).slice().sort((a, b) => 
                b.settings.all_time.playoffs?.score! - a.settings.all_time.playoffs?.score!
            ).map((roster, idx) => ({
                ...roster,
                settings: {
                    ...roster.settings,
                    rank: idx + 1,
                },
            }));

        case "All Time PF":
            return (updatedRosters ?? []).slice().sort((a, b) => 
                b.settings.all_time.season.fpts - a.settings.all_time.season.fpts
            ).map((roster, idx) => ({
                ...roster,
                settings: {
                    ...roster.settings,
                    rank: idx + 1,
                },
            }));

        case "All Time Playoff PF":
            return (updatedRosters ?? []).slice().sort((a, b) => 
                b.settings.all_time.playoffs.fpts - a.settings.all_time.playoffs.fpts
            ).map((roster, idx) => ({
                ...roster,
                settings: {
                    ...roster.settings,
                    rank: idx + 1,
                },
            }));

        case "All Time MAX PF":
            return (updatedRosters ?? []).slice().sort((a, b) => 
                b.settings.all_time.season.ppts - a.settings.all_time.season.ppts
            ).map((roster, idx) => ({
                ...roster,
                settings: {
                    ...roster.settings,
                    rank: idx + 1,
                },
            }));

        case "All Time PA":
            return (updatedRosters ?? []).slice().sort((a, b) => 
                b.settings.all_time.season.fpts_against - a.settings.all_time.season.fpts_against
            ).map((roster, idx) => ({
                ...roster,
                settings: {
                    ...roster.settings,
                    rank: idx + 1,
                },
            }));
        
        case "All Time Playoff PA":
            return (updatedRosters ?? []).slice().sort((a, b) => 
                b.settings.all_time.playoffs.fpts_against - a.settings.all_time.playoffs.fpts_against
            ).map((roster, idx) => ({
                ...roster,
                settings: {
                    ...roster.settings,
                    rank: idx + 1,
                },
            }));
              
        default:
            return [];
    };
};

export const sortSeasonalRostersByType = (rosters: Interfaces.Roster[], type: string, legacyLeague?: Interfaces.League[]): Interfaces.Roster[] => {
    const foundLeague = findLeagueByID(rosters[0]?.league_id, legacyLeague!);
    
    switch(type) {
        case "Seasonal Lineup Efficiency":
            return rosters.sort((a, b) => 
                lineupEfficiency(Number(b.settings.fpts + "." + b.settings.fpts_decimal), Number(b.settings.ppts + "." + b.settings.ppts_decimal)) - 
                lineupEfficiency(Number(a.settings.fpts + "." + a.settings.fpts_decimal), Number(a.settings.ppts + "." + a.settings.ppts_decimal))
            ).map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
        
        case "Best Lineup Efficiency":
            return rosters.sort((a, b) => 
                lineupEfficiency(b.settings.best?.fpts?.score!, b.settings.best?.ppts?.score!) - lineupEfficiency(a.settings.best?.fpts?.score!, a.settings.best?.ppts?.score!)
            ).map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
        
        case "Seasonal Luck Rate":
            const sortedSeasonalLuckRateRosters = rosters.slice().map(roster => {
                const allPlaySeasonStats = getAllPlayStats(roster.roster_id, foundLeague.season, legacyLeague!);
                return {
                    ...roster,
                    settings: {
                        ...roster.settings,
                        all_play_wins: allPlaySeasonStats.wins,
                        all_play_losses: allPlaySeasonStats.losses,
                        all_play_win_rate: winPCT(allPlaySeasonStats.wins, allPlaySeasonStats.losses),
                    }
                };
            }).sort((a ,b) => roundToHundredth(winPCT(b.settings.wins, b.settings.losses)- b.settings.all_play_win_rate) - roundToHundredth(winPCT(a.settings.wins, a.settings.losses)- a.settings.all_play_win_rate))
            .map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
            
            return sortedSeasonalLuckRateRosters;

        case "Best Luck Rate":
            const sortedBestLuckRateRosters = rosters.slice().map(roster => {
                const allTimeRosterStats = getAllTimeRosterStats(roster.roster_id, legacyLeague!);
                const allPlayBestSeasonStats = getAllPlayStats(roster.roster_id, allTimeRosterStats.best.wins.season, legacyLeague!); 
                {roundToHundredth(allTimeRosterStats.best.winRate - winPCT(allPlayBestSeasonStats.wins, allPlayBestSeasonStats.losses))}
                return {
                    ...roster,
                    settings: {
                        ...roster.settings,
                        luckRate: roundToHundredth(allTimeRosterStats.best.winRate - winPCT(allPlayBestSeasonStats.wins, allPlayBestSeasonStats.losses)),
                    }
                };
            }).sort((a ,b) => b.settings.luckRate - a.settings.luckRate)
            .map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
            
            return sortedBestLuckRateRosters;
    
        case "Total Pts Per Game":
            const sortedTotalPtsPerGame = rosters.slice().map(roster => {
                const foundLeague = findLeagueByID(roster?.league_id, legacyLeague!);
                const seasonFPTS: number = Number(roster.settings.fpts + "." + roster.settings.fpts_decimal);
                return {
                    ...roster,
                    settings: {
                        ...roster.settings,
                        totalPtsPerGame: totalPointsPerGame(roster.roster_id, seasonFPTS, legacyLeague!, foundLeague.season) || 0, 
                    }
                };
            }).sort((a ,b) => b.settings.totalPtsPerGame - a.settings.totalPtsPerGame)
            .map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
            return sortedTotalPtsPerGame;

        case "Total Playoff Pts Per Game":
            const sortedTotalPlayoffPtsPerGame = rosters.slice().map(roster => {
                const postSeasonStats = getRosterPostSeasonStats(roster.roster_id, legacyLeague!, foundLeague.season);

                return {
                    ...roster,
                    settings: {
                        ...roster.settings,
                        totalPtsPerGame: totalPointsPerGame(roster.roster_id, postSeasonStats.fpts, legacyLeague!, foundLeague.season) || 0, 
                    }
                };
            }).sort((a ,b) => b.settings.totalPtsPerGame - a.settings.totalPtsPerGame)
            .map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
            return sortedTotalPlayoffPtsPerGame;

        case "Best PF":
            const sortedRostersByBestPF = rosters.sort((a ,b) => b?.settings?.best?.fpts?.score! - a.settings.best?.fpts?.score!)
            .map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
            return sortedRostersByBestPF;

        case "Seasonal Highest Score":
            const sortedRostersByHighestScore = rosters.slice().map(roster => {
                return {
                    ...roster, 
                    settings: {
                        ...roster.settings,
                        best: {
                            score: findSeasonStats(roster.roster_id, foundLeague.season, legacyLeague!)?.bestScore
                        }
                    }
                };
            }).sort((a, b) => {
                return b.settings.best.score! - a.settings.best.score!
            }).map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
            return sortedRostersByHighestScore;

        case "Post Season Highest Score":
            const sortedRostersByPostSeasonHighestScore = rosters.slice().map(roster => {
                const postSeasonStats = getRosterPostSeasonStats(roster.roster_id, legacyLeague!, foundLeague.season);
                    return {
                        ...roster,
                        settings: {
                            ...roster.settings,
                            highestPostSeasonScore: postSeasonStats.highestScore
                        }
                    }
            }).sort((a, b) => {
                return b.settings.highestPostSeasonScore - a.settings.highestPostSeasonScore
            }).map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
            return sortedRostersByPostSeasonHighestScore;

        case "Seasonal PF":
            return rosters.slice().sort((a, b) => {
                return Number(b.settings.fpts + "." + b.settings.fpts_decimal) - Number(a.settings.fpts + "." + a.settings.fpts_decimal)
            }).map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));

        case "Playoff PF":
            return rosters.slice().map(roster => {
                const postSeasonStats = getRosterPostSeasonStats(roster.roster_id, legacyLeague!, foundLeague.season);

                return {
                    ...roster,
                    settings: {
                        ...roster.settings,
                        playoff_fpts: postSeasonStats.fpts
                    }
                }
            }).sort((a, b) => b.settings.playoff_fpts - a.settings.playoff_fpts
            ).map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));

        case "Seasonal MAX PF":
            return rosters.slice().sort((a, b) => {
                return Number(b.settings.ppts + "." + b.settings.ppts_decimal) - Number(a.settings.ppts + "." + a.settings.ppts_decimal)
            }).map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));

        case "Best PF":
            const sortedRostersByBestMAXPF = rosters.sort((a ,b) => b?.settings?.best?.ppts?.score! - a.settings.best?.ppts?.score!)
            .map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
            return sortedRostersByBestMAXPF;

        case "Seasonal PA":
            return rosters.slice().sort((a, b) => {
                return Number(b.settings.fpts_against + "." + b.settings.fpts_against_decimal) - Number(a.settings.fpts_against + "." + a.settings.fpts_against_decimal)
            }).map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));

        case "Playoff PA":
            return rosters.slice().map(roster => {
                const postSeasonStats = getRosterPostSeasonStats(roster.roster_id, legacyLeague!, foundLeague.season);

                return {
                    ...roster,
                    settings: {
                        ...roster.settings,
                        playoff_pa: postSeasonStats.pa
                    }
                }
            }).sort((a, b) => b.settings.playoff_pa - a.settings.playoff_pa
            ).map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
        
        case "Best PF":
            const sortedRostersByBestPA = rosters.sort((a ,b) => b?.settings?.best?.pa?.score! - a.settings.best?.pa?.score!)
            .map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
            return sortedRostersByBestPA;

        default: 
            return rosters;
    };
};

export const sortRostersByFantasyMarketPosition = (rosters: Interfaces.Roster[], fantasyMarket: string, position: string): Interfaces.Roster[] => {
    const sortedRosters = rosters?.sort((a: Interfaces.Roster, b: Interfaces.Roster) => {
        const aValue: number = Number((a[fantasyMarket as keyof typeof a] as Interfaces.DynastyValue)[position as keyof Interfaces.DynastyValue]);
        const bValue: number = Number((b[fantasyMarket as keyof typeof b] as Interfaces.DynastyValue)[position as keyof Interfaces.DynastyValue]);
        return bValue - aValue;
    }).slice().map((roster, i) => {
        const updatedRoster = {
            ...roster,
            [fantasyMarket as keyof typeof roster]: {
                ...(roster[fantasyMarket as keyof typeof roster] as any), // Use type assertion here
                rank: i + 1,
            },
        };
        return updatedRoster;
    });
    return sortedRosters;
};