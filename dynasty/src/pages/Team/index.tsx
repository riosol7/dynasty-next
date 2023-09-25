"use client";
import React, { useState } from "react";
import TeamLayout from "@/layouts/Team";
import { useLeagueContext } from "@/context";
import { findTeamByName } from "@/utils";

export default function TeamPage({ name }: { name: string }) {
    const { legacyLeague } = useLeagueContext();
    const [tab, setTab] = useState("Summary");

    const team = findTeamByName(name, legacyLeague); // This currently returns the desired league... need to return just the roster;

    return (
        <TeamLayout tab={tab} setTab={setTab}>
        {tab === "Summary" ?
            <></>
        :<></>
        }
        </TeamLayout>
    );
};