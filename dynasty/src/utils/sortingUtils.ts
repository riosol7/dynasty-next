import * as Interfaces from "@/interfaces";
import { getAllTimeRosterStats, lineupEfficiency, winPCT } from ".";

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

    return records.slice().sort((a, b) => {
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

export const sortDynastyRosters = (rosters: Interfaces.Roster[], asc: boolean, sort: string, fantasyMarket: string) => {
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
};

export const sortAllTimeRostersByType = (legacyLeague: Interfaces.League[], type: string) => {
    const currentLeague = legacyLeague[0];
    const updatedRosters = currentLeague.rosters.map((roster) => {
        const foundOwner = currentLeague.users.find(user => user.user_id === roster.owner_id);
        const allTimeStats = getAllTimeRosterStats(roster.roster_id, legacyLeague);
        return {
            ...roster,
            owner: foundOwner as Interfaces.Owner,
            settings: {
                ...roster.settings,
                all_time : {
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
                        win_rate: winPCT((allTimeStats.wins + allTimeStats.playoffs.wins), (allTimeStats.losses + allTimeStats.playoffs.losses)),
                        ties: allTimeStats.ties,
                    },
                    playoffs: {
                        fpts: allTimeStats.playoffs.fpts,
                        fpts_against: allTimeStats.playoffs.pa,
                        ppts: allTimeStats.playoffs.ppts,
                        wins: allTimeStats.playoffs.wins,
                        losses: allTimeStats.playoffs.losses,
                        win_rate: winPCT(allTimeStats.wins, allTimeStats.losses),
                    },
                    best: {
                        wins: allTimeStats.best.wins.score,
                        losses: allTimeStats.losses,
                        score: allTimeStats.best.score,
                        fpts: allTimeStats.best.fpts.score,
                        ppts: allTimeStats.best.ppts.score,
                        pa: allTimeStats.best.pa.score,
                    }
                },
            }
        };
    });

    switch(type) {
        case "All Time":
            return updatedRosters?.slice().sort((a: Interfaces.Roster, b: Interfaces.Roster) => {
                if (a.settings.all_time?.season.wins === b.settings.all_time.season.wins) {
                    return b.settings.all_time.season.fpts - a.settings.all_time.season.fpts;
                } else {
                    return b.settings.all_time.season.wins - a.settings.all_time.season.wins
                };
            }).map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
        case "All Time w/ Playoffs":
            return updatedRosters?.slice().sort((a: Interfaces.Roster, b: Interfaces.Roster) => {
                if ((a.settings.all_time?.season.wins + a.settings.all_time?.playoffs.wins) === (b.settings.all_time?.season.wins + b.settings.all_time?.playoffs.wins)) {
                    return (b.settings.all_time?.season.fpts + b.settings.all_time.playoffs.fpts) - (a.settings.all_time?.season.fpts + a.settings.all_time.playoffs.fpts);
                } else {
                    return (b.settings.all_time?.season.wins + b.settings.all_time.playoffs.wins) - (a.settings.all_time?.season.wins + a.settings.all_time.playoffs.wins)
                };
            }).map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
        case "Best":
            return updatedRosters?.slice().sort((a: Interfaces.Roster, b: Interfaces.Roster) => {
                if (a.settings.best?.wins === b.settings.best?.wins) {
                    return b.settings.best?.fpts - a.settings.best?.fpts;
                } else {
                    return b.settings.best?.wins - a.settings.best?.wins
                };
            }).map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
    };
};

export const sortSeasonalRostersByType = (rosters: Interfaces.Roster[], type: string) => {
    
    switch(type) {
        case "Lineup Efficiency":
            return rosters.sort((a, b) => 
                lineupEfficiency(Number(b.settings.fpts + "." + b.settings.fpts_decimal), Number(b.settings.ppts + "." + b.settings.ppts_decimal)) - 
                lineupEfficiency(Number(a.settings.fpts + "." + a.settings.fpts_decimal), Number(a.settings.ppts + "." + a.settings.ppts_decimal))
            ).map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
    }

};