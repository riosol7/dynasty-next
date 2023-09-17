"use client";
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { LEAGUE_ID, SERVER_URL } from "@/constants";
import * as Interfaces from "../../interfaces";

const LeagueContext = createContext<Interfaces.LegacyLeagueContextType | undefined>(undefined);

export const useLeagueContext = () => {
    const context = useContext(LeagueContext);
    if (!context) {
        throw new Error("useLeagueContext must be used within a LeagueProvider");
    }
    return context;
};

export const LeagueProvider = ({ children }: Interfaces.ChildrenProps) => {
    const [legacyLeague, setLegacyLeague] = useState<Interfaces.League[]>(Interfaces.defaultLegacyLeague);
    const [loadLegacyLeague, setLoadLegacyLeague] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const call = await fetch(`${SERVER_URL}league/${LEAGUE_ID}`);
                const parsedData = await call.json();
                setLegacyLeague(parsedData);
                setLoadLegacyLeague(false);
                console.log("fetchLegacyLeague:", parsedData);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const contextValue: Interfaces.LegacyLeagueContextType = { legacyLeague, loadLegacyLeague };

    return (
        <LeagueContext.Provider value={contextValue}>{children}</LeagueContext.Provider>
    );
};
