"use client";
import Image from "next/image";
import { Icon } from "@iconify-icon/react";
import React, { useState, useEffect } from "react";
import styles from "./TransactionList.module.css";
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
import { allUsers, findLogo, findPlayerByID, findUserByOwnerID, findUserByRosterID, getSortedTransactionRecords, processPlayers, processTransactions, toDateTime } from "@/utils";
import { PLAYER_BASE_URL, POSITION_COLORS, SLEEPER_AVATAR_BASE_URL } from "@/constants";
import * as Interfaces from "@/interfaces";
import SLEEPER_IMG from "@/assets/images/sleeper.png";

export default function TransactionList() {
  const { fantasyMarket } = useFantasyMarket()!;
  const { legacyLeague } = useLeagueContext();
  const { players, loadPlayers } = usePlayerContext();
  const { ktc, loadKTC } = useKTCContext();
  const { superFlex, loadSuperFlex } = useSuperFlexContext();
  const { fc, loadFC } = useFantasyCalcContext();
  const { dp, loadDP } = useDynastyProcessContext();
  const { fantasyPro, loadFantasyPro } = useFantasyProContext();
  const [asc, setAsc] = useState(false);
  const [sort, setSort] = useState("DATE");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(15);
  const [selectOwner, setSelectOwner] = useState("");
  const [selectPosition, setSelectPosition] = useState("");
  const [selectSelectSeason, setSelectSeason] = useState("All Time");
  const users = allUsers(legacyLeague);
  const processedPlayers = processPlayers(players, ktc, superFlex, fc, dp, fantasyPro);
  const transactions = processTransactions(legacyLeague);
  const failedTransactions = transactions.filter(transaction => transaction.status === "failed");
  const successfulTransactions = transactions.filter(transaction => transaction.status === "complete");
  const filteredTransactions = successfulTransactions;
  const records = getSortedTransactionRecords(filteredTransactions, sort, asc, currentPage, recordsPerPage);
  
  const handleShowPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valueAsNumber = +e.target.value;
    setRecordsPerPage(valueAsNumber);
  };

  const handlePosition = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectPosition(e.target.value);
  };

  const handleOwner = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectOwner(e.target.value);
  };

  const paginate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valueAsNumber = +e.target.value;
    setCurrentPage(valueAsNumber);
  };
   
  const handleSeason = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectSeason(e.target.value);
  };
  
  return (
    <div className={styles.transactionList}>
      <p className="flex items-center justify-between font-bold px-4 py-3 border-b border-[#111827]">
        Transactions <Icon icon="uiw:more" className={styles.hover}/>
      </p>
      <div>
      {records.map((record, i) => {
        const creator = findUserByOwnerID(record.creator, users);
        return(
        <div key={i} className={`py-2 ${i !== records.length - 1 ? styles.solidRow : ""} px-4`}>
          <div className={`flex items-center text-sm`}>
            <div className={`mr-1 ${styles.ownerImage}`} style={{backgroundImage:`url(${SLEEPER_AVATAR_BASE_URL}${creator.avatar})`}}></div>
            <div>
              <p className="text-xs">{toDateTime(record.created)}</p>
              <p>{record.type === "comissioner" ?
                "Commissioner made a move"
              : record.type === "trade" ? 
                `${creator.display_name}'s trade completed`
              : (record.type === "waiver" || record.type === "free_agent") && record.drops === null ?
                `${creator.display_name} signed`
              : (record.type === "waiver" || record.type === "free_agent") && record.adds === null ?
                `${creator.display_name} released FA`
              : record.type === "waiver" || record.type === "free_agent" ?
                `${creator.display_name} made a move` : ""
              }</p>
            </div>
          </div>          
          <div>
            {record.adds ? Object.keys(record.adds)?.map((pID, idx)=> {
              const user = findUserByRosterID(record.adds[pID], legacyLeague[0]);
              const player = findPlayerByID(pID, processedPlayers);
              return (
                <div key={idx}>
                  <div className="flex items-center py-2">
                    <div style={{border: `2px solid ${POSITION_COLORS[player.position as keyof typeof POSITION_COLORS]}`, borderRadius:"50%", padding:".2em"}}>
                      <div className={styles.headshot} style={{ 
                        backgroundImage: player.position === "DEF" ? `url(${findLogo(player.team).l})` : `url(${PLAYER_BASE_URL + player.player_id}.jpg)`, 
                        display: "flex", alignItems:"end", justifyContent:"end"}}>
                        <Icon icon="ph:user-circle-plus-duotone" style={{ borderRadius: "50%", backgroundColor: "black", color: POSITION_COLORS[player.position as keyof typeof POSITION_COLORS], fontSize:"1.5em" }}/>
                      </div>
                    </div>
                    <div className="ml-1 text-xs">
                      {record.type === "trade" ? <p className="flex items-center"><Icon icon="game-icons:cycle" className={styles.icon}/>{user.display_name}</p> : ""}
                      <p className="text-sm font-bold">{player.position === "DEF" ? `${player.first_name} ${player.last_name}` : player.full_name}</p>
                      <p className="text-gray-400">{player.position === "DEF" ? "" : "#"}{player.number} {player.team} - {player.position}</p>
                      <p className="flex items-center">
                        <Icon icon="mdi:tag-plus-outline" className={styles.icon}/>
                        {(player[fantasyMarket as keyof typeof player] as Interfaces.MarketContent).value || 0}
                      </p>
                    </div>
                  </div>
                  {record.waiver_budget && record.type === "trade" ?
                    record.waiver_budget.map(((transaction, index) => 
                    <div key={index} className="text-xs flex items-center">
                      <Image src={SLEEPER_IMG} width={65} height={65} alt={""} style={{borderRadius: "50%", marginInline: ".2em"}}/>
                      <div className="ml-1">
                        <p className="flex items-center"><Icon icon="game-icons:cycle" className={styles.icon}/>{findUserByRosterID(transaction.receiver, legacyLeague[0]).display_name}</p>
                        <p className="text-sm font-bold">FAAB</p>
                        <p>$ {transaction.amount}</p>
                      </div>
                    </div>
                    ))
                  :<></>}
                </div>
              );
            }): Object.keys(record.drops)?.map((pID, idx)=> {
              const user = findUserByRosterID(record.drops[pID], legacyLeague[0]);
              const player = findPlayerByID(pID, processedPlayers);
              return (
                <div key={idx} className="flex items-center py-2">
                  <div style={{border: `2px solid ${POSITION_COLORS[player.position as keyof typeof POSITION_COLORS]}`, borderRadius:"50%", padding:".2em"}}>
                    <div className={styles.headshot} style={{ 
                      backgroundImage: player.position === "DEF" ? `url(${findLogo(player.team).l})` : `url(${PLAYER_BASE_URL + player.player_id}.jpg)`, 
                      display: "flex", alignItems:"end", justifyContent:"end"}}>
                      <Icon icon="ph:user-circle-minus-duotone" style={{ borderRadius: "50%", backgroundColor: "black", color: POSITION_COLORS[player.position as keyof typeof POSITION_COLORS], fontSize:"1.5em" }}/>
                    </div>
                  </div>
                  <div className="ml-1 text-xs">
                    <p className="text-sm font-bold">{player.position === "DEF" ? `${player.first_name} ${player.last_name}` : player.full_name}</p>
                    <p className="text-gray-400">{player.position === "DEF" ? "" : "#"}{player.number} {player.team} - {player.position}</p>
                    <p className="flex items-center">
                      <Icon icon="mdi:tag-minus-outline" className={styles.icon}/>
                      {(player[fantasyMarket as keyof typeof player] as Interfaces.MarketContent)?.value || 0}
                    </p>                  
                    </div>
                </div>
              );
            })}
          </div>
        </div>
      )})}
      </div>
    </div>
  );
};
