import styles from "./Team.module.css";
import * as Interfaces from "../../interfaces";
import TeamHeader from "@/components/headers/Team";
import { Icon } from "@iconify-icon/react";
import { 
    useDynastyProcessContext, 
    useFantasyCalcContext, 
    useFantasyMarket, 
    useFantasyProContext, 
    useKTCContext, 
    useLeagueContext, 
    usePlayerContext, 
    useSeasonContext, 
    useSuperFlexContext 
} from "@/context";
import { 
    findLeagueByTeamName, 
    findRosterByOwnerID, 
    findUserByName, 
    getTeamStats, 
    processPlayers, 
    seasonStats
} from "@/utils";

export default function TeamLayout({ children, name }: Interfaces.TeamLayoutProps) {
    const { selectSeason, onChange } = useSeasonContext()!;
    const { legacyLeague } = useLeagueContext();
    const { fantasyMarket } = useFantasyMarket()!;
    const { players } = usePlayerContext();
    const { ktc, loadKTC } = useKTCContext();
    const { superFlex, loadSuperFlex } = useSuperFlexContext();
    const { fc, loadFC } = useFantasyCalcContext();
    const { dp, loadDP } = useDynastyProcessContext();
    const { fantasyPro, loadFantasyPro } = useFantasyProContext();
    const foundLeague: Interfaces.League = findLeagueByTeamName(name, legacyLeague);
    const foundUser: Interfaces.Owner = findUserByName(name, foundLeague);
    const foundRoster: Interfaces.Roster = findRosterByOwnerID(foundUser.user_id, foundLeague);
    const rID:number = foundRoster?.roster_id;
    const processedPlayers: Interfaces.Player[] = processPlayers(players, ktc, superFlex, fc, dp, fantasyPro);

    const teamStats = getTeamStats(rID, selectSeason, legacyLeague, fantasyMarket, processedPlayers)?.team;
    const test = seasonStats(selectSeason, legacyLeague);
    return (
        <div>
            <div className={`${styles.teamNav}`}>
                <div className={styles.selectSeasonContainer}>
                    <Icon icon="fluent:box-multiple-search-24-regular" className={`${styles.icon}`} style={{fontSize:"1.7rem"}}/>
                    <select id={styles.selectSeason} onChange={onChange} value={selectSeason}>
                        <option value={"All Time"}>All-Time Performance Insights</option>
                        {legacyLeague.map((league, idx) => (
                            <option key={idx} value={league.season}>{`${league.season} - Performance Insights`}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center pl-5 text-sm font-bold">
                    <div className="flex items-center mr-5">
                        <Icon icon="fluent:person-tag-20-regular" className={styles.icon}/>
                        <p>Total Value 
                            <span className="pl-2">{teamStats.value}</span>
                            <span className="pl-2 font-light text-[darkgray]">?nd ranked</span>
                        </p>
                    </div>
                    <div className="flex items-center mr-5">
                        <Icon icon="material-symbols:avg-pace-sharp" className={styles.icon}/>
                        <p>Avg. Age
                            <span className="pl-2">{teamStats.age}</span>
                            <span className="pl-2 font-light text-[darkgray]">?nd youngest</span>
                        </p>
                    </div>
                    <div className="flex items-center">
                        <Icon icon="fluent:people-team-16-filled" className={styles.icon}/>
                        <p>Players <span className="pl-1">{teamStats.players}</span></p>
                    </div>
                </div>
            </div>
            <div className={styles.header}>
                <TeamHeader name={name}/>
            </div>
            <div className={styles.teamBody}>
                {children}
            </div>
        </div>
    );
};