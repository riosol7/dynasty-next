import * as Interfaces from "@/interfaces";
import { Waivers } from "@/types";

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
    return Object.entries(
        waiverData.slice().reduce((acc, team) => {
            acc[team.creator] = acc[team.creator] || [];
            acc[team.creator].push(team);
            return acc;
        }, Object.create(null))
    ).map((o: any) => {
        return {
            owner: o[0],
            pts: o[1].reduce((a: number, b: any) => a + b.settings.waiver_bid, 0),
        };
    }).sort((a, b) => b.pts - a.pts)[0];
};