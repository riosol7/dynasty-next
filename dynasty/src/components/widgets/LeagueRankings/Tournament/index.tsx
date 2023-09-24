import Bracket from "./Bracket";
import * as Interfaces from "../../../../interfaces";

function WeekLabel({season, weekNumber}: Interfaces.WeekLabelProps) {
    const adjustedWeek = Number(season) <= 2020 ? weekNumber : weekNumber + 1;
    return <p className="text-center">{`Week ${adjustedWeek}`}</p>;
};

function BracketSection({ sectionTitle, season, children }: Interfaces.BracketProps) {
    return (
        <div>
            <p className="my-5" style={{fontSize: "13.5px", color: "lightgrey"}}>{sectionTitle}</p>
            <div className="flex items-center" style={{fontSize: "12.5px", color: "#7d91a6"}}>
                <div style={{width: "250px"}}>
                    <WeekLabel season={season} weekNumber={14} />
                </div>
                <div className="mx-4" style={{ width:"250px"}}>
                    <WeekLabel season={season} weekNumber={15} />
                </div>
                <div style={{width: "250px"}}>
                    <WeekLabel season={season} weekNumber={16} />
                </div>
            </div>
            <div>{children}</div>
        </div>
    );
};

export default function Tournament({ season }: Interfaces.SeasonProps) {
    return (
        <div className="flex justify-center">
            <div>
                <BracketSection sectionTitle="PLAYOFFS" season={season}>
                    <Bracket sectionTitle="playoffs" season={season}/>
                </BracketSection>
                <BracketSection sectionTitle="TOILET BOWL" season={season}>
                    <Bracket sectionTitle="toiletBowl" season={season}/>
                </BracketSection>
            </div>
        </div>
    );
};