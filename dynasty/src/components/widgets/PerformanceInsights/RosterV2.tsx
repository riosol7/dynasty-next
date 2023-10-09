import styles from "./PerformanceInsights.module.css";
import Image from "next/image";
import React, { useState } from "react";
import * as Interfaces from "@/interfaces";
import { Icon } from "@iconify-icon/react";
import { PLAYER_BASE_URL } from "@/constants";
import { 
    useDynastyProcessContext, 
    useFantasyCalcContext, 
    useFantasyMarket, 
    useFantasyProContext, 
    useKTCContext, 
    useLeagueContext, 
    usePlayerContext, 
    useSuperFlexContext 
} from "@/context";
import { accumulatePoints, calculateAverage, isOdd, totalPlayerPoints } from "@/utils";
import { findLogo, getTopFantasyMarketPlayerByPosition, processPlayers, processRosters, roundToHundredth } from "@/utils";

export default function RosterV2({ roster, tab }: Interfaces.RosterProps) {
    const { legacyLeague } = useLeagueContext();
    const { fantasyMarket } = useFantasyMarket()!;
    const { players } = usePlayerContext();
    const { ktc, loadKTC } = useKTCContext();
    const { superFlex, loadSuperFlex } = useSuperFlexContext();
    const { fc, loadFC } = useFantasyCalcContext();
    const { dp, loadDP } = useDynastyProcessContext();
    const { fantasyPro, loadFantasyPro } = useFantasyProContext();
    const processedPlayers = processPlayers(players, ktc, superFlex, fc, dp, fantasyPro);
    const processedRosters = processRosters(legacyLeague[0], processedPlayers);
    const updatedRoster = processedRosters.find(newRoster => newRoster.roster_id === roster.roster_id)!;
    const rID = roster.roster_id;
    const updatedPlayers = (updatedRoster?.players as Interfaces.Player[]);
    const qbs = updatedPlayers?.filter((player) => player.position === "QB");
    const rbs = updatedPlayers?.filter((player) => player.position === "RB");
    const wrs = updatedPlayers?.filter((player) => player.position === "WR");
    const tes = updatedPlayers?.filter((player) => player.position === "TE");
    const avgQBAge = calculateAverage(qbs?.reduce((total, obj) => {return total + Number(obj.age)}, 0), qbs?.length);
    const avgRBAge = calculateAverage(rbs?.reduce((total, obj) => {return total + Number(obj.age)}, 0), rbs?.length);
    const avgWRAge = calculateAverage(wrs?.reduce((total, obj) => {return total + Number(obj.age)}, 0), wrs?.length);
    const avgTEAge = calculateAverage(tes?.reduce((total, obj) => {return total + Number(obj.age)}, 0), tes?.length);
    const selectedRoster = (updatedRoster && updatedRoster[fantasyMarket as keyof typeof updatedRoster] as Interfaces.DynastyValue);
    const qbMarketValue = selectedRoster?.qb;
    const rbMarketValue = selectedRoster?.rb;
    const wrMarketValue = selectedRoster?.wr;
    const teMarketValue = selectedRoster?.te;

    const totalTeamPoints = accumulatePoints(rID, updatedPlayers, legacyLeague);
    const totalQBPoints = accumulatePoints(rID, qbs, legacyLeague);
    const totalRBPoints = accumulatePoints(rID, rbs, legacyLeague);
    const totalWRPoints = accumulatePoints(rID, wrs, legacyLeague);
    const totalTEPoints = accumulatePoints(rID, tes, legacyLeague);

    const [showQBs, setShowQBs] = useState<Boolean>(true)
    const [qbArrow, setQbArrow] = useState<Boolean>(false)
    const [showRBs, setShowRBs] = useState<Boolean>(true)
    const [rbArrow, setRbArrow] = useState<Boolean>(false)
    const [showWRs, setShowWRs] = useState<Boolean>(true)
    const [wrArrow, setWrArrow] = useState<Boolean>(false)
    const [showTEs, setShowTEs] = useState<Boolean>(true)
    const [teArrow, setTeArrow] = useState<Boolean>(false)

    const topQB = getTopFantasyMarketPlayerByPosition(updatedRoster!, "QB", fantasyMarket);
    const topRB = getTopFantasyMarketPlayerByPosition(updatedRoster!, "RB", fantasyMarket);
    const topWR = getTopFantasyMarketPlayerByPosition(updatedRoster!, "WR", fantasyMarket);
    const topTE = getTopFantasyMarketPlayerByPosition(updatedRoster!, "TE", fantasyMarket);

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

    const thresholds = {
    QB: { "#42f3e9": 25, "#3cf20a": 30, "#f2c306": 33, "#f26307": 35, "#e9230b" : 50 },
    RB: { "#42f3e9": 24, "#3cf20a": 26, "#f2c306": 27, "#f26307": 28, "#e9230b" : 35 },
    WR: { "#42f3e9": 24, "#3cf20a": 28, "#f2c306": 29, "#f26307": 30, "#e9230b" : 35 },
    TE: { "#42f3e9": 25, "#3cf20a": 28, "#f2c306": 30, "#f26307": 31, "#e9230b" : 37 }
    };

    const positionHeader = (
        arrow: Boolean, showMorePlayers: () => void, 
        positionCount: number, position: string, 
        color: string, avgPositionAge: number, 
        marketValue: number, totalPts: number,
    ) => (
        <div className="flex items-center pt-3">
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
                :
                    <Icon
                        onClick={() => showMorePlayers()}
                        icon='akar-icons:circle-chevron-up'
                        style={{
                            fontSize:'1.1rem',
                            color:"#c9cfd1",
                            background:"black",
                            borderRadius:"50%"
                        }}
                    />
                }
                <div className="mx-2 flex items-center" style={{ paddingRight:"1em" }}> 
                    <div className="flex items-center">
                        <p className="font-bold" style={{fontSize:"16px",color: color, marginRight:"6px"}}>{position}</p> 

                        <Icon icon="fluent:people-team-16-filled"style={{color:"#a9dfd8",fontSize:"21px", marginRight:"4px"}}/>
                        <p>{positionCount}</p>
                    </div>  
                    {/* <p className="mx-1"style={{color:"#b0b0b2", fontSize:"14px"}}>{positionRankings(roster)}</p>  */}
                </div>
            </div>
            <div className="flex items-center" style={{ fontFamily:"Arial" }}>
                <div className="flex items-center" style={{ width:"85px" }}>
                    <Icon icon="material-symbols:avg-pace-sharp" style={{fontSize:"24px", color:"#a9dfd8",marginRight:"4px"}}/>
                    <p className="mx-1 flex items-center">{avgPositionAge}</p>
                </div>
                <div className="flex items-center" style={{ width:"85px" }}>
                    <Icon icon="fluent:person-tag-20-regular" style={{fontSize:"24px", color:"#a9dfd8", marginRight:"2px"}}/>
                    <p>{marketValue}</p>
                </div>
                <div className="flex items-center">
                    <p>{totalPts}</p>
                    <p className="font-bold" style={{color:"#a9dfd8", paddingRight:"4px"}}>pts</p>
                </div>
            </div>
        </div>
    );

    const playerProfileRow = (player: Interfaces.Player, i: number) => (
        <div key={i} className="flex items-center py-4" style={isOdd(i)? {background:"#0f0f0f"} :{}}>
            <div style={{ width:"30px" }} className="text-center">{i === 0 ? <Icon icon="bxs:star"/> : <p className="font-bold" style={{color:"#acb6c3", fontSize:"1em"}}>{i + 1}</p>}</div>
            <div className={`${styles.smallHeadShot} mx-2`} style={{width:"60px", height:"60px", backgroundImage: `url(${PLAYER_BASE_URL}${player.player_id}.jpg)`}}>
                {findLogo(player.team)?.l !== ""?
                    <div className={styles.displayPlayerImage}>
                        <Image width={40} height={40} alt="" src={findLogo(player.team)?.l!}/>
                    </div>
                :<></>
                }
            </div> 
            <div className="mx-2" style={{fontSize:".9rem"}}>
                <p className="font-bold">{player.full_name}</p>
                <p style={{fontSize:"10px", color:"#cbcbcb"}}>#{player.number} {player.position} - {player.team}</p>
                <p className="font-bold" style={{color:"#7c90a5",fontSize:"10px"}}>{player.years_exp === 0 ? <span>ROOKIE</span> : <span>EXP {player.years_exp}</span>}</p>
                <div className="flex items-center" style={{fontSize:"11.5px"}}>
                    {/* <p style={{ color:"#b0b0b2", width:"60px" }}>rank <span style={{color:"white"}}>{player.rank}</span></p> */}
                    <p style={{ color:"#b0b0b2", width:"60px" }}>age 
                    {/* <span style={primeIndicator(player.age, thresholds)}>{player.age}</span>3 */}
                    </p>
                    <div className="flex items-center" style={{width:"80px"}}>
                        <p style={{color:"#b0b0b2"}}>value</p>
                        {/* <p className="mx-1">{player.value}</p> */}
                    </div>
                    <div className="flex items-center">
                        {totalPlayerPoints(legacyLeague, roster.roster_id, player.player_id).ppts === totalPlayerPoints(legacyLeague, roster.roster_id, player.player_id).fpts ?
                            <span style={{ color: "white" }}>{totalPlayerPoints(legacyLeague, roster.roster_id, player.player_id).fpts}</span>
                        :
                            <p>
                                <span style={{ color:"white" }}>{totalPlayerPoints(legacyLeague, roster.roster_id, player.player_id).fpts}</span>
                                <span className="font-bold" style={{color:"#718396"}}>/</span>
                                <span style={{ color:"#c5c5c5" }}>{totalPlayerPoints(legacyLeague, roster.roster_id, player.player_id).ppts}</span>
                            </p>
                        }
                        <p style={{ color:"#b0b0b2" }}>pts</p>
                    </div>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className="py-4" style={{minWidth:"388px"}}>
            <div className={`${styles.performanceHeader}`}> 
                <p className="w-10/12">Roster</p>
                <p className="w-2/12 flex justify-end"></p>
            </div>
            <div className="flex flex-wrap">
                <div className="col">
                    {positionHeader(qbArrow, showMoreQBs, qbs?.length, "QB", "#f8296d", avgQBAge, qbMarketValue, totalQBPoints.fpts)}
                    {showQBs ? qbs?.map((player, i) => playerProfileRow(player, i)) : playerProfileRow(topQB, 0)}
                </div>
                <div className="col">
                    {positionHeader(rbArrow, showMoreRBs, rbs?.length, "RB", "#36ceb8", avgRBAge, rbMarketValue, totalRBPoints.fpts)}
                    {showRBs ? rbs?.map((player, i) => playerProfileRow(player, i)) : playerProfileRow(topRB, 0)}   
                </div>
                <div className="col">
                    {positionHeader(wrArrow, showMoreWRs, wrs?.length, "WR", "#58a7ff", avgWRAge, wrMarketValue, totalWRPoints.fpts)}
                    {showWRs ? wrs?.map((player, i) => playerProfileRow(player, i)) : playerProfileRow(topWR, 0)}
                </div>
                <div className="col">
                    {positionHeader(teArrow, showMoreTEs, tes?.length, "TE", "#faae58", avgTEAge, teMarketValue, totalTEPoints.fpts)}
                    {showTEs ? tes?.map((player, i) => playerProfileRow(player, i)) : playerProfileRow(topTE, 0)}
                </div>
            </div>
        </div>
    )
}