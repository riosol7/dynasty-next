import TransactionList from "@/components/widgets/TransactionList";
import PlayerList from "@/components/widgets/PlayerList";
import MarketPlus from "@/components/widgets/Market/MarketPlus";

export default function Market() {
    return (
        <div className={`flex pt-5`}>
            <div className="w-full pr-5">
                <MarketPlus />
                <PlayerList type={"available"}/>
            </div>
            <TransactionList/>
        </div>
    );
};
