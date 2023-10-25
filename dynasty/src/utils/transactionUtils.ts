import * as Interfaces from "@/interfaces";

export const findLowestBid = (waivers: Interfaces.Transaction[]) => {
    return waivers?.slice().sort((a, b) => a.settings.waiver_bid - b.settings.waiver_bid)[0]?.settings?.waiver_bid;
};

export const findHighestBid = (waivers: Interfaces.Transaction[]) => {
    return waivers?.slice().sort((a, b) => b.settings.waiver_bid - a.settings.waiver_bid)[0]?.settings?.waiver_bid;
};

export const findRecentWaivers = (waivers: Interfaces.Transaction[]) => {
    return waivers?.slice().sort((a, b) => b.created - a.created);
};

export const findTopSpender = (waiverData: Interfaces.Transaction[]) => {
    if (waiverData) {
        const reducedData = waiverData.slice().reduce((acc, team) => {
            acc[team.creator] = acc[team.creator] || [];
            acc[team.creator].push(team);
            return acc;
        }, Object.create(null));

        const entries = Object.entries(reducedData);

        if (entries.length > 0) {
            const result = entries.map((o: any) => {
                return {
                    owner: o[0],
                    pts: o[1].reduce((a: any, b: any) => a + b.settings.waiver_bid, 0),
                };
            }).sort((a, b) => b.pts - a.pts)[0];

            return result;
        } else {
            // Handle case where entries are empty
            return null; // or some other appropriate value
        }
    } else {
        // Handle case where waiverData is null or undefined
        return null; // or some other appropriate value
    };
};