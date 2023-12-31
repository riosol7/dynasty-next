import MVPSlider from "@/components/sliders/MVP";
import MarketWidget from "@/components/widgets/Market";
import LeagueRankings from "@/components/widgets/LeagueRankings";

export default function Dashboard() {
    return (
        <>
            <MVPSlider/>
            <MarketWidget/>
            <LeagueRankings/>
        </>
    );
};