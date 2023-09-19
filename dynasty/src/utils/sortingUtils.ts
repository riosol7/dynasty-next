import * as Interfaces from "../interfaces";

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

        return sortedRosters.map((roster, i) => { return ({...roster, rank: i + 1})});
    };
};