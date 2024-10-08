import styles from "./PerformanceInsights.module.css";
import Image from "next/image";
import React, { useState } from "react";
import * as Interfaces from "@/interfaces";
import { Icon } from "@iconify-icon/react";
import { PLAYER_BASE_URL } from "@/constants";
import { 
    useSeasonContext,
    useDynastyProcessContext, 
    useFantasyCalcContext, 
    useFantasyMarket, 
    useFantasyProContext, 
    useKTCContext, 
    useLeagueContext, 
    usePlayerContext, 
} from "@/context";
import { 
    accumulatePoints, 
    calculatePercentage,
    findLogo, sortPlayersByFantasyMarket, processPlayers, processRosters,
    primeIndicator, 
    isOdd, 
    totalFantasyPointsByRoster, 
    findLeagueBySeason, 
    placementRankings, 
    sortDynastyRostersByPosition, 
    getTeamStats } from "@/utils";

export default function Roster({ roster }: Interfaces.RosterProps) {
    const { legacyLeague } = useLeagueContext();
    const { selectSeason } = useSeasonContext();
    const { fantasyMarket } = useFantasyMarket()!;
    const { players } = usePlayerContext();
    const { ktc, loadKTC } = useKTCContext();
    const { fc, loadFC } = useFantasyCalcContext();
    const { dp, loadDP } = useDynastyProcessContext();
    const { fantasyPro, loadFantasyPro } = useFantasyProContext();
    const rID = roster.roster_id;
    const allTime = selectSeason === "All Time" ? true : false;
    const processedPlayers = processPlayers(players, ktc, fc, dp, fantasyPro);
    const teamStats = getTeamStats(rID, selectSeason, legacyLeague, fantasyMarket, processedPlayers);
    
    const league = findLeagueBySeason(selectSeason, legacyLeague);
    const processedRosters = processRosters(league, processedPlayers);
    const updatedRoster = processedRosters.find(newRoster => newRoster.roster_id === rID)!;
    const dynastyQBRank = sortDynastyRostersByPosition(processedRosters, fantasyMarket, "QB")
    .find(roster => roster.roster_id === rID)?.settings.rank;
    const dynastyRBRank = sortDynastyRostersByPosition(processedRosters, fantasyMarket, "RB")
    .find(roster => roster.roster_id === rID)?.settings.rank;
    const dynastyWRRank = sortDynastyRostersByPosition(processedRosters, fantasyMarket, "WR")
    .find(roster => roster.roster_id === rID)?.settings.rank;
    const dynastyTERank = sortDynastyRostersByPosition(processedRosters, fantasyMarket, "TE")
    .find(roster => roster.roster_id === rID)?.settings.rank;
    const dynastyRankings = {
        QB: dynastyQBRank || 0,
        RB: dynastyRBRank || 0,
        WR: dynastyWRRank || 0,
        TE: dynastyTERank || 0
    }
    const qbs = sortPlayersByFantasyMarket((updatedRoster?.players as Interfaces.Player[])!, fantasyMarket, "QB");
    const rbs = sortPlayersByFantasyMarket((updatedRoster?.players as Interfaces.Player[])!, fantasyMarket, "RB");
    const wrs = sortPlayersByFantasyMarket((updatedRoster?.players as Interfaces.Player[])!, fantasyMarket, "WR");
    const tes = sortPlayersByFantasyMarket((updatedRoster?.players as Interfaces.Player[])!, fantasyMarket, "TE");

    const topQB = qbs[0];
    const topRB = rbs[0];
    const topWR = wrs[0];
    const topTE = tes[0];

    const avgQBAge = teamStats.qb.age;
    const avgRBAge = teamStats.rb.age;
    const avgWRAge = teamStats.wr.age;
    const avgTEAge = teamStats.te.age;
    const qbMarketValue = teamStats?.qb.value;
    const rbMarketValue = teamStats?.rb.value;
    const wrMarketValue = teamStats?.wr.value;
    const teMarketValue = teamStats?.te.value;

    const totalQBPoints = allTime ? 
    accumulatePoints(rID, qbs, legacyLeague) : 
    accumulatePoints(rID, qbs, legacyLeague, selectSeason);
    const totalRBPoints = allTime ? 
    accumulatePoints(rID, rbs, legacyLeague) : 
    accumulatePoints(rID, rbs, legacyLeague, selectSeason);
    const totalWRPoints = allTime ? 
    accumulatePoints(rID, wrs, legacyLeague) : 
    accumulatePoints(rID, wrs, legacyLeague, selectSeason);
    const totalTEPoints = allTime ? 
    accumulatePoints(rID, tes, legacyLeague) : 
    accumulatePoints(rID, tes, legacyLeague, selectSeason);

    const [showQBs, setShowQBs] = useState<Boolean>(true)
    const [qbArrow, setQbArrow] = useState<Boolean>(false)
    const [showRBs, setShowRBs] = useState<Boolean>(true)
    const [rbArrow, setRbArrow] = useState<Boolean>(false)
    const [showWRs, setShowWRs] = useState<Boolean>(true)
    const [wrArrow, setWrArrow] = useState<Boolean>(false)
    const [showTEs, setShowTEs] = useState<Boolean>(true)
    const [teArrow, setTeArrow] = useState<Boolean>(false)

    const showMoreQBs = () => {
        setShowQBs(!showQBs);
        setQbArrow(!qbArrow);
    };
    const showMoreRBs = () => {
        setShowRBs(!showRBs);
        setRbArrow(!rbArrow);
    };
    const showMoreWRs = () => {
        setShowWRs(!showWRs);
        setWrArrow(!wrArrow);
    };
    const showMoreTEs = () => {
        setShowTEs(!showTEs);
        setTeArrow(!teArrow);
    };

    const positionHeader = (
        arrow: Boolean, showMorePlayers: () => void, 
        positionCount: number, position: string, 
        color: string, avgPositionAge: number, 
        marketValue: number, totalPts: { fpts: number, ppts: number },
    ) => (
        <div>
            <div className="flex items-center justify-between px-1 pr-2 pt-3">
                <div className="flex items-center">
                    {arrow ?
                    <Icon
                        icon='akar-icons:circle-chevron-down'
                        onClick={() => showMorePlayers()}
                        style={{
                            fontSize:'1.1rem',
                            color:"#c9cfd1",
                            background:"black",
                            borderRadius:"50%"
                        }}
                    />
                    : <Icon
                        onClick={() => showMorePlayers()}
                        icon='akar-icons:circle-chevron-up'
                        style={{
                            fontSize:'1.1rem',
                            color:"#c9cfd1",
                            background:"black",
                            borderRadius:"50%"
                        }}
                    />}
                    <p className="font-bold mx-1" 
                    style={{fontSize:"16px",color: color}}>{position}</p>
                    <p className="flex items-center">{placementRankings(dynastyRankings[position as keyof typeof dynastyRankings])}</p>
                </div>
                <div className="flex items-center w-6/12">
                    <div className="w-5/12 flex items-center">
                        <Icon icon="material-symbols:avg-pace-sharp" 
                        style={{ fontSize:"24px", color:"#a9dfd8", marginRight:"0px" }}/>
                        <p className="mx-1 flex items-center">{avgPositionAge}</p>
                    </div>
                    <div className="w-5/12 flex items-center">
                        <Icon icon="fluent:person-tag-20-regular" 
                        style={{ fontSize:"24px", color:"#a9dfd8", marginRight:"5px" }}/>
                        <p>{marketValue}</p>
                    </div>
                    <div className="w-2/12 flex items-center">
                        <Icon icon="fluent:people-team-16-filled" 
                        style={{color:"#a9dfd8", fontSize:"21px", marginRight:"2px"}}/>
                        <p>{positionCount}</p>
                    </div>
                </div>
            </div>
            <div className="pt-1">
                <div className="bg-gray-700 h-1 mt-1">
                    <div className="bg-indigo-200 h-1" 
                    style={{ width: `${calculatePercentage(totalPts.fpts, totalPts.ppts)}%` }}></div>
                </div>
                <p className="text-center pt-1" style={{fontSize: "11.4px"}}>
                    <span className="text-[darkgray] mr-1">{allTime ? "All Time" : `${selectSeason} Season`}</span>
                    {totalPts.fpts} / {totalPts.ppts}<span className="font-bold" style={{color:"#7c90a5"}}> pts </span> 
                    ({calculatePercentage(totalPts.fpts, totalPts.ppts)}%) - ?th {position} pts scored
                </p>
            </div>
        </div>
    );

    const playerProfileRow = (player: Interfaces.Player, i: number) => {
        const marketContent = player[fantasyMarket as keyof typeof player] as Interfaces.MarketContent;
        const playerPoints = allTime ? 
        totalFantasyPointsByRoster(legacyLeague, roster.roster_id, player.player_id) : 
        totalFantasyPointsByRoster(legacyLeague, roster.roster_id, player.player_id, selectSeason);
        return (
            <div key={i} className="flex items-center py-4 h-36" style={isOdd(i)? {background:"#0f0f0f"} :{}}>
                <div style={{ width:"30px" }} className="text-center">
                    {i === 0 ? 
                    <Icon icon="bxs:star"/> : 
                    <p className="font-bold" style={{color:"#acb6c3", fontSize:"1em"}}>{i + 1}</p>}
                </div>
                <div>
                    <div className={`${styles.smallHeadShot} mx-2`} style={{backgroundImage: `url(${PLAYER_BASE_URL}${player.player_id}.jpg)`}}>
                        {findLogo(player.team)?.l !== "FA" ?
                            <div className={styles.teamLogo}>
                                <Image width={40} height={40} alt="" src={findLogo(player.team)?.l!}/>
                            </div>
                        : <></>}
                    </div> 
                    <p className={styles.playerOwnedTitle}>DRAFTED {selectSeason}</p>
                </div>
                <div className="mx-2 w-full" style={{ fontSize: ".9rem" }}>
                    <div className="flex items-center">
                        {player.injury_status === "IR" ? <Icon icon="fa-solid:user-injured" style={{color: "crimson", fontSize: "1.3em", marginRight: "4px"}}/>: <></>}
                        <p className="font-bold">{player.full_name}</p>
                    </div>
                    <p style={{fontSize:"10px", color:"#cbcbcb"}}>#{player.number} {player.position} - {player.team}</p>
                    <p className="font-bold flex items-center" style={{ color:"#7c90a5", fontSize:"10px" }}>
                        <span className="mr-2">{player.years_exp === 0 ? `ROOKIE` : `EXP ${player.years_exp}`}</span>
                        AGE <span style={{color: primeIndicator(player.age, player.position), marginLeft: "4px"}}>{player.age}</span>
                    </p>
                    <div className="flex items-center" style={{fontSize:"11.5px", color:"#b0b0b2" }}>
                        <p className="w-3/12">{player.position} rank <span style={{color:"white"}}>{marketContent?.positionRank}</span></p>
                        <p className="w-4/12">overall rank <span style={{color:"white"}}>{marketContent?.rank}</span></p>
                        <div className="w-5/12 flex items-center">
                            <p>value</p>
                            <p className="mx-1" style={{color:"white"}}>{marketContent?.value}</p>
                            {Number(marketContent?.trend) > 0 ? 
                                <p className="flex items-center" style={{color:"white"}}>
                                    (+{marketContent?.trend}
                                    <Icon icon={`mingcute:trending-${Number(marketContent?.trend) > 0 ? "up" : "down"}-fill`} 
                                    style={{color:"#35C2BC", fontSize: "1.6em", marginLeft:"2px"}}/>)
                                </p>
                            :""}
                        </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 my-1">
                        <div className="bg-indigo-400 h-1.5 rounded-full" 
                        style={{ width: `${calculatePercentage(playerPoints.fpts, playerPoints.ppts)}%` }}></div>
                    </div>
                    <p className="text-center text-xs"> 
                        <span className="text-[darkgray] mr-1">{selectSeason === "All Time" ? "All Time" : `${selectSeason} Season`}</span>
                        {playerPoints.fpts} / {playerPoints.ppts}
                        <span className="font-bold" style={{color:"#7c90a5"}}> pts </span> 
                        ({calculatePercentage(playerPoints.fpts, playerPoints.ppts)}%) 
                        <span className="text-[darkgray] mr-1"> Avg.</span>0
                    </p>
                </div>
            </div>
        );
    };
    
    return (
        <div className="py-4">
            <div className={`${styles.performanceHeader} py-1`}> 
                <p>{allTime ? `Active Roster`: `${league.season} Offense`}</p>
            </div>
            <div className="flex flex-wrap">
                <div className="w-1/4">
                    {positionHeader(qbArrow, showMoreQBs, qbs?.length, "QB", "#f8296d", avgQBAge, qbMarketValue, totalQBPoints)}
                    {showQBs ? qbs?.map((player, i) => playerProfileRow(player, i)) : playerProfileRow(topQB, 0)}
                </div>
                <div className="w-1/4">
                    {positionHeader(rbArrow, showMoreRBs, rbs?.length, "RB", "#36ceb8", avgRBAge, rbMarketValue, totalRBPoints)}
                    {showRBs ? rbs?.map((player, i) => playerProfileRow(player, i)) : playerProfileRow(topRB, 0)}   
                </div>
                <div className="w-1/4">
                    {positionHeader(wrArrow, showMoreWRs, wrs?.length, "WR", "#58a7ff", avgWRAge, wrMarketValue, totalWRPoints)}
                    {showWRs ? wrs?.map((player, i) => playerProfileRow(player, i)) : playerProfileRow(topWR, 0)}
                </div>
                <div className="w-1/4">
                    {positionHeader(teArrow, showMoreTEs, tes?.length, "TE", "#faae58", avgTEAge, teMarketValue, totalTEPoints)}
                    {showTEs ? tes?.map((player, i) => playerProfileRow(player, i)) : playerProfileRow(topTE, 0)}
                </div>
            </div>
        </div>
    );
};