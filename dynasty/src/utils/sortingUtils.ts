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