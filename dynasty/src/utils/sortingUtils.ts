import * as Interfaces from "@/interfaces";
import { getAllTimeRosterStats } from ".";

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

export const sortAllTimeRosters = (legacyLeague: Interfaces.League[]) => {
    const currentLeague = legacyLeague[0];
    return currentLeague.rosters.map((roster) => {
        const foundOwner = currentLeague.users.find(user => user.user_id === roster.owner_id);
        const allTimeStats = getAllTimeRosterStats(roster.roster_id, legacyLeague);
        
        return {
            ...roster,
            owner: foundOwner as Interfaces.Owner,
            settings: {
                ...roster.settings,
                all_time_fpts: allTimeStats.fpts,
                all_time_fpts_against: allTimeStats.pa,
                all_time_ppts: allTimeStats.ppts,
                all_time_wins: allTimeStats.wins,
                all_time_losses: allTimeStats.losses,
                all_time_win_rate: allTimeStats.winRate,
                all_time_ties: allTimeStats.ties,
            }
        };
    }).sort((a, b) => {
        if (a.settings.all_time_wins === b.settings.all_time_wins) {
            return b.settings.all_time_fpts - a.settings.all_time_fpts;
        } else {
            return b.settings.all_time_wins - a.settings.all_time_wins
        };
    }).map((roster, idx) => ({...roster, settings: {...roster.settings, rank: idx + 1 } }));
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

export const sortAllTimeRostersWithPlayoffs = (legacyLeague: Interfaces.League[]) => {

};