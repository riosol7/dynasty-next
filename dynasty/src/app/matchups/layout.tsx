"use client";
import React, { useEffect, useState } from "react";
import styles from "./Matchups.module.css";
import * as Interfaces from "@/interfaces";
import MatchupNav from "@/components/navigation/MatchupNav";
import { useLeagueContext } from "@/context";
import { getMatchups } from "@/utils";

export default function MatchupsLayout({ children }: Interfaces.MatchupsLayoutProps) {
  const { legacyLeague } = useLeagueContext();
  const matchups = getMatchups(legacyLeague[0].matchups);
  const currentWeek: number = matchups.map(weeks => weeks.filter((week: Interfaces.Match[]) => week[0].points !== 0))
    .filter(week => week.length > 0).length || 0;
  const [selectWeek, setSelectWeek] = useState<number>(currentWeek);

  useEffect(() => {
    if (selectWeek === 0 || selectWeek === undefined) {
      setSelectWeek(currentWeek);
    }
  }, [currentWeek, selectWeek]);
  console.log("selectWeekLayout: ", selectWeek);

  return (
    <div>
      <MatchupNav selectWeek={selectWeek} setSelectWeek={setSelectWeek} />
      <div className={styles.body}>
        {children}
      </div>
    </div>
  );
}
