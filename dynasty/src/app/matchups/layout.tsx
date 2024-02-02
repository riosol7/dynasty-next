import React from "react";
import styles from "./Matchups.module.css";
import * as Interfaces from "@/interfaces";
import MatchupNav from "@/components/navigation/MatchupNav";

export default function MatchupsLayout({ children }: Interfaces.MatchupsLayoutProps) {
  return (
    <div>
      <MatchupNav/>
      <div className={styles.body}>
        {children}
      </div>
    </div>
  );
}
