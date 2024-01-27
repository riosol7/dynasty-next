import styles from "./Team.module.css";
import * as Interfaces from "../../interfaces";
import TeamHeader from "@/components/headers/Team";
import { Icon } from "@iconify-icon/react";
import { useDynastyProcessContext, useFantasyCalcContext, useFantasyMarket, useFantasyProContext, useKTCContext, useLeagueContext, usePlayerContext, useSeasonContext, useSuperFlexContext } from "@/context";
import { findLeagueByTeamName, findRosterByOwnerID, findUserByName, getTeamStats, processPlayers } from "@/utils";

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
    const foundLeague = findLeagueByTeamName(name, legacyLeague);
    const foundUser = findUserByName(name, foundLeague);
    const foundRoster = findRosterByOwnerID(foundUser.user_id, foundLeague);
    const rID = foundRoster?.roster_id;
    const processedPlayers = processPlayers(players, ktc, superFlex, fc, dp, fantasyPro);

    const teamStats = getTeamStats(rID, selectSeason, legacyLeague, fantasyMarket, processedPlayers);

    return (
        <div>
            <div className={`${styles.teamNav}`}>
                <select id={styles.selectSeason} onChange={onChange} value={selectSeason}>
                {legacyLeague.map((league, idx) => (
                    <option key={idx} value={league.season}>{`${league.season} PERFORMANCE INSIGHTS`}</option>
                ))}
                </select>
                <div className="flex items-center pl-5 text-sm font-bold">
                    <div className="flex items-center mr-5">
                        <Icon icon="fluent:person-tag-20-regular" className={styles.icon} style={{marginRight:"2px"}}/>
                        <p>TOTAL VALUE {teamStats.value}</p>
                    </div>
                    <div className="flex items-center mr-5">
                        <Icon icon="material-symbols:avg-pace-sharp" className={styles.icon}/>
                        <p>AVG. AGE {teamStats.age}</p>
                    </div>
                    <div className="flex items-center">
                        <Icon icon="fluent:people-team-16-filled" className={styles.icon} style={{fontSize:"22px", marginRight:"2px"}}/>
                        <p>PLAYERS {teamStats.players}</p>
                    </div>
                </div>
            </div>
            <div className={styles.teamBody}>
                <TeamHeader name={name}/>
                {children}
            </div>
        </div>
    );
};