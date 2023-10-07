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
// import { 
//     calculatePositionStats,
//     getPrimeIndicatorColor,
//     getTotalPts, 
//     isOdd, 
// } from "../utils";
import { findLogo, getTopFantasyMarketPlayerByPosition, processPlayers, processRosters, roundToHundredth } from "@/utils";

export default function Roster({ roster, tab }: Interfaces.RosterProps) {
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
    const updatedRoster = processedRosters.find(newRoster => newRoster.roster_id === roster.roster_id); 
    const qbs = (updatedRoster?.players as Interfaces.Player[]).filter((player) => player.position === "QB");
    const rbs = (updatedRoster?.players as Interfaces.Player[]).filter((player) => player.position === "RB");
    const wrs = (updatedRoster?.players as Interfaces.Player[]).filter((player) => player.position === "WR");
    const tes = (updatedRoster?.players as Interfaces.Player[]).filter((player) => player.position === "TE");

    const [showQBs, setShowQBs] = useState(true)
    const [qbArrow, setQbArrow] = useState(false)
    const [showRBs, setShowRBs] = useState(true)
    const [rbArrow, setRbArrow] = useState(false)
    const [showWRs, setShowWRs] = useState(true)
    const [wrArrow, setWrArrow] = useState(false)
    const [showTEs, setShowTEs] = useState(true)
    const [teArrow, setTeArrow] = useState(false)

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
 
    // function qbRankings (roster) {
    //     let rank = "";
    //     if (roster !== undefined) {
    //         const foundTeam = processedRosters?.qbRank?.find(team => team.kct.owner.display_name === roster.owner.display_name);
    //         foundTeam?.rank === 1 ?
    //             rank = foundTeam.rank + "st"
    //         : foundTeam?.rank === 2 ?
    //             rank = foundTeam.rank + "nd"
    //         : foundTeam?.rank === 3 ?
    //             rank = foundTeam.rank + "rd"
    //         : rank = foundTeam.rank + "th"    
    //     }
    //     return rank;
    // }
    // function rbRankings (roster) {
    //     let rank = "";
    //     const foundTeam = processedRosters?.rbRank?.find(team => team.kct.owner.display_name === roster.owner.display_name);
    //     foundTeam.rank === 1 ?
    //         rank = foundTeam.rank + "st"
    //     : foundTeam.rank === 2 ?
    //         rank = foundTeam.rank + "nd"
    //     : foundTeam.rank === 3 ?
    //         rank = foundTeam.rank + "rd"
    //     : rank = foundTeam.rank + "th"
    //     return rank;
    // }
    // function wrRankings (roster) {
    //     let rank = "";
    //     const foundTeam = processedRosters?.wrRank?.find(team => team.kct.owner.display_name === roster.owner.display_name);
    //     foundTeam.rank === 1 ?
    //         rank = foundTeam.rank + "st"
    //     : foundTeam.rank === 2 ?
    //         rank = foundTeam.rank + "nd"
    //     : foundTeam.rank === 3 ?
    //         rank = foundTeam.rank + "rd"
    //     : rank = foundTeam.rank + "th"
    //     return rank;
    // }
    // function teRankings (roster) {
    //     let rank = "";
    //     const foundTeam = processedRosters?.teRank?.find(team => team.kct.owner.display_name === roster.owner.display_name)
    //     foundTeam.rank === 1 ?
    //         rank = foundTeam.rank + "st"
    //     : foundTeam.rank === 2 ?
    //         rank = foundTeam.rank + "nd"
    //     : foundTeam.rank === 3 ?
    //         rank = foundTeam.rank + "rd"
    //     : rank = foundTeam.rank + "th"
    //     return rank;
    // }

    const playerTypes = [
    {
        type: "qb",
        data: qbs,
        thresholds: { "#42f3e9": 25, "#3cf20a": 30, "#f2c306": 33, "#f26307": 35, "#e9230b" : 50 }
    },
    {
        type: "rb",
        data: rbs,
        thresholds: { "#42f3e9": 24, "#3cf20a": 26, "#f2c306": 27, "#f26307": 28, "#e9230b" : 35 }
    },
    {
        type: "wr",
        data: wrs,
        thresholds: { "#42f3e9": 24, "#3cf20a": 28, "#f2c306": 29, "#f26307": 30, "#e9230b" : 35 }
    },
    {
        type: "te",
        data: tes,
        thresholds: { "#42f3e9": 25, "#3cf20a": 28, "#f2c306": 30, "#f26307": 31, "#e9230b" : 37 }
    }];

    // const playerStats = playerTypes.map(playerType => calculatePositionStats(playerType.data, playerType));
    // const playerCount = playerStats.reduce((sum, player) => sum + player.count, 0);
    // const avgTeamAge = roundToHundredth(playerStats.reduce((sum, player) => sum + player.avgAge, 0) / playerTypes.length);
    // const totalTeamPts = playerStats.reduce((sum, player) => sum + player.totalPts, 0);
    // const totalTeamMaxPts = roundToHundredth(playerStats.reduce((sum, player) => sum + player.totalMaxPts, 0));

    // const positionHeader = (arrow, showMorePlayers, positionCount, position, color, positionRankings, avgPositionAge, kctPositionValue, totalPts,) => (
    //     <div className="d-flex align-items-center pt-3">
    //         <div className="d-flex align-items-center">
    //             {arrow ?
    //                 <Icon
    //                     icon='akar-icons:circle-chevron-down'
    //                     onClick={() => showMorePlayers()}
    //                     style={{
    //                         fontSize:'1.1rem',
    //                         color:"#c9cfd1",
    //                         background:"black",
    //                         borderRadius:"50%"
    //                     }}
    //                 />
    //             :
    //                 <Icon
    //                     onClick={() => showMorePlayers()}
    //                     icon='akar-icons:circle-chevron-up'
    //                     style={{
    //                         fontSize:'1.1rem',
    //                         color:"#c9cfd1",
    //                         background:"black",
    //                         borderRadius:"50%"
    //                     }}
    //                 />
    //             }
    //             <div className="m-0 mx-2 d-flex align-items-center" style={{paddingRight:"1em"}}> 
    //                 <div className="d-flex align-items-center">
    //                     <Icon icon="fluent:people-team-16-filled"style={{color:"#a9dfd8",fontSize:"21px", marginRight:"4px"}}/>
    //                     <p className="m-0">{positionCount}</p>
    //                 </div>  
    //                 <p className="mx-2 m-0"> | </p>
    //                 <p className="m-0 bold" style={{fontSize:"16px",color: color, marginRight:"6px"}}>{position}</p> 
    //                 <p className="m-0 mx-1"style={{color:"#b0b0b2", fontSize:"14px"}}>{positionRankings(roster)}</p> 
    //             </div>
    //         </div>
    //         <div className="d-flex align-items-center" style={{fontFamily:"Arial"}}>
    //             <div className="d-flex align-items-center" style={{width:"85px"}}>
    //                 <Icon icon="material-symbols:avg-pace-sharp" style={{fontSize:"24px", color:"#a9dfd8",marginRight:"4px"}}/>
    //                 <p className="m-0 mx-1 d-flex align-items-center">{avgPositionAge}</p>
    //             </div>
    //             <div className="d-flex align-items-center" style={{width:"85px"}}>
    //                 <Icon icon="fluent:person-tag-20-regular" style={{fontSize:"24px", color:"#a9dfd8", marginRight:"2px"}}/>
    //                 <p className="m-0">{kctPositionValue}</p>
    //             </div>
    //             {tab !== "Dynasty" ?
    //                 <div className="d-flex align-items-center">
    //                     <p className="m-0">{totalPts}</p>
    //                     <p className="m-0 bold" style={{color:"#a9dfd8", paddingRight:"4px"}}>pts</p>
    //                 </div> 
    //             :<></>
    //             }
    //         </div>
    //     </div>
    // );

    // const playerProfileRow = (player, i, primeIndicator, thresholds) => (
    //     <div key={i} className="d-flex align-items-center py-4" style={isOdd(i) === 1 ? {background:"#0f0f0f"} :{}}>
    //         <div style={{width:"30px"}} className="text-center">{i === 0 ? <Icon icon="bxs:star"/> : <p className="m-0 bold" style={{color:"#acb6c3", fontSize:"1em"}}>{i + 1}</p>}</div>
    //         <div className="smallHeadShot mx-2" style={{width:"60px",height:"60px",backgroundImage: `url(${playerBaseURL}${player.player_id}.jpg)`}}>
    //             {findLogo(player.team)?.l !== ""?
    //                 <div className="displayOwnerLogoSM">
    //                     <img style={{width:"2.8em"}} alt="" src={findLogo(player.team)?.l}/>
    //                 </div>
    //             :<></>
    //             }
    //         </div> 
    //         <div className="col mx-2" style={{fontSize:".9rem"}}>
    //             <p className="m-0 bold">{player.full_name}</p>
    //             <p className="m-0"style={{fontSize:"10px", color:"#cbcbcb"}}>#{player.number} {player.position} - {player.team}</p>
    //             <p className="m-0 bold" style={{color:"#7c90a5",fontSize:"10px"}}>{player.years_exp === 0 ? <span>ROOKIE</span> : <span>EXP {player.years_exp}</span>}</p>
    //             <div className="d-flex align-items-center" style={{fontSize:"11.5px"}}>
    //                 <p className="m-0" style={{color:"#b0b0b2", width:"60px"}}>rank <span style={{color:"white"}}>{player.rank}</span></p>
    //                 <p className="m-0" style={{color:"#b0b0b2", width:"60px"}}>age <span style={primeIndicator(player.age, thresholds)}>{player.age}</span></p>
    //                 <div className="d-flex align-items-center" style={{width:"80px"}}>
    //                     <p className="m-0" style={{color:"#b0b0b2"}}>value</p>
    //                     <p className="m-0 mx-1">{player.value}</p>
    //                 </div>
    //                 {tab !== "Dynasty" ?
    //                     <div className="d-flex align-items-center">
    //                         {getTotalPts(league, matches, roster.roster_id, player.player_id).maxPts === getTotalPts(league, matches, roster.roster_id, player.player_id).pts ?
    //                             <span style={{color:"white"}}>{getTotalPts(league, matches, roster.roster_id, player.player_id).pts}</span>
    //                         :
    //                             <p className="m-0">
    //                                 <span style={{color:"white"}}>{getTotalPts(league, matches, roster.roster_id, player.player_id).pts}</span>
    //                                 <span className="bold"style={{color:"#718396"}}>/</span>
    //                                 <span style={{color:"#c5c5c5"}}>{getTotalPts(league, matches, roster.roster_id, player.player_id).maxPts}</span>
    //                             </p>
    //                         }
    //                         <p className="m-0" style={{color:"#b0b0b2"}}>pts</p>
    //                     </div>
    //                 :<></>
    //                 }
    //             </div>
    //         </div>
    //     </div>
    // );
    return (
        <div className="py-4" style={{minWidth:"388px"}}>
            <div className="d-flex align-items-center justify-content-between pb-3" style={{borderBottom:"3px solid #2a2c3e"}}>
                {/* <div className="d-flex align-items-center bold" style={{color:"lightgrey"}}>
                    <Icon icon="game-icons:american-football-player"style={{color:"#a9dfd8",fontSize:"24px", marginRight:"4px"}}/>
                    <div className="d-flex align-items-center">
                        <p className="m-0">{playerCount} </p>
                        <p className="m-0 mx-1">Players</p>
                    </div>
                </div>
                <div className="d-flex align-items-center" style={{fontFamily:"Arial",fontSize:"14.5px",}}>
                    <div className=" d-flex align-items-center" style={{minWidth:"85px"}}>
                        <Icon icon="material-symbols:avg-pace-sharp" style={{fontSize:"24px", color:"#a9dfd8",marginRight:"4px"}}/>
                        <p className="m-0 d-flex align-items-center">{avgTeamAge}</p>
                    </div>
                    
                    <div className="d-flex align-items-center" style={{minWidth:"85px"}}>
                        <Icon icon="fluent:person-tag-20-regular" style={{fontSize:"24px", color:"#a9dfd8", marginRight:"4px"}}/>
                        <p className="m-0">{roster.kct.teamTotal}</p>
                    </div>
                    {tab !== "Dynasty"?
                        <div className="d-flex align-items-center">
                            <p className="m-0">{totalTeamPts}</p>
                            <span className="bold"style={{color:"#718396"}}>/</span>
                            <p className="m-0">{totalTeamMaxPts}</p>
                            <p className="m-0" style={{color:"#a9dfd8", paddingRight:"4px"}}>pts</p>
                        </div> 
                    :<></>
                    }
                </div> */}
            </div>
            {/* <div className="d-flex flex-wrap">
                <div className="col">
                    {positionHeader(qbArrow, showMoreQBs, playerStats[0].count, "QB", "#f8296d", qbRankings, playerStats[0].avgAge, roster.kct.qb.total, playerStats[0].totalPts)}
                    {showQBs ? roster.kct.qb.players.map((player, i) => playerProfileRow(player, i, getPrimeIndicatorColor, playerTypes[0].thresholds)) : playerProfileRow(topQB, 0, getPrimeIndicatorColor, playerTypes[0].thresholds)}
                </div>
                <div className="col">
                    {positionHeader(rbArrow, showMoreRBs, playerStats[1].count, "RB", "#36ceb8", rbRankings, playerStats[1].avgAge, roster.kct.rb.total, playerStats[1].totalPts)}
                    {showRBs ? roster.kct.rb.players.map((player, i) => playerProfileRow(player, i, getPrimeIndicatorColor, playerTypes[1].thresholds)) : playerProfileRow(topRB, 0, getPrimeIndicatorColor, playerTypes[1].thresholds)}   
                </div>
                <div className="col">
                    {positionHeader(wrArrow, showMoreWRs, playerStats[2].count, "WR", "#58a7ff", wrRankings, playerStats[2].avgAge, roster.kct.wr.total, playerStats[2].totalPts)}
                    {showWRs ? roster.kct.wr.players.map((player, i) => playerProfileRow(player, i, getPrimeIndicatorColor, playerTypes[2].thresholds)) : playerProfileRow(topWR, 0, getPrimeIndicatorColor, playerTypes[2].thresholds)}
                </div>
                <div className="col">
                    {positionHeader(teArrow, showMoreTEs, playerStats[3].count, "TE", "#faae58", teRankings, playerStats[3].avgAge, roster.kct.te.total, playerStats[3].totalPts)}
                    {showTEs ? roster.kct.te.players.map((player, i) => playerProfileRow(player, i, getPrimeIndicatorColor, playerTypes[3].thresholds)) : playerProfileRow(topTE, 0, getPrimeIndicatorColor, playerTypes[3].thresholds)}
                </div>
            </div> */}
        </div>
    )
}