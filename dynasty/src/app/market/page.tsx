import TransactionList from "@/components/widgets/TransactionList";
import PlayerList from "@/components/widgets/PlayerList";
import MarketPlus from "@/components/widgets/Market/MarketPlus";

export default function Market() {
    return (
        <div className={`flex pt-5`}>
            <div className="pr-5 w-9/12">
                <MarketPlus />
                <PlayerList type={"available"}/>
            </div>
            <div className="w-3/12">
                <TransactionList/>
            </div>
        </div>
    );
};
