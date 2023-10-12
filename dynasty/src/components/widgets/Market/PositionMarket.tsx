import styles from "./Market.module.css";
import * as Interfaces from "@/interfaces";
import { Waivers } from "@/types";
import { POSITIONS } from "@/constants";
import { calculatePercentageChange, roundToHundredth } from "@/utils";
import TrendChart from "@/components/charts/TrendChart";

const positionStyles = {
    QB: styles.qbHUD,
    RB: styles.rbHUD,
    WR: styles.wrHUD,
    TE: styles.teHUD,
};

export default function PositionMarket({ waiverBids }: Interfaces.WaiverBidProps ) {
    const waivers: Waivers = {
        QB: waiverBids?.qb || [],
        RB: waiverBids?.rb || [],
        WR: waiverBids?.wr || [],
        TE: waiverBids?.te || [],
    };

    function findLowestBid(position: keyof Waivers) {
        return waivers[position]?.slice().sort((a, b) => a.settings.waiver_bid - b.settings.waiver_bid)[0]?.settings?.waiver_bid;
    };

    function findHighestBid(position: keyof Waivers) {
        return waivers[position]?.slice().sort((a, b) => b.settings.waiver_bid - a.settings.waiver_bid)[0]?.settings?.waiver_bid;
    };

    function findRecentWaivers(position: keyof Waivers) {
        return waivers[position]?.slice().sort((a, b) => b.created - a.created);
    };

    function findTopSpender(waiverData: Interfaces.Transaction[]) {
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

    return (
        <div className="py-3">
            <div className="flex items-center font-bold pb-3 text-xs text-[#7d91a6] border-b border-solid border-[#2a2c3e]">
                <div className="w-1/12">POSITION</div>
                <div className="w-3/12">TREND</div>
                <div className="w-1/12">LAST PRICE</div>
                <div className="w-1/12">CHANGE %</div>
                <div className="w-1/12">AVG</div>
                <div className="w-1/12">LOW</div>
                <div className="w-1/12">HIGH</div>
                <div className="w-1/12">QTY</div>
                <div className="w-2/12">TOP SPENDER</div>
            </div>
            {POSITIONS.map((position, i) => {  
                const recentWaivers = findRecentWaivers(position as keyof Waivers);
                const highestBid = findHighestBid(position as keyof Waivers);
                const lowestBid = findLowestBid(position as keyof Waivers);
                const averageBid = roundToHundredth(waivers[position as keyof Waivers]?.reduce((r, c) => r + c.settings.waiver_bid, 0) / waivers[position as keyof Waivers].length);
                return (
                    <div key={i} className={`py-3 flex items-center text-sm font-semibold ${
                        i === POSITIONS.length - 1 ? "" : "border-b border-solid border-[#2a2c3e]"
                    }`}>
                        <div className="w-1/12">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${positionStyles[position as keyof typeof positionStyles]}`}>{position}</div>
                        </div>
                        <div className="w-3/12">
                            <TrendChart waivers={waivers[position as keyof Waivers]} />
                        </div>
                        {/* LAST PRICE */}
                        <p className="w-1/12">{recentWaivers[0]?.settings?.waiver_bid}</p>
                        {/* % CHANGE */}
                        <div className="w-1/12">
                            <p className={`${calculatePercentageChange(
                                recentWaivers[0]?.settings?.waiver_bid, recentWaivers[1]?.settings?.waiver_bid) > 0 ? "text-green-500" : "text-red-500"}`
                            }>
                            {calculatePercentageChange(recentWaivers[0]?.settings?.waiver_bid, recentWaivers[1]?.settings?.waiver_bid) > 0 ? "+" : ""}
                            {calculatePercentageChange(recentWaivers[0]?.settings?.waiver_bid, recentWaivers[1]?.settings?.waiver_bid)} %
                            </p>
                        </div>
                        {/* AVG */}
                        <p className="w-1/12">{averageBid}</p>     
                        <p className="w-1/12">{lowestBid}</p>
                        <p className="w-1/12">{highestBid}</p>
                        {/* TRANSACTIONS */}
                        <p className="w-1/12">{waivers[position as keyof Waivers].length}</p>
                        <p className="w-2/12">{findTopSpender(waivers[position as keyof Waivers])?.owner} (${findTopSpender(waivers[position as keyof Waivers])?.pts})</p>
                    </div>
                );
            })}
        </div>
    );
};