"use client";
import React, { useState } from "react";
import TeamLayout from "@/layouts/Team";

export default function TeamPage({ name }: { name: string }) {
    const [tab, setTab] = useState("Summary");

    return (
        <TeamLayout tab={tab} setTab={setTab} name={name}>
        {tab === "Summary" ?
            <></>
        : tab === "Dynasty" ? 
        <></>
        : tab === "Power" ? <></> : <></>
        }
        </TeamLayout>
    );
};