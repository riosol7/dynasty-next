import TransactionList from "@/components/widgets/TransactionList";
import PlayerList from "@/components/widgets/PlayerList";
import MarketPlus from "@/components/widgets/Market/MarketPlus";

export default function Market() {
    return (
        <div className={`flex pt-5`}>
            <div className="w-full">
                <MarketPlus />
                <div className="pt-5 mt-5">
                    <PlayerList type={"available"}/>
                </div>
            </div>
            <div className="w-3/12 pl-5">
                <TransactionList/>
            </div>
        </div>
    );
};
