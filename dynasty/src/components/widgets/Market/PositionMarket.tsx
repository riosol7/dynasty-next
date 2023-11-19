import styles from "./Market.module.css";
import * as Interfaces from "@/interfaces";
import { Waivers } from "@/types";
import { POSITIONS } from "@/constants";
import { 
    calculatePercentageChange, 
    findRecentWaivers, 
    findHighestBid, 
    findLowestBid, 
    findTopSpender, 
    filteredTransactionsBySeason,
    roundToHundredth 
} from "@/utils";
import TrendChart from "@/components/charts/TrendChart";

const positionStyles = {
    QB: styles.qbHUD,
    RB: styles.rbHUD,
    WR: styles.wrHUD,
    TE: styles.teHUD,
    K: styles.kHUD,
    DEF: styles.defHUD,
};

export default function PositionMarket({ waivers, selectSeason }: Interfaces.MarketWidgetProps ) {

    return (
        <div className="py-3">
            <div className="flex items-center font-bold pb-3 text-xs text-[#7d91a6] border-b border-solid border-[#2a2c3e]">
                <div style={{ width: "70px" }}>POSITION</div>
                <div className="w-3/12">{selectSeason === "All Time" ? selectSeason.toLocaleUpperCase() : selectSeason } TREND</div>
                <div className="w-1/12">LAST PRICE</div>
                <div className="w-1/12">CHANGE %</div>
                <div className="w-1/12">AVG</div>
                <div className="w-1/12">LOW</div>
                <div className="w-1/12">HIGH</div>
                <div className="w-1/12">VOLUME</div>
                <div className="w-2/12">TOP SPENDER</div>
            </div>
            {POSITIONS.map((position, i) => {
                const positionWaivers = waivers && waivers[position as keyof typeof waivers]!;
                const filteredWaivers = filteredTransactionsBySeason(positionWaivers, selectSeason);
                const recentWaivers = findRecentWaivers(filteredWaivers);
                const highestBid = findHighestBid(filteredWaivers);
                const lowestBid = findLowestBid(filteredWaivers);
                const volume = filteredWaivers?.length;
                const averageBid = roundToHundredth(filteredWaivers?.reduce((r, c) => r + c.settings.waiver_bid, 0)! / volume);
                const lastPrice = recentWaivers && recentWaivers[0]?.settings?.waiver_bid;
                const prevPrice = recentWaivers && recentWaivers[1]?.settings?.waiver_bid;
                return (
                    <div key={i} className={`py-3 flex items-center text-sm ${
                        i === POSITIONS.length - 1 ? "" : "border-b border-solid border-[#2a2c3e]"
                    }`}>
                        <div style={{width: "70px"}}>
                            <div className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold ${positionStyles[position as keyof typeof positionStyles]}`}>{position}</div>
                        </div>
                        <div className="w-3/12 pr-5">
                            <TrendChart waivers={waivers[position as keyof Waivers]} height={50}/>
                        </div>
                        <p className="w-1/12">{lastPrice}</p>
                        <div className="w-1/12">
                            <p className={`${calculatePercentageChange(lastPrice, prevPrice) > 0 ? "text-green-500" : "text-red-500"}`}>
                            {calculatePercentageChange(lastPrice, prevPrice) > 0 ? "+" : ""}
                            {calculatePercentageChange(lastPrice, prevPrice)} %
                            </p>
                        </div>
                        <p className="w-1/12">{averageBid}</p>     
                        <p className="w-1/12">{lowestBid}</p>
                        <p className="w-1/12">{highestBid}</p>
                        <p className="w-1/12">{volume}</p>
                        <div className="w-2/12">
                            <p className="text-xs">@{findTopSpender(waivers[position as keyof Waivers])?.owner}</p>
                            <p>${findTopSpender(waivers[position as keyof Waivers])?.pts}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};