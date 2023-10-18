import TransactionList from "@/components/widgets/TransactionList";
import PlayerList from "@/components/widgets/PlayerList";
import MarketPlus from "@/components/widgets/Market/MarketPlus";

export default function Market() {
    return (
        <div className={`flex`}>
            <div className="w-full">
                <MarketPlus />
                <PlayerList type={"available"}/>
            </div>
            <TransactionList/>
        </div>
    );
};
