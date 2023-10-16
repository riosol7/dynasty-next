"use client";
import React, { useState, useEffect } from "react";
import styles from "./TransactionList.module.css";
import { 
  useDynastyProcessContext, 
  useFantasyCalcContext, 
  useFantasyProContext, 
  useKTCContext, 
  useLeagueContext, 
  usePlayerContext, 
  useSuperFlexContext 
} from "@/context";
import { allUsers, findPlayerByID, findUserByOwnerID, getSortedTransactionRecords, processPlayers, processTransactions, toDateTime } from "@/utils";

export default function TransactionList() {
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
    setSelectPosition(e.target.value)
  };

  const handleOwner = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectOwner(e.target.value)
  };
  const paginate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valueAsNumber = +e.target.value;
    setCurrentPage(valueAsNumber)
  };
  const handleSeason = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectSeason(e.target.value);
  };

  
  return (
    <div>
      <p></p>
      <div>
      {records.map((record, i) => 
        <div key={i}>
          <p>{findUserByOwnerID(record.creator, users).display_name}</p>
          <p>{toDateTime(record.created)}</p>
        </div>
      )}
      </div>
    </div>
  );
};
